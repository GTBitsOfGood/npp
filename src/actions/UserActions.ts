import { signIn, signOut } from "next-auth/client";
import urls from "&utils/urls";

import { callInternalAPI } from "&server/utils/ActionUtils";
import { HttpMethod } from "&server/models/HttpMethod";
import { OrganizationStatus } from "&server/models/OrganizationStatus";
import { Organization } from "&server/models/Organization";
import { User } from "&server/models/User";

export const login = (): Promise<void> =>
  signIn("auth0", {
    callbackUrl: `${urls.baseUrl}${urls.pages.index}`,
  });

export const logout = (): Promise<void> =>
  signOut({ callbackUrl: `${urls.baseUrl}${urls.pages.index}` });

const userRoute = urls.api.user;

export async function getUserById(objectId: string): Promise<User> {
  const response: Record<string, any> = await callInternalAPI(
    userRoute + `?id=${objectId}`,
    HttpMethod.GET
  );
  return userFromJsonResponse(response);
}

export async function getUserByEmail(email: string): Promise<User> {
  const response: Record<string, any> = await callInternalAPI(
    userRoute,
    HttpMethod.GET
  );
  return userFromJsonResponse(response);
}

export async function updateOrganizationForUser(
  userId: string,
  organization: Organization
): Promise<User> {
  const response: Record<string, any> = await callInternalAPI(
    userRoute,
    HttpMethod.PUT,
    {
      id: userId,
      organization,
    }
  );
  return userFromJsonResponse(response);
}

export async function updateOrgStatus(
  userId: string,
  orgStatus: OrganizationStatus
): Promise<User> {
  const response: Record<string, any> = await callInternalAPI(
    userRoute,
    HttpMethod.POST,
    {
      id: userId,
      orgStatus,
    }
  );
  return userFromJsonResponse(response);
}

function userFromJsonResponse(object: { [key: string]: any }): User {
  return object as User & { id: string } & { organization?: Organization };
}
