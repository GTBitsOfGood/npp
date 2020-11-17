import {
  Session,
  useSession as nextAuthUseSession,
  getSession as nextAuthGetSession,
} from "next-auth/client";
import { SessionUser } from "&server/models/SessionUser";
import { NextPageContext, NextApiRequest } from "next";

export type NPPSession = Session & { user: SessionUser };

export function useSession(): [NPPSession, boolean] {
  const [session, loading] = nextAuthUseSession();
  return [session as NPPSession, loading];
}

export function getSession(
  context?: NextPageContext & { req?: NextApiRequest }
): Promise<NPPSession | null> {
  return nextAuthGetSession(context) as Promise<NPPSession | null>;
}
