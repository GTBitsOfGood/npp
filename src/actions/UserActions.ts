import { signIn, signOut } from "next-auth/client";
import urls from "&utils/urls";

import { callInternalAPI } from "&server/utils/ActionUtils";
import { HttpMethod } from "&server/models/HttpMethod";
import { User } from "&server/models/User";

export const login = (): Promise<void> =>
  signIn("auth0", {
    callbackUrl: `${urls.baseUrl}${urls.pages.app.index}`,
  });

export const logout = (): Promise<void> =>
  signOut({ callbackUrl: `${urls.baseUrl}${urls.pages.index}` });

const userRoute = urls.api.user;

async function getUserById(objectId: string): Promise<User> {
  const response: Record<string, any> = await callInternalAPI(
    userRoute + `?id=${objectId}`,
    HttpMethod.GET
  );
  return userFromJsonResponse(response);
}

async function getUserByEmail(email: string): Promise<User> {
  const response: Record<string, any> = await callInternalAPI(
    userRoute + `?email=${email}`,
    HttpMethod.GET
  );
  return userFromJsonResponse(response);
}

/**
 * The intersection type is an artifact of the TypeORM id issue
 * @param object
 */
function userFromJsonResponse(object: {
  [key: string]: any;
}): User & { id: string } {
  return {
    id: object.id,
    email: object.email,
    emailVerified: object.emailVerified,
    familyName: object.familyName,
    image: object.image,
    name: object.name,
    nickname: object.nickname,
    roles: object.roles,
    organizationVerified: object.organizationVerified,
  };
}

export default {
  getUserById,
  getUserByEmail,
};
