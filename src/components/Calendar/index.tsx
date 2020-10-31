import React, { ComponentProps } from "react";
import clsx from "clsx";
import { DateTime } from "luxon";
import { Icon } from "@iconify/react";
import arrowLeftAlt2 from "@iconify/icons-dashicons/arrow-left-alt2";
import arrowRightAlt2 from "@iconify/icons-dashicons/arrow-right-alt2";
import classes from "./Calendar.module.scss";

interface PropTypes extends ComponentProps<"div"> {
  value?: Date | null;
  onSelectDate: (date: Date) => void | Promise<void>;
}

const Calendar = ({ className, value = null, onSelectDate }: PropTypes) => {
  const currentDate = DateTime.local();
  const [selectedDate, setDate] = React.useState<DateTime>(
    currentDate.startOf("month")
  );

  const monthStart = selectedDate.startOf("month");
  const daysInMonth = selectedDate.daysInMonth;
  const weekdays: Map<
    string,
    {
      disabled: boolean;
      day: DateTime;
    }[]
  > = new Map([
    ["Monday", []],
    ["Tuesday", []],
    ["Wednesday", []],
    ["Thursday", []],
    ["Friday", []],
  ]);
  for (
    let curDay = monthStart;
    curDay.day < daysInMonth;
    curDay = curDay.plus({ days: 1 })
  ) {
    const name = curDay.weekdayLong;

    if (weekdays.has(name)) {
      weekdays.get(name)?.push({
        disabled:
          curDay.month === currentDate.month && curDay.day <= currentDate.day,
        day: curDay,
      });
    }
  }
  const followingWeekDay = monthStart.plus({ weeks: 1 }).startOf("week").day;

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.header}>
        <div className={classes.monthContainer}>
          <h2>{selectedDate.monthLong}</h2>
          <button
            className={classes.iconButton}
            disabled={currentDate.month === selectedDate.month}
            onClick={() =>
              setDate((prevState) => prevState.minus({ months: 1 }))
            }
          >
            <Icon icon={arrowLeftAlt2} />
          </button>
          <button
            className={classes.iconButton}
            onClick={() =>
              setDate((prevState) => prevState.plus({ months: 1 }))
            }
          >
            <Icon icon={arrowRightAlt2} />
          </button>
        </div>
        <h5>Select an Interview Date</h5>
      </div>
      <div className={classes.content}>
        {Array.from(weekdays).map(([dayName, days]) => (
          <div key={dayName} className={classes.dayCol}>
            <h3>{dayName.substring(0, dayName === "Thursday" ? 2 : 1)}</h3>
            <div className={classes.days}>
              {days[0].day.day >= followingWeekDay && (
                <div className={classes.daySpacer} />
              )}
              {days.map(({ disabled, day }) => (
                <button
                  key={day.day}
                  disabled={disabled}
                  onClick={() => onSelectDate(day.toJSDate())}
                >
                  <div
                    className={clsx(
                      classes.circleWrapper,
                      value != null &&
                        value.toISOString() === day.toJSDate().toISOString() &&
                        classes.selectedDate
                    )}
                  >
                    <h2>{day.day}</h2>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
