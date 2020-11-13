import React, { useState } from "react";

// Libraries;
import clsx from "clsx";
import { DateTime } from "luxon";

// Iconography
import LeftChevron from "&icons/LeftChevron";
import RightChevron from "&icons/RightChevron";

// Components
import TimePicker from "./TimePicker";

// Styling
import classes from "./Calendar.module.scss";

// Interfaces
interface DayItem {
  day: DateTime;
  disabled: boolean;
}

// Constants
const currentDate = DateTime.local();

const weekdays: Map<string, DayItem[]> = new Map([
  ["Sunday", []],
  ["Monday", []],
  ["Tuesday", []],
  ["Wednesday", []],
  ["Thursday", []],
  ["Friday", []],
  ["Saturday", []],
]);

interface CalendarProps {
  withTime?: boolean;
  value?: Date | null;
  onSelectDate: (date: Date) => void | Promise<void>;
}

const Calendar = ({
  onSelectDate,
  value = null,
  withTime = true,
}: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<DateTime>(
    currentDate.startOf("month")
  );

  const monthStart = selectedDate.startOf("month");
  const endWeek = monthStart.endOf("week");
  const daysInMonth = selectedDate.daysInMonth;

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
    <div className={classes.root}>
      <div className={classes.calendar}>
        <div className={classes.header}>
          <h2>Select a Date and Time</h2>

          <div className={classes.monthContainer}>
            <h5>{selectedDate.toFormat("MMMM yyyy")}</h5>

            <div className={classes.buttonContainer}>
              <button
                className={classes.iconButton}
                disabled={selectedDate.month === currentDate.month}
                onClick={() =>
                  setSelectedDate((prevDate) => prevDate.minus({ months: 1 }))
                }
              >
                <LeftChevron
                  disabled={selectedDate.month === currentDate.month}
                />
              </button>

              <button
                className={classes.iconButton}
                disabled={selectedDate.month > currentDate.month + 1}
                onClick={() =>
                  setSelectedDate((prevDate) => prevDate.plus({ months: 1 }))
                }
              >
                <RightChevron
                  disabled={selectedDate.month > currentDate.month + 1}
                />
              </button>
            </div>
          </div>
        </div>

        <div className={classes.content}>
          {Array.from(weekdays).map(([dayName, days]) => (
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
