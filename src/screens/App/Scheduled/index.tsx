import React, { useEffect } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { DateTime } from "luxon";

// Iconography
import Clock from "&icons/Clock";
import LocationPin from "&icons/LocationPin";

// Components
import Button from "&components/Button";
import Statusbar from "&components/Statusbar";

// Utils
import urls from "&utils/urls";
import { Application } from "&server/models/Application";
import { applicationFromJson } from "&actions/ApplicationActions";
import { stageToIndex, StageType } from "&server/models/StageType";
import { useSession } from "&utils/auth-utils";
import { Meeting } from "&server/models/Meeting";
import { Availability } from "&server/models/Availability";
import { meetingFromJsonResponse } from "&actions/MeetingActions";

// Styling
import classes from "./Scheduled.module.scss";

interface PropTypes {
  application: Application;
  meeting: Meeting & { availability: Availability };
}

const Scheduled = ({ application, meeting }: PropTypes) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const meetingDate = DateTime.fromISO(
    meeting != null
      ? ((meeting.availability.startDatetime as unknown) as string)
      : new Date().toISOString()
  );
  const meetingStart = meetingDate.toFormat("t");
  const meetingEnd = meetingDate.plus({ hours: 1 }).toFormat("t");

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [loading, session]);

  const cancelMeeting = () => {
    console.log("Meeting cancelled!");
    //TODO: Implement rerouting back to homepage or confirmation screen??
  };

  const rescheduleMeeting = () => {
    console.log("Reschedule Meeting");
    //TODO: Implement rerouting back to interview schedule page
  };

  if (loading || !session || router.isFallback) {
    return <h1 className="loadingText">Loading...</h1>;
  }

  return (
    <div className="landingPage">
      <h1 className="landingHeader">Interview Scheduled!</h1>

      <Statusbar application={application} />

      <div className={classes.meetingContainer}>
        <div className={classes.meetingInfo}>
          <h3 className={classes.date}>
            <div className={classes.icon}>
              <Clock />
            </div>
            {meetingDate.toFormat(
              `MMMM d, '${meetingStart} - ${meetingEnd}' ZZZZ`
            )}
          </h3>

          <h3 className={classes.link}>
            <div className={classes.icon}>
              <LocationPin />
            </div>
            Zoom Link
          </h3>
        </div>

        <div className={classes.buttons}>
          <Button variant="secondary" onClick={cancelMeeting}>
            <h3>Cancel</h3>
          </Button>
          <Button variant="primary" onClick={rescheduleMeeting}>
            <h3>Reschedule</h3>
          </Button>
        </div>
      </div>

      <div className="landingContent">
        <div className="landingPadding" />

        <h3 className="landingText">
          Bits of Good has confirmed the meeting time with you! We are looking
          forward to meeting with you and learning more about your organization.
          We hope to discuss how we can best help you to build the product and
          bring more impact to the community! If you have any further questions,
          please feel free to contact us at{" "}
          <a href="mailto:hello@bitsofgood.org">hello@bitsofgood.org</a> at your
          convenience.
        </h3>

        <div className="landingPadding" />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ApplicationManager = require("&server/mongodb/actions/ApplicationManager");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const MeetingManager = require("&server/mongodb/actions/MeetingManager");

  try {
    const { id } = (context.params || {}) as Record<string, unknown>;
    const application = await ApplicationManager.getApplicationById(id);
    const appJson = applicationFromJson(application);

    if (stageToIndex[appJson.stage!] < stageToIndex[StageType.SCHEDULED]) {
      return {
        props: {
          application: null,
        },
        notFound: true,
        revalidate: 1,
      };
    } else {
      const meeting = await MeetingManager.getMeetingByApplicationId(id);
      const meetingJson = meetingFromJsonResponse(meeting) as Meeting & {
        availability: Availability;
      };

      return {
        props: {
          application: {
            ...appJson,
            createdAt: appJson.createdAt?.toISO(),
            updatedAt: appJson.updatedAt?.toISO(),
          },
          meeting: {
            ...meetingJson,
            availability: {
              ...((meetingJson.availability as unknown) as Meeting),
              startDatetime: meetingJson.availability.startDatetime?.toISO(),
              endDatetime: meetingJson.availability.endDatetime?.toISO(),
            },
            createdAt: meetingJson.createdAt?.toISO(),
            updatedAt: meetingJson.updatedAt?.toISO(),
          },
        },
        revalidate: 60,
      };
    }
  } catch (error) {
    return {
      props: {
        application: null,
        meeting: null,
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
    StageType.SCHEDULED
  );

  return {
    paths: applications.map((id: string) => ({
      params: { id },
    })),
    fallback: true,
  };
};

export default Scheduled;
