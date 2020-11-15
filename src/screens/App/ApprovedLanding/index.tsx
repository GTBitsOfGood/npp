import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";

// Iconography
import ApprovedPeople from "&icons/ApprovedPeople";

// Interfaces
import { Application } from "&server/models/Application";

// Utils
import urls from "&utils/urls";

interface ApprovedProps {
  application: Application;
}

const ApprovedLanding = ({ application }: ApprovedProps) => {
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
      <h1 className="landingHeader">
        Congratulations, {application.primaryContact.name}!
      </h1>

      <Statusbar application={application} />

      <ApprovedPeople className="landingImage" />

      <h3 className="landingText">
        Congratulations! After careful consideration, our team has decided to
        work with you next semester! We enjoyed the meeting with you and believe
        that our missions align with each other. Let’s build a powerful and
        meaningful product together to make our community better!
      </h3>
    </div>
  );
};

export default ApprovedLanding;
