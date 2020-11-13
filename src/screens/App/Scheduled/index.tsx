import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Iconography
import { Icon } from "@iconify/react";
import locationIcon from "@iconify/icons-bytesize/location";
import clockCircleFilled from "@iconify/icons-ant-design/clock-circle-filled";

// Components
import Button from "&components/Button";
import Statusbar from "&components/Statusbar";

// Styling
import classes from "./Scheduled.module.scss";

// URLS
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
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      if (session) {
        setLoggedIn(true);
      } else {
        void router.replace(urls.pages.index);
      }
    }
  }, [router, loading, session]);

  if (loading || !loggedIn) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="landingPage">
      <h1 className="landingHeader">Interview Scheduled!</h1>

      <Statusbar status={2} />

      <div className={classes.meetingContainer}>
        <div className={classes.meetingInfo}>
          <h3 className={classes.date}>
            <Icon
              color="orange"
              width="1.5em"
              icon={clockCircleFilled}
              className={classes.icon}
            />
            October 12th, 10-11am EST
          </h3>

          <h3 className={classes.link}>
            <Icon
              color="orange"
              width="1.5em"
              icon={locationIcon}
              className={classes.icon}
            />
            Zoom Link
          </h3>

          {/* TODO: need to make an interview box that corresponds to the selected interview */}
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

      <h3 className="landingText">
        Bits of Good has confirmed the meeting time with you! We are looking
        forward to meeting with you and learning more about your organization.
        We hope to discuss how we can best help you to build the product and
        bring more impact to the community! If you have any further questions,
        please feel free to contact us at{" "}
        <a href="mailto:hello@bitsofgood.org">hello@bitsofgood.org</a> at your
        convenience.
      </h3>
    </div>
  );
};

export default Scheduled;
