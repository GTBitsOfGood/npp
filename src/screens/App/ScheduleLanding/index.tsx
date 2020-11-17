import React, { useEffect } from "react";

import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";
import ButtonLink from "&components/ButtonLink";

// Iconography
import SchedulePerson from "&icons/SchedulePerson";

// Interfaces
import { Application } from "&server/models/Application";

// Utils
import urls from "&utils/urls";

interface ScheduleLandingProps {
  application: Application;
}

const ScheduleLanding = ({ application }: ScheduleLandingProps) => {
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [loading, session]);

  if (loading || !session || router.isFallback) {
    return <h1 className="loadingText">Loading...</h1>;
  }

  return (
    <div className="landingPage">
      <h1 className="landingHeader">Schedule an Interview with us</h1>

      <Statusbar application={application} />

      <SchedulePerson className="landingImage" />

      <div className="landingContent">
        <div className="landingPadding" />

        <h3 className="landingText">
          Congratulations! After reviewing your application, we have decided to
          move forward to the interview process! For the next step, we want to
          have a one-hour virtual interview to learn more about you. When you
          have a moment, please let us know when you’d be available for the
          interview.
        </h3>

        <div className="landingPadding" />
      </div>

      <div className="landingButton">
        <ButtonLink
          variant="primary"
          href={urls.pages.app.application.schedule(application.id!)}
        >
          <h3>Schedule Now</h3>
        </ButtonLink>
      </div>
    </div>
  );
};

export default ScheduleLanding;

ScheduleLanding.showSidebar = true;
ScheduleLanding.isLanding = true;
