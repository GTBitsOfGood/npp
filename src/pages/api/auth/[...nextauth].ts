import NextAuth from "next-auth";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { SessionUser } from "&server/models/SessionUser";
import { OrganizationStatus } from "&server/models/OrganizationStatus";
import * as Authentication from "&server/utils/Authentication";
import BitsAuth0Provider from "&server/auth/BitsAuth0Provider";
import {
  getUserByEmail,
  upsertUserByProviderProfile,
} from "&server/mongodb/actions/UserManager";

export type AuthSession = {
  user: SessionUser;
  expiresAt: string;
  accessToken?: string;
};

export type JwtPayload = SessionUser & {
  iat: number;
  exp: number;
};

const JWT_MAX_AGE = 30 * 24 * 60 * 60;

const options = {
  debug: !!parseInt(process.env.DEBUG_AUTH ?? "0"),
  providers: [BitsAuth0Provider],
  session: {
    jwt: true,
    maxAge: JWT_MAX_AGE,
  },
  events: {},
  callbacks: {
    // This is called when generating the jwt. It is also called after deserializing a JWT
    jwt: (async (
      token: JwtPayload | { name: string; email: string; picture: string },
      user: unknown,
      account: unknown,
      auth0Profile: any
    ): Promise<SessionUser> => {
      if (!auth0Profile) {
        token = token as JwtPayload;
        if (isTokenExpired(token)) {
          return refreshToken(token);
        }

        // the toke has already been generated; assume it is the SessionUser
        return token;
      }
      // in case we decide to switch back; can be made more efficient, keep the function in the provider
      const profile = BitsAuth0Provider.profile(auth0Profile);
      const dbUser = await upsertUserByProviderProfile(profile);
      return generateJwtPayloadFromDbUser(dbUser);
    }) as any,
    // the default session does not include our custom UserSessions fields, add them here
    session: (async (
      defaultSessionPayload: { expiresAt: string; accessToken?: string },
      jwtPayload: JwtPayload
    ): Promise<AuthSession> => {
      return Promise.resolve({
        ...defaultSessionPayload,
        user: jwtPayload,
      });
    }) as any,
  },
};

function isTokenExpired(jwtToken: JwtPayload): boolean {
  return jwtToken.orgStatus !== OrganizationStatus.Verified;
}

async function refreshToken(jwtToken: JwtPayload): Promise<SessionUser> {
  const user = await getUserByEmail(jwtToken.email);
  return generateJwtPayloadFromDbUser(user);
}

function generateJwtPayloadFromDbUser(
  dbUser: Record<string, any>
): SessionUser {
  return {
    id: dbUser._id.toString(),
    name: dbUser.name,
    email: dbUser.email,
    image: dbUser.image,
    familyName: dbUser.familyName,
    roles: dbUser.roles,
    isAdmin: dbUser.roles.includes(Authentication.ADMIN_ROLE),
    // for users created before the orgStatus field was added
    orgStatus: dbUser.orgStatus,
  };
}

const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);

export default handler;
