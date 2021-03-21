import React, { useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { DateTime } from "luxon";
import { useRouter } from "next/router";

// Libraries
import clsx from "clsx";

// Components
import Button from "&components/Button";
import Calendar from "&components/Calendar";

// Iconography
import Clock from "&components/icons/Clock";

// Utils
import urls from "&utils/urls";
import { useSession } from "&utils/auth-utils";
import { applicationFromJson } from "&actions/ApplicationActions";
import { stageToIndex, StageType } from "&server/models/StageType";
import { Application } from "&server/models/Application";

// Styling
import classes from "./ScheduleInterview.module.scss";
import Swal from "sweetalert2";
import { createMeeting } from "&actions/MeetingActions";

interface ScheduleInterviewProps {
  application: Application;
}

const ScheduleInterview = ({ application }: ScheduleInterviewProps) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [interviewDate, setInterviewDate] = useState<Date>();
  const [availability, setAvailability] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [loading, session]);

  const schedule = async () => {
    if (availability == null) {
      await Swal.fire({
        title: "Error",
        text: "Please provide a meeting date!",
        icon: "error",
      });
      return;
    }

    try {
      const result = await createMeeting({
        availability,
        nonprofit: session.user.id,
        application: application.id as string,
      });

      if (result == null || result.id == null) {
        throw new Error("Failed to submit application!");
      }

      await Swal.fire({
        title: "Success",
        text: "Successfully scheduled meeting!",
        icon: "success",
      });

      await router.replace(
        urls.pages.app.application.scheduled(application.id!)
      );
    } catch (error) {
      console.log("Error", error);

      await Swal.fire({
        title: "Error",
        text: "Failed to schedule meeting, please try again later!",
        icon: "error",
      });
    }
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

          <h5 className="formDescription">
            Please select an appropriate time and date to meet with a member of
            our product review board to discuss your project application.
          </h5>

          <br />

          <h5 className="formDescription">
            This meeting will be held virtually over Zoom and will give us a
            better idea of your product needs.
          </h5>
        </div>

        <div className="padding" />

        <div className={clsx("rightCol", classes.calendar)}>
          <Calendar
            fromAvailabilities
            withTime={true}
            value={interviewDate}
            onSelectDate={(date) => setInterviewDate(date)}
            onSelectAvail={(avail) => setAvailability(avail)}
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
    const application: Application = await ApplicationManager.getApplicationById(
      id
    );

    if (
      stageToIndex[application.stage] <
      stageToIndex[StageType.AWAITING_SCHEDULE]
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
            ...application,
            createdAt: application.createdAt?.toISO(),
            updatedAt: application.updatedAt?.toISO(),
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

  const applications = await ApplicationManager.getApplicationIdsByStage(
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

ScheduleInterview.showSidebar = true;
ScheduleInterview.isLanding = false;
