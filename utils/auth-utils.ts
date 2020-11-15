import { Session, useSession as nextAuthUseSession } from "next-auth/client";
import { SessionUser } from "&server/models/SessionUser";

export type NPPSession = Session & { user: SessionUser };

export function useSession(): [NPPSession, boolean] {
  const [session, loading] = nextAuthUseSession();
  return [session as NPPSession, loading];
}
