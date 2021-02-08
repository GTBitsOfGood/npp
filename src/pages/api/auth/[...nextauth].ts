import NextAuth from "next-auth";
import Adapters from "next-auth/adapters";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import { User } from "&server/models";
import { UserTypeORM } from "&server/auth/UserTypeORM";
import { SessionUser } from "&server/models/SessionUser";
import * as Authentication from "&server/utils/Authentication";
import BitsAuth0Provider from "&server/auth/BitsAuth0Provider";

export type AuthSession = {
  user: SessionUser;
  expiresAt: string;
  accessToken?: string;
};

const options = {
  debug: !!parseInt(process.env.DEBUG_AUTH ?? "0"),
  providers: [BitsAuth0Provider],
  database: process.env.DATABASE_URL,
  /* The typescript definition for this function is wrong:
  See src for correct definition: https://github.com/nextauthjs/next-auth/blob/main/src/adapters/typeorm/index.js */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  adapter: (Adapters.TypeORM.Adapter as any)(process.env.DATABASE_URL, {
    models: {
      User: UserTypeORM,
    },
  }),
  events: {},
  callbacks: {
    session: (session: any, user: User): Promise<AuthSession> => {
      const newUser = {
        ...session.user,
        familyName: user.familyName,
        roles: user.roles,
        // See comment in @link /server/models/User.ts for why the User class does not include an "id" attribute
        id: (user as any)["id"],
        isAdmin: user.roles.includes(Authentication.ADMIN_ROLE),
        // could be null for the users before implemented
        organizationVerified: !!user.organizationVerified,
      };
      return Promise.resolve({
        ...session,
        user: newUser,
      } as AuthSession);
    },
  },
};

const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);

export default handler;
