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
          As a partner, Bits of Good will help you build software that turns
          your need into real productLorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut
        </h3>

        <div className="landingPadding" />
      </div>

      <div className="landingButton">
        {/* TODO Fix Link*/}
        <ButtonLink variant="primary" href={urls.pages.app.scheduled}>
          <h3>Schedule Now</h3>
        </ButtonLink>
      </div>
    </div>
  );
};

export default ScheduleLanding;
