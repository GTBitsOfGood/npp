import { signIn, signOut } from "next-auth/client";
import urls from "&utils/urls";

import { callInternalAPI } from "&server/utils/ActionUtils";
import { HttpMethod } from "&server/models/HttpMethod";
import { User } from "&server/models/User";
import { Organization } from "&server/models/Organization";

export const login = (): Promise<void> =>
  signIn("auth0", {
    callbackUrl: `${urls.baseUrl}${urls.pages.app.index}`,
  });

export const logout = (): Promise<void> =>
  signOut({ callbackUrl: `${urls.baseUrl}${urls.pages.index}` });

const userRoute = urls.api.user;

export async function getUserById(objectId: string): Promise<DetailedUser> {
  const response: Record<string, any> = await callInternalAPI(
    userRoute + `?id=${objectId}`,
    HttpMethod.GET
  );
  return userFromJsonResponse(response);
}

export async function getUserByEmail(email: string): Promise<DetailedUser> {
  const response: Record<string, any> = await callInternalAPI(
    userRoute + `?email=${email}`,
    HttpMethod.GET
  );
  return userFromJsonResponse(response);
}

export async function updateOrganizationForUser(
  userId: string,
  organization: Organization
): Promise<DetailedUser> {
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

export async function updateOrganizationVerifiedStatus(
  userId: string,
  organizationVerified: boolean
): Promise<DetailedUser> {
  const response: Record<string, any> = await callInternalAPI(
    userRoute,
    HttpMethod.POST,
    {
      id: userId,
      organizationVerified,
    }
  );
  return userFromJsonResponse(response);
}

function userFromJsonResponse(object: { [key: string]: any }): DetailedUser {
  return object as User & { id: string } & { organization?: Organization };
}

/**
 * The intersection type is an artifact of the TypeORM id issue
 * @param object
 */
export type DetailedUser = User & { id: string } & {
  organization?: Organization;
};
