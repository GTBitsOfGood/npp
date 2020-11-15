import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";

// Iconography
import RejectedUFO from "&icons/RejectedUFO";

// Interfaces
import { Application } from "&server/models/Application";

// Utils
import urls from "&utils/urls";

interface RejectedProps {
  application: Application;
}

const RejectedLanding = ({ application }: RejectedProps) => {
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
      <h1 className="landingHeader">Thank you for your Submission</h1>

      <Statusbar application={application} />

      <RejectedUFO className="landingImage" />

      <h3 className="landingText">
        After careful considerations, we are sorry to inform you that we decide
        not to move on with your application. We enjoyed learning about your
        organization and its impact on the community. We appreciate your time
        and work! Keep in touch!
      </h3>
    </div>
  );
};

export default RejectedLanding;
