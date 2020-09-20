import NextAuth from "next-auth";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import BitsAuth0Provider from "./BitsAuth0Provider";
import Adapters from "next-auth/adapters";
import { UserTypeORM } from "./UserTypeORM";

const options = {
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
};

const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);

export default handler;
