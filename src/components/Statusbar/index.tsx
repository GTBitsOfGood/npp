import React from "react";

// Libraries
import clsx from "clsx";

// Styling
import classes from "./Status.module.scss";
interface StatusBarProps {
  status?: number;
}

const currentStatus = [
  "Application Submitted",
  "Schedule an Interview",
  "Interview Scheduled",
  "Under Review",
  "Decision Made",
];

const Statusbar = ({ status }: StatusBarProps) => {
  return (
    <div className={classes.root}>
      {currentStatus.map((statusText, index) => (
        <div key={statusText} className={classes.status}>
          <div className={classes.circleWrapper}>
            <div className={classes.line} />
            <div className={classes.circlePadding}>
              <div
                className={clsx(
                  classes.statusCircle,
                  status === index && classes.activeCircle
                )}
              />
            </div>
          </div>
          <p>{statusText}</p>
        </div>
      ))}
    </div>
  );
};

export default Statusbar;
