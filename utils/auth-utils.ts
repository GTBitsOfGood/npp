import {
  Session,
  useSession as nextAuthUseSession,
  getSession as nextAuthGetSession,
} from "next-auth/client";
import { Organization } from "&server/models/Organization";
import { SessionUser } from "&server/models/SessionUser";
import { NextApiRequest } from "next";

import stringSimilarity from "string-similarity";
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

export async function verifyOrg(organization: Organization): Promise<boolean> {
  try {
    const ein = organization.ein.replace("-", "");
    const url = `https://projects.propublica.org/nonprofits/api/v2/organizations/${ein}.json`;

    // npp instance of cors-anywhere proxy, adds headers to cross-origin requests
    const json = await (await fetch(`https://bog-npp.herokuapp.com/${url}`)).json();

    // autoverify organization if the nonprofit name returned
    // by propublica's api has greater than 1/3 similarity to
    // the name provided when applying
    return (
      stringSimilarity.compareTwoStrings(
        json.organization.name.toLowerCase(),
        organization.organizationName.toLowerCase()
      ) > 0.333
    );
  } catch (error) {
    // reject autoverification if the provided ein doesn't
    // match any of those listed in propublica's database
    return false;
  }
}
