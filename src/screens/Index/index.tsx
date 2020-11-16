import React from "react";

// Components
import Button from "&components/Button";

// Iconography
import LeftWave from "&icons/LeftWave";
import RightWave from "&icons/RightWave";
import WavePersonIcon from "&icons/WavePersonIcon";
import StartProjectIcon from "&icons/StartProjectIcon";
import ReportProblemIcon from "&icons/ReportProblemIcon";

// Actions
import { login } from "&actions/UserActions";

// Styling
import classes from "./IndexPage.module.scss";

const IndexPage = () => (
  <div className={classes.root}>
    <div className={classes.header}>
      <div className={classes.background}>
        <div className={classes.content}>
          <h1>Non-profit Portal</h1>
          <h5>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna do eiusmod
            tempor incididunt ut labore et dolore magna
          </h5>

          <Button onClick={login}>
            <h3>Log In</h3>
          </Button>

          <p>
            {"Don't have an account? "}
            <span role="button" onClick={login} onKeyPress={login} tabIndex={0}>
              Sign Up
            </span>
          </p>
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

        <div className={classes.textContent}>
          <h1>Start a New Project with us</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna
          </p>
        </div>
      </div>

      <div className={classes.section}>
        <div className={classes.textContent}>
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

IndexPage.showSidebar = false;
IndexPage.isLanding = false;
