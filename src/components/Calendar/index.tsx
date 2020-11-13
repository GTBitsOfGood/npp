import React, { useEffect, useState } from "react";

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

// Constants
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// 6 weeks * 7 days per week
const DAYS_IN_CALENDAR = 42;

const currentDate = DateTime.local().startOf("day");

// Typescript
interface CalendarDay {
  date: DateTime;
  disabled: boolean;
}

type CalendarItem = CalendarDay | null;

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

  const [calendarDays, setCalendarDays] = useState<CalendarItem[]>([]);

  useEffect(() => {
    const tempCalendarDays: CalendarItem[] = [];

    const monthStart = selectedDate.startOf("month");
    const daysInMonth = selectedDate.daysInMonth;

    // Reset Sunday (7) to index 0
    const firstWeekday = monthStart.weekday % 7;

    for (let i = 0; i < DAYS_IN_CALENDAR; i++) {
      const curDayOfMonth = i - firstWeekday;

      if (curDayOfMonth < 0) {
        // Add blank days at the start of the month
        tempCalendarDays.push(null);
      } else if (curDayOfMonth < daysInMonth) {
        // Add regular calendar day
        const tempDay = monthStart.plus({ day: curDayOfMonth });

        tempCalendarDays.push({
          date: tempDay,
          disabled: tempDay <= currentDate,
        });
      } else {
        // Add blank days at the end of the month
        tempCalendarDays.push(null);
      }

      setCalendarDays(tempCalendarDays);
    }
  }, [selectedDate]);

  return (
    <div className={classes.root}>
      <div className={classes.calendar}>
        <div className={classes.header}>
          <h2>Select a Date and Time</h2>

          <div className={classes.monthContainer}>
            <h3>{selectedDate.toFormat("MMMM yyyy")}</h3>

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
                disabled={selectedDate.month >= currentDate.month + 1}
                onClick={() =>
                  setSelectedDate((prevDate) => prevDate.plus({ months: 1 }))
                }
              >
                <RightChevron
                  disabled={selectedDate.month >= currentDate.month + 1}
                />
              </button>
            </div>
          </div>
        </div>

        <div className={classes.calendarView}>
          {WEEKDAYS.map((day, dayIndex) => (
            <div key={day + dayIndex} className={classes.dayColumn}>
              <h4>{day}</h4>

              {calendarDays.map((curDay, calIndex) => {
                // Checks if day is multiple of the weekday
                // Note: Add one to avoid division by 0
                if (((calIndex % 7) + 1) / (dayIndex + 1) === 1) {
                  return (
                    <>
                      {curDay === null ? (
                        <div className={classes.emptyButton} />
                      ) : (
                        <button
                          disabled={curDay.disabled}
                          className={clsx(
                            classes.weekButton,
                            curDay.disabled && classes.disabledButton,
                            curDay.date.equals(currentDate) && classes.curDay,
                            value &&
                              value.valueOf() ===
                                curDay.date.toJSDate().valueOf() &&
                              classes.selectedDay
                          )}
                          onClick={() => onSelectDate(curDay.date.toJSDate())}
                        >
                          <h2
                            className={clsx(
                              curDay.disabled && classes.disabled
                            )}
                          >
                            {curDay.date.day}
                          </h2>
                        </button>
                      )}
                    </>
                  );
                }
              })}
            </div>
          ))}
        </div>

        <p>
          *Times are in Eastern Standard Time (<b>EST</b>)
        </p>
      </div>

      {withTime && value != null && (
        <div className={classes.time}>
          <h3>{DateTime.fromJSDate(value).toFormat("EEEE, MMMM d")}</h3>
          <TimePicker date={value} value={value} onSelectTime={onSelectDate} />
        </div>
      )}
    </div>
  );
};

// {Array.from(weekdays).map(([dayName, days]) => (
//   <div key={dayName} className={classes.dayCol}>
//     <h4>{dayName.substring(0, 3)}</h4>
//     <div className={classes.days}>
//       {days[0].day.day >= endWeek.day && monthStart.weekday !== 7 && (
//         <div className={classes.daySpacer} />
//       )}
//       {days.map(({ disabled, day }) => (
//         <button
//           key={day.day}
//           disabled={disabled}
//           onClick={() => onSelectDate(day.toJSDate())}
//         >
//           <div
//             className={clsx(
//               classes.circleWrapper,
//               value != null &&
//               DateTime.fromJSDate(value).toFormat("D") ===
//               day.toFormat("D") &&
//               classes.selectedDate
//             )}
//           >
//             <h2>{day.day}</h2>
//           </div>
//         </button>
//       ))}
//     </div>
//   </div>
// ))}

export default Calendar;
