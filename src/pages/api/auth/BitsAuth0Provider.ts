import Providers from "next-auth/providers";
import { Profile } from "./models/Profile.interface";
const BITS_NAME_SPACE = "https://bitsofgood.org/";

const BitsAuth0Provider = Providers.Auth0({
  clientId: process.env.AUTH0_CLIENT_ID as string,
  clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
  domain: process.env.AUTH0_DOMAIN as string,
});
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
BitsAuth0Provider.profile = (profile: any): Profile => {
  return {
    email: (profile.email as string)?.toLowerCase(),
    id: profile.sub,
    image: profile.picture,
    name: profile.given_name,
    nickname: profile.nickname,
    familyName: profile.family_name,
    roles: profile[BITS_NAME_SPACE + "roles"],
  };
};

export default BitsAuth0Provider;
