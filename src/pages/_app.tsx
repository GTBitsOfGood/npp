/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */
import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "next-auth/client";
import Header from "../components/Header";
import "focus-visible/dist/focus-visible.min.js";
import "normalize.css";
import "../styles/App.scss";

const MyApp: React.FC<AppProps> = ({
  Component,
  pageProps,
  router,
}: AppProps) => (
  <>
    <Head>
      <title>npp</title>
    </Head>
    <Provider session={pageProps.session}>
      <div className="App">
        <Header currentRoute={router.asPath} />
        <div className="Content">
          <Component {...pageProps} />
        </div>
      </div>
    </Provider>
  </>
);

export default MyApp;
