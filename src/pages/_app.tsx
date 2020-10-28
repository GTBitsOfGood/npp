import React from "react";
import { AppProps } from "next/app";
import { DefaultSeo, SocialProfileJsonLd } from "next-seo";

// Authentication
import { Provider } from "next-auth/client";

// Components
import Header from "&components/Header";

// Styling
import "normalize.css";
import "&styles/App.scss";
import "&styles/Fonts.scss";

// Utils
import "focus-visible/dist/focus-visible.min.js";
import { defaultSeoConfig, profileSeoConfig } from "&utils/seo";

const MyApp = ({ Component, pageProps, router }: AppProps) => (
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
