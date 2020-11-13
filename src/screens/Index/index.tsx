import React from "react";

// Components
import Button from "&components/Button";
import LeftWave from "&screens/Index/LeftWave";
import RightWave from "&screens/Index/RightWave";
import WavePersonIcon from "&screens/Index/WavePersonIcon";
import StartProjectIcon from "&screens/Index/StartProjectIcon";
import ReportProblemIcon from "&screens/Index/ReportProblemIcon";

import { login } from "&actions/UserActions";

// Styling
import classes from "./IndexPage.module.scss";

const IndexPage = () => (
  <div className={classes.root}>
    <div className={classes.header}>
      <div className={classes.background}>
        <div className={classes.content}>
          <h1>Non-profit Portal</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna do eiusmod
            tempor incididunt ut labore et dolore magna
          </p>
          <Button onClick={login}>Log In</Button>
          <span>
            {"Don't have an account? "}
            <span role="button" onClick={login} onKeyPress={login} tabIndex={0}>
              Sign Up
            </span>
          </span>
        </div>
      </div>
      <div className={classes.waveContainer}>
        <LeftWave className={classes.startWave} />
        <div className={classes.personContainer}>
          <WavePersonIcon className={classes.wavePerson} />
        </div>
        <RightWave className={classes.endWave} />
      </div>
    </div>
    <div className={classes.sectionContainer}>
      <div className={classes.section}>
        <StartProjectIcon className={classes.startProjectIcon} />
        <div className={classes.content}>
          <h1>Start a New Project with us</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna
          </p>
        </div>
      </div>
      <div className={classes.section}>
        <div className={classes.content}>
          <h1 className={classes.textRight}>Project Maintenance</h1>
          <p className={classes.textRight}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna
          </p>
        </div>
        <ReportProblemIcon className={classes.reportProblemIcon} />
      </div>
    </div>
  </div>
);

export default IndexPage;
