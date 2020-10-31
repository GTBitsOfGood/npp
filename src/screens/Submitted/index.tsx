import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";

// Styling
import classes from "./SubmittedScreen.module.scss";

const SubmittedScreen: React.FC = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const message =
    "As a partner, Bits of Good will help you build software that turns your need into real productLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut";

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={classes.root}>
      <h1>Application Submitted!</h1>

      <div className={classes.statusbar}>
        <Statusbar status={0}></Statusbar>
      </div>
      <div className={classes.submitMsg}>
        <h5>{message}</h5>
      </div>
    </div>
  );
};

export default SubmittedScreen;
