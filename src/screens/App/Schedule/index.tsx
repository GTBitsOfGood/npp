import React, { useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { DateTime } from "luxon";
import { useRouter } from "next/router";

// Components
import Button from "&components/Button";
import Calendar from "&components/Calendar";

// Iconography
import Clock from "&components/icons/Clock";

// Utils
import { applicationFromJson } from "&actions/ApplicationActions";
import { stageToIndex, StageType } from "&server/models/StageType";
import { useSession } from "&utils/auth-utils";
import { Application } from "&server/models/Application";
import urls from "&utils/urls";

// Styling
import classes from "./ScheduleInterview.module.scss";

// interface ScheduleInterviewProps {
//   application:  Application;
// }

const ScheduleInterview = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  const [interviewDate, setInterviewDate] = useState<Date>();

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [loading, session]);

  const message =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud commodo consequat.";

  const schedule = () => {
    console.log(interviewDate);
  };

  if (loading || !session || router.isFallback) {
    return <h1 className="loadingText">Loading...</h1>;
  }

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
