import React, { useState } from "react";
import { DateTime } from "luxon";

// Components
import Calendar from "&components/Calendar";
import Clock from "&components/icons/Clock";
import Button from "&components/Button";

// Styling
import classes from "./ScheduleInterview.module.scss";

const ScheduleInterview: React.FC = () => {
  let [interviewDate, setInterviewDate] = useState(new Date());

  const message =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud commodo consequat.";

  const selectDate = (date: Date) => {
    setInterviewDate(date);
  };

  const schedule = () => {
    console.log(interviewDate);
  };

  return (
    <div className={classes.root}>
      <div className={classes.col1}>
        <h1>Schedule an Interview</h1>
        <div className={classes.time}>
          <Clock></Clock>
          <h5>60 min</h5>
        </div>

        <p>{message}</p>
      </div>

      <div className={classes.col2}>
        <div className={classes.calendar}>
          <Calendar
            withTime={true}
            onSelectDate={selectDate}
            value={interviewDate}
          ></Calendar>
        </div>
        <div className={classes.confirm}>
          <h2>
            {DateTime.fromJSDate(interviewDate).toFormat(
              "EEEE, MMMM d, hh:mm a"
            )}
          </h2>
          <Button variant="primary" onClick={schedule}>
            <h3>Schedule</h3>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;
