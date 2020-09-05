import { signIn, signOut } from "next-auth/client";
import urls from "../../utils/urls";

export const login = () =>
  signIn("auth0", {
    callbackUrl: urls.baseUrl + urls.pages.app.index,
  });

export const logout = () =>
  signOut({ callbackUrl: urls.baseUrl + urls.pages.index });
