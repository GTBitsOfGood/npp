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
    <div className="landingPage">
      <h1>Welcome to Nonprofit Portal</h1>

      <Statusbar status={0} />
    </div>
  );
};

export default IndexPage;
