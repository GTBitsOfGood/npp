import React, { ComponentProps } from "react";
import clsx from "clsx";
import { DateTime } from "luxon";
import Button from "&components/Button";
import classes from "./TimePicker.module.scss";

interface TimePickerProps {
  date: Date;
  value?: Date | null;
  onSelectTime: (time: Date) => void | Promise<void>;
}

const TimePicker = ({ date, value, onSelectTime }: TimePickerProps) => {
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
    <div className={classes.root}>
      {availTimes.map(({ disabled, time }) => (
        <button
          key={time.toISO()}
          disabled={disabled}
          onClick={() => onSelectTime(time.toJSDate())}
          className={clsx(
            classes.timeSlot,
            disabled && classes.disabledTimeslot,
            value &&
              DateTime.fromJSDate(value).toFormat("T") === time.toFormat("T") &&
              classes.selectedTimeslot
          )}
        >
          <h3 className={classes.timeText}>
            {time.toFormat("h:mm a").toLowerCase()}
          </h3>
        </button>
      ))}
    </div>
  );
};

export default TimePicker;
