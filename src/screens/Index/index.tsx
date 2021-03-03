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

// Utils
import { useSession } from "&utils/auth-utils";

const IndexPage = () => {
  const [session, loading] = useSession();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.background}>
          <div className={classes.content}>
            <h1>Non-profit Portal</h1>
            <h5>
              We build software, websites, and mobile apps to turn your ideas
              into real products. If you have an existing project or a team, we
              are happy to get involved in your development cycle.
            </h5>

            {(() => {
              if (session) {
                return (
                  <div>
                    <p>
                      To start using the portal, please verify your account.
                    </p>
                    <Button onClick={login}>
                      <h3>Verify Account</h3>
                    </Button>
                  </div>
                );
              } else {
                return (
                  <div>
                    <Button onClick={login}>
                      <h3>Log In</h3>
                    </Button>
                    <p>
                      {"Don't have an account? "}
                      <span
                        role="button"
                        onClick={login}
                        onKeyPress={login}
                        tabIndex={0}
                      >
                        Sign Up
                      </span>
                    </p>
                  </div>
                );
              }
            })()}
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
              Have a great idea for how a website or mobile application can help
              your nonprofit reach more people? Let us know, and we can build it
              for you!
            </p>
          </div>
        </div>

        <div className={classes.section}>
          <div className={classes.textContent}>
            <h1 className={classes.textRight}>Project Maintenance</h1>
            <p className={classes.textRight}>
              Have a completed product for Bits of Good that requires bug fixes
              or maintenance? Let us know, and we can fix it for you!
            </p>
          </div>

          <ReportProblemIcon className={classes.reportProblemIcon} />
        </div>
      </div>
    </div>
  );
};

export default IndexPage;

IndexPage.showSidebar = false;
IndexPage.isLanding = false;
