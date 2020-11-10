import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

import { Icon } from "@iconify/react";
import clockCircleFilled from "@iconify/icons-ant-design/clock-circle-filled";
import locationIcon from "@iconify/icons-bytesize/location";
import Statusbar from "&components/Statusbar";
import Button from "&components/Button";
import classes from "./Scheduled.module.scss";
import urls from "&utils/urls";

const cancelMeeting = () => {
  console.log("Meeting cancelled!");
  //TODO: Implement rerouting back to homepage or confirmation screen??
};

const rescheduleMeeting = () => {
  console.log("Reschedule Meeting");
  //TODO: Implement rerouting back to interview schedule page
};

const Scheduled = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [router, loading, session]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="applicationPage">
      <div className={classes.root}>
        <h1 className={classes.title}>Interview Scheduled!</h1>
        <Statusbar status={2} />
        <h5 className={classes.defaultText}>
          Bits of Good has confirmed the meeting time with you! We are looking
          forward to meeting with you and learning more about your organization.
          We hope to discuss how we can best help you to build the product and
          bring more impact to the community! If you have any further questions,
          please feel free to contact us at{" "}
          <a href="mailto:hello@bitsofgood.org">hello@bitsofgood.org</a> at your
          convenience.
        </h5>
        <div className={classes.meetingInfo}>
          <h3 className={classes.date}>
            <Icon
              icon={clockCircleFilled}
              color="orange"
              width="1.5em"
              className={classes.icon}
            />
            October 12th, 10am - 11am (60 Minutes)
          </h3>
          <h3 className={classes.link}>
            <Icon
              icon={locationIcon}
              color="orange"
              width="1.5em"
              className={classes.icon}
            />
            Zoom Link
          </h3>
          {/* To do: need to make an interview box that corresponds to the selected interview */}
        </div>
        <div className={classes.buttons}>
          <Button
            variant="secondary"
            onClick={cancelMeeting}
            className={classes.secondaryButton}
          >
            Cancel Meeting
          </Button>
          <Button
            variant="primary"
            onClick={rescheduleMeeting}
            className={classes.primaryButton}
          >
            Reschedule Meeting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Scheduled;
