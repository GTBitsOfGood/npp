import { DefaultSeoProps } from "next-seo/lib/types";
import { SocialProfileJsonLdProps } from "next-seo/lib/jsonld/socialProfile";
import urls from "./urls";

export const defaultSeoConfig: DefaultSeoProps = {
  title: "Nonprofit Portal",
  description:
    "A portal built to help nonprofits apply to work with Bits of Good",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: urls.baseUrl,
    site_name: "Bits of Good",
    images: [
      {
        url: "/static/large-logo.png",
        width: 1200,
        height: 628,
        alt: "Bits of Good large logo",
      },
      {
        url: "/static/small-logo.png",
        width: 128,
        height: 128,
        alt: "Bits of Good small logo",
      },
      {
        url: "/static/logo-512.png",
        width: 512,
        height: 512,
        alt: "Bits of Good 512px logo",
      },
      {
        url: "/static/logo-192.png",
        width: 128,
        height: 128,
        alt: "Bits of Good 192px logo",
      },
    ],
  },
};

export const profileSeoConfig: SocialProfileJsonLdProps = {
  type: "Organization",
  name: "Bits of Good",
  url: "https://bitsofgood.org",
  sameAs: [
    "https://www.facebook.com/GTBitsOfGood",
    "https://www.instagram.com/gtbitsofgood",
  ],
};
