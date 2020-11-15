import React, { useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { DateTime } from "luxon";

// Components
import Calendar from "&components/Calendar";
import Clock from "&components/icons/Clock";
import Button from "&components/Button";

// Utils
import { applicationFromJson } from "&actions/ApplicationActions";
import { stageToIndex, StageType } from "&server/models/StageType";

// Styling
import classes from "./ScheduleInterview.module.scss";
import { Application } from "&server/models/Application";

interface PropTypes {
  application: Application;
}

const ScheduleInterview = ({ application }: PropTypes) => {
  const [interviewDate, setInterviewDate] = useState(new Date());

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
          <Clock />
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
          />
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

export const getStaticProps: GetStaticProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ApplicationManager = require("&server/mongodb/actions/ApplicationManager");

  try {
    const { id } = (context.params || {}) as Record<string, unknown>;
    const application = await ApplicationManager.getApplicationById(id);
    const appJson = applicationFromJson(application);

    if (
      stageToIndex[appJson.stage!] < stageToIndex[StageType.AWAITING_SCHEDULE]
    ) {
      return {
        props: {
          application: null,
        },
        notFound: true,
        revalidate: 1,
      };
    } else {
      return {
        props: {
          application: {
            ...appJson,
            createdAt: appJson.createdAt?.toISO(),
            updatedAt: appJson.updatedAt?.toISO(),
          },
        },
        revalidate: 60,
      };
    }
  } catch (error) {
    return {
      props: {
        application: null,
        error: error.message,
      },
      notFound:
        error.name === "CastError" ||
        error.message === "Application does not exist!",
      revalidate: 1,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ApplicationManager = require("&server/mongodb/actions/ApplicationManager");

  const applications = await ApplicationManager.getApplicationsByStage(
    StageType.AWAITING_SCHEDULE
  );

  return {
    paths: applications.map((id: string) => ({
      params: { id },
    })),
    fallback: true,
  };
};

export default ScheduleInterview;
