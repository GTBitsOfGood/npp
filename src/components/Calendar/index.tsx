import React, { ComponentProps } from "react";
import clsx from "clsx";
import { DateTime } from "luxon";
import { Icon } from "@iconify/react";
import arrowLeftAlt2 from "@iconify/icons-dashicons/arrow-left-alt2";
import arrowRightAlt2 from "@iconify/icons-dashicons/arrow-right-alt2";
import TimePicker from "./TimePicker";
import classes from "./Calendar.module.scss";

interface PropTypes extends ComponentProps<"div"> {
  value?: Date | null;
  withTime?: boolean;
  onSelectDate: (date: Date) => void | Promise<void>;
}

const Calendar = ({
  className,
  value = null,
  withTime = true,
  onSelectDate,
}: PropTypes) => {
  const currentDate = DateTime.local();
  const [selectedDate, setDate] = React.useState<DateTime>(
    currentDate.startOf("month")
  );

  const monthStart = selectedDate.startOf("month");
  const endWeek = monthStart.endOf("week");
  const daysInMonth = selectedDate.daysInMonth;
  const weekdays: Map<
    string,
    {
      disabled: boolean;
      day: DateTime;
    }[]
  > = new Map([
    ["Sunday", []],
    ["Monday", []],
    ["Tuesday", []],
    ["Wednesday", []],
    ["Thursday", []],
    ["Friday", []],
    ["Saturday", []],
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

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.calendar}>
        <div className={classes.header}>
          <h2>Select a Date and Time</h2>
          <div className={classes.monthContainer}>
            <h5>{selectedDate.toFormat("MMMM yyyy")}</h5>
            <div className={classes.buttonContainer}>
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
          </div>
        </div>
        <div className={classes.content}>
          {Array.from(weekdays).map(([dayName, days], index) => (
            <div key={dayName} className={classes.dayCol}>
              <h4>{dayName.substring(0, 3)}</h4>
              <div className={classes.days}>
                {days[0].day.day >= endWeek.day && monthStart.weekday !== 7 && (
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
                          DateTime.fromJSDate(value).toFormat("D") ===
                            day.toFormat("D") &&
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
        <p>
          *Times are in Eastern Standard Time (<b>EST</b>)
        </p>
      </div>
      {withTime && value != null && (
        <div className={classes.time}>
          <h5>{DateTime.fromJSDate(value).toFormat("EEEE, MMMM d")}</h5>
          <TimePicker date={value} value={value} onSelectTime={onSelectDate} />
        </div>
      )}
    </div>
  );
};

export default Calendar;
