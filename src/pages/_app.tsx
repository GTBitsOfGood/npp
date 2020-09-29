import React from "react";
import { AppProps } from "next/app";
import { DefaultSeo, SocialProfileJsonLd } from "next-seo";
import { Provider } from "next-auth/client";
import Header from "../components/Header";
import { defaultSeoConfig, profileSeoConfig } from "../../utils/seo";
import "focus-visible/dist/focus-visible.min.js";
import "normalize.css";
import "../styles/Fonts.scss";
import "../styles/App.scss";

const MyApp: React.FC<AppProps> = ({
  Component,
  pageProps,
  router,
}: AppProps) => (
  <>
    <DefaultSeo {...defaultSeoConfig} />
    <SocialProfileJsonLd {...profileSeoConfig} />
    <Provider session={pageProps.session}>
      <div id="app">
        <Header currentRoute={router.asPath} />
        <div id="content">
          <Component {...pageProps} />
        </div>
      </div>
    </Provider>
  </>
);

export default MyApp;
