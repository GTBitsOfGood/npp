import React from "react";

// Components
import Statusbar from "&components/Statusbar";
import ButtonLink from "&components/ButtonLink";

// Styling
import classes from "./ProjectPage.module.scss";

import urls from "&utils/urls";

const ProjectPage = () => {
  return (
    <div className="applicationPage">
      <div className={classes.root}>
        <h1>Apply for a New Project</h1>

        <h5>
          As a partner, Bits of Good will help you build software that turns
          your need into real productLorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut
        </h5>
        <Statusbar status={-1} />

        {/* insert image here*/}

        <ButtonLink variant="primary" href={urls.pages.app.apply}>
          <h3>Apply Now</h3>
        </ButtonLink>
      </div>
    </div>
  );
};

export default ProjectPage;
