import {
  Session,
  useSession as nextAuthUseSession,
  getSession as nextAuthGetSession,
} from "next-auth/client";
import { Organization } from "&server/models/Organization";
import { SessionUser } from "&server/models/SessionUser";
import { NextApiRequest } from "next";

import urls from "&utils/urls";

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

export function getUserOrg(session: Session): Promise<Organization> {
  const query = new URLSearchParams({ email: session.user.email });
  return fetch(`${urls.baseUrl}${urls.api.user}/?${query}`, {
    method: "get",
    mode: "same-origin",
    credentials: "include",
  }).then(async (response) => {
    const json = await response.json();
    return json.payload.organization;
  });
}
