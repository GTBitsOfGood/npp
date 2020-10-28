import React, { useEffect, useState } from "react";

// Components
import Statusbar from "&components/Statusbar";

// Actions
import { helloWorld } from "&actions/General";

// Styling
import classes from "./IndexPage.module.scss";

const IndexPage = () => {
  const [payload, setPayload] = useState("");

  useEffect(() => {
    // Example how to create page without ssr
    helloWorld()
      .then((resp) => {
        setPayload(resp.message as string);
      })
      .catch(() => {
        setPayload("Failed to fetch!");
      });
  }, []);

  return (
    <>
      <h2 className={classes.centerText}>Welcome to Next.js!</h2>
      <h3>
        This page is static rendered, because all API calls are made in
        useEffect
      </h3>
      <h4>CSR Message: {payload}</h4>
      <p>You can tell because the text above flashes on page refresh</p>

      <Statusbar status={2} />
    </>
  );
};

export default IndexPage;
