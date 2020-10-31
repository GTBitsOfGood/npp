import React, { ComponentProps } from "react";
import clsx from "clsx";
import { DateTime } from "luxon";
import Button from "&components/Button";
import classes from "./TimePicker.module.scss";

interface PropTypes extends ComponentProps<"div"> {
  date: Date;
  value?: Date | null;
  onSelectTime: (time: Date) => void | Promise<void>;
}

const TimePicker = ({ className, date, value, onSelectTime }: PropTypes) => {
  const startTime = DateTime.fromJSDate(date).set({
    hour: 9,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const availTimes: {
    disabled: boolean;
    time: DateTime;
  }[] = [];
  for (
    let curTime = startTime;
    curTime.hour < 18;
    curTime = curTime.plus({ minutes: 30 })
  ) {
    availTimes.push({
      disabled: false,
      time: curTime,
    });
  }

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.header}>
        <h2>{startTime.toFormat("DD")}</h2>
        <h5>Select a 30-minute meeting time</h5>
      </div>
      <div className={classes.content}>
        <p>*Times are in Eastern Standard Time (EST)</p>
        <div className={classes.times}>
          {availTimes.map(({ disabled, time }) => (
            <Button
              key={time.toISO()}
              className={classes.time}
              disabled={disabled}
              variant={
                value != null &&
                value.toISOString() === time.toJSDate().toISOString()
                  ? "primary"
                  : "secondary"
              }
              onClick={() => onSelectTime(time.toJSDate())}
            >
              {time.toFormat("t")}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
