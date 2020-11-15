import React from "react";
import clsx from "clsx";
import { DateTime } from "luxon";
import { Availability } from "&server/models/Availability";
import classes from "./TimePicker.module.scss";

interface TimePickerProps {
  date: Date;
  value?: Date | null;
  fromAvailabilities: boolean;
  availabilities: Availability[];
  onSelectTime: (time: Date) => void | Promise<void>;
}

const TimePicker = ({
  date,
  value,
  fromAvailabilities,
  availabilities,
  onSelectTime,
}: TimePickerProps) => {
  const luxonValue = value != null ? DateTime.fromJSDate(value) : null;
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

  if (fromAvailabilities) {
    availabilities.forEach((avail) => {
      if (
        avail.startDatetime.ordinal === luxonValue?.ordinal &&
        avail.startDatetime >= startTime
      ) {
        for (
          let curTime = avail.startDatetime;
          curTime < avail.endDatetime && curTime.hour < 18;
          curTime = curTime.plus({ minutes: 30 })
        ) {
          availTimes.push({
            disabled: false,
            time: curTime,
          });
        }
      }
    });
  } else {
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
              luxonValue?.toFormat("T") === time.toFormat("T") &&
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
