import NextAuth from "next-auth";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { SessionUser } from "&server/models/SessionUser";
import * as Authentication from "&server/utils/Authentication";
import BitsAuth0Provider from "&server/auth/BitsAuth0Provider";
import { upsertUserByProviderProfile } from "&server/mongodb/actions/UserManager";

export type AuthSession = {
  user: SessionUser;
  expiresAt: string;
  accessToken?: string;
};

const options = {
  debug: !!parseInt(process.env.DEBUG_AUTH ?? "0"),
  providers: [BitsAuth0Provider],
  session: {
    jwt: true,
  },
  events: {},
  callbacks: {
    // This is called when generating the jwt. It is also called after deserializing a JWT
    jwt: (async (
      token: SessionUser | { name: string; email: string; picture: string },
      user: unknown,
      account: unknown,
      auth0Profile: any
    ): Promise<SessionUser> => {
      if (!auth0Profile) {
        // the token has already been generated; assume it is the SessionUser
        return token as SessionUser;
      }
      // in case we decide to switch back; can be made more efficient, keep the function in the provider
      const profile = BitsAuth0Provider.profile(auth0Profile);
      const dbUser = await upsertUserByProviderProfile(profile);
      return {
        ...profile,
        id: dbUser._id.toString(),
        isAdmin: profile.roles.includes(Authentication.ADMIN_ROLE),
        // for users created before the organizationVerified field was added
        organizationVerified: !!dbUser.organizationVerified,
      };
    }) as any,
    // the default session does not include our custom UserSessions fields, add them here
    session: (async (
      defaultSessionPayload: { expiresAt: string; accessToken?: string },
      jwtPayload: SessionUser
    ): Promise<AuthSession> => {
      return Promise.resolve({
        ...defaultSessionPayload,
        user: jwtPayload,
      });
    }) as any,
  },
};

const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);

export default handler;
