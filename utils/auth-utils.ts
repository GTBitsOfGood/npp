import {
  Session,
  useSession as nextAuthUseSession,
  getSession as nextAuthGetSession,
} from "next-auth/client";
import { SessionUser } from "&server/models/SessionUser";
import { NextApiRequest } from "next";

export type NPPSession = Session & { user: SessionUser };

// Client side
export function useSession(): [NPPSession, boolean] {
  const [session, loading] = nextAuthUseSession();
  return [session as NPPSession, loading];
}

// Server side
export function getSession(req: NextApiRequest): Promise<NPPSession | null> {
  return nextAuthGetSession({ req }) as Promise<NPPSession | null>;
}
