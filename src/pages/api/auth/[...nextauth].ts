import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const options = {
  providers: [
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      domain: process.env.AUTH0_DOMAIN as string,
    }),
  ],
  database: process.env.DATABASE_URL,
};

const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);

export default handler;
