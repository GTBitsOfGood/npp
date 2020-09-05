import * as React from "react";
import { AppProps } from "next/app";
import "focus-visible/dist/focus-visible.min.js";
import "normalize.css";
import "../styles/App.scss";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <div id="content">
      <Component {...pageProps} />
    </div>
    <div id="portalRoot" />
  </>
);

export default MyApp;
