import Providers from "next-auth/providers";
import { Profile } from "../models/Profile";
const BITS_NAME_SPACE = "https://bitsofgood.org/";

const BitsAuth0Provider = Providers.Auth0({
  clientId: process.env.AUTH0_CLIENT_ID as string,
  clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
  domain: process.env.AUTH0_DOMAIN as string,
  authorizationUrl: `https://${process.env.AUTH0_DOMAIN}/authorize?response_type=code&prompt=login`,
} as any); // 'as any' to pass the new "authorizationUrl" to the auth provider. This will always prompt for login from the auth provider (for after signing out)
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
BitsAuth0Provider.profile = (auth0Profile: any): Profile => {
  return {
    email: (auth0Profile.email as string)?.toLowerCase(),
    emailVerified: auth0Profile.email_verified,
    id: auth0Profile.sub,
    image: auth0Profile.picture,
    name: auth0Profile.given_name,
    nickname: auth0Profile.nickname,
    familyName: auth0Profile.family_name,
    roles: auth0Profile[BITS_NAME_SPACE + "roles"],
  };
};

export default BitsAuth0Provider;
