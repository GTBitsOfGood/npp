import React, { useEffect, useState } from "react";

// Actions
import { helloWorld } from "&actions/General";

// Components
import Statusbar from "&components/Statusbar";
import Button from "&components/Button";

// Styling
import classes from "./ProjectPage.module.scss";

const ProjectPage = () => {
  const submit = () => {
    console.log("Starting Application");
  };

  return (
    <div className="projectPage">
      <div className={classes.root}>
        <h1>Apply for an New Project</h1>

        <h5>
          As a partner, Bits of Good will help you build software that turns
          your need into real productLorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut
        </h5>
        <div className={classes.statusBar}>
          <Statusbar status={-1} />
        </div>

        {/* insert image here*/}

        <Button variant="primary" onClick={submit}>
          <h3>Apply Now</h3>
        </Button>
      </div>
    </div>
  );
};

export default ProjectPage;
