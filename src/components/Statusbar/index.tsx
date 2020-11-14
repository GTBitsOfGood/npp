import React from "react";

// Libraries
import clsx from "clsx";

import { StageType, stageToIndex } from "&server/models/StageType";
import { Application } from "&server/models/Application";

// Styling
import classes from "./Statusbar.module.scss";

interface StatusBarProps {
  application: Application | null;
}

const currentStatus = {
  "Application Submitted": StageType.SUBMITTED,
  "Schedule an Interview": StageType.AWAITING_SCHEDULE,
  "Interview Scheduled": StageType.SCHEDULED,
  "Under Review": StageType.REVIEW,
  "Decision Made": StageType.DECISION,
};

const Statusbar = ({ application }: StatusBarProps) => {
  const stageIndex =
    application == null || application.stage == null
      ? -1
      : stageToIndex[application.stage];

  return (
    <div className={classes.root}>
      {Object.entries(currentStatus).map(([statusText, stageType], index) => (
        <div key={statusText} className={classes.status}>
          <div className={classes.circleWrapper}>
            <div
              className={clsx(
                classes.line,
                stageIndex >= index && classes.activeLine
              )}
            />

            <div className={classes.circlePadding}>
              <div
                className={clsx(
                  classes.statusCircle,
                  stageIndex >= index && classes.activeCircle
                )}
              />
            </div>
          </div>

          <h3 className={clsx(stageIndex == index && classes.activeStatusText)}>
            {statusText}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default Statusbar;
