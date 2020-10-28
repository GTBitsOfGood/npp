import React from "react";
import classes from "./Status.module.scss";
import clsx from "clsx";
interface StatusBarProps extends React.ComponentProps<"div"> {
  status?: number;
}
const currentStatus = [
  "Application Submitted",
  "Schedule an Interview",
  "Interview Scheduled",
  "Under Review",
  "Decision Made",
];

const Statusbar = ({ status, ...rest }: StatusBarProps) => {
  return (
    <div className={classes.root} {...rest}>
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
