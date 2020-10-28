import React from "react";

// Libraries
import clsx from "clsx";

// Styling
import classes from "./Status.module.scss";

type StatusNumber = 0 | 1 | 2 | 3 | 4;

interface StatusBarProps {
  status: StatusNumber;
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
            <div
              className={clsx(
                classes.line,
                status >= index && classes.activeLine
              )}
            />

            <div className={classes.circlePadding}>
              <div
                className={clsx(
                  classes.statusCircle,
                  status >= index && classes.activeCircle
                )}
              />
            </div>
          </div>
          <h3>{statusText}</h3>
        </div>
      ))}
    </div>
  );
};

export default Statusbar;
