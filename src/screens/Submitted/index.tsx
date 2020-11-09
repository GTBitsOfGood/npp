import React from "react";

// Components
import Statusbar from "&components/Statusbar";

// Styling
import classes from "./SubmittedScreen.module.scss";

const SubmittedScreen: React.FC = () => {
  const message =
    "Your application has been submitted to the BoG team successfully! You will get an email notification after we finish reviewing your application. If we decide to move on with your project, the next step will be an interview to better understand your project and see if it’s a good fit for Bits of Good.";

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
