import React, { useState } from "react";
import { DateTime } from "luxon";

// Components
import Button from "&components/Button";
import Calendar from "&components/Calendar";

// Iconography
import Clock from "&components/icons/Clock";

// Styling
import classes from "./ScheduleInterview.module.scss";

const ScheduleInterview = () => {
  const [interviewDate, setInterviewDate] = useState<Date>();

  const message =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud commodo consequat.";

  const schedule = () => {
    console.log(interviewDate);
  };

  return (
    <div className="applicationPage">
      <div className="root">
        <div className="sidePadding" />

        <div className="leftCol2">
          <h1 className="formTitle">Schedule an Interview</h1>
          <div className="formSubtitle">
            <Clock />
            <h5>60 min</h5>
          </div>

          <h5 className="formDescription">{message}</h5>
        </div>

        <div className="padding" />

        <div className="rightCol">
          <Calendar
            withTime={true}
            value={interviewDate}
            onSelectDate={(date) => setInterviewDate(date)}
          />

          {interviewDate && interviewDate.getHours() >= 9 && (
            <div className={classes.confirm}>
              <h2>
                {DateTime.fromJSDate(interviewDate).toFormat(
                  "EEEE, MMM d, hh:mm a"
                )}
              </h2>
              <Button variant="primary" onClick={schedule}>
                <h3>Schedule</h3>
              </Button>
            </div>
          )}
        </div>

        <div className="sidePadding" />
      </div>
    </div>
  );
};

export default ScheduleInterview;
