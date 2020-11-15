import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";

// Interfaces
import { Application } from "&server/models/Application";

// Utils
import urls from "&utils/urls";
import UnderReviewPerson from "&icons/UnderReviewPerson";

interface UnderReviewProps {
  application: Application;
}

const UnderReview = ({ application }: UnderReviewProps) => {
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
      <h1 className="landingHeader">Under Review</h1>

      <Statusbar application={application} />

      <UnderReviewPerson className="landingImage" />

      <div className="landingContent">
        <div className="landingPadding" />

        <h3 className="landingText">
          We enjoyed the meeting with you! Hang tight for the updates for your
          application. We still need more time to tell our team about your
          organization and the product goals to make decisions accordingly. We
          appreciate your time and patience. Before the decision is made, feel
          free to contact us at{" "}
          <a href="mailto:hello@bitsofgood.org">hello@bitsofgood.org</a> if you
          have any further questions
        </h3>

        <div className="landingPadding" />
      </div>
    </div>
  );
};

export default UnderReview;
