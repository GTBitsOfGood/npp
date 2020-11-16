import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";

// Iconography
import ApprovedPeople from "&icons/ApprovedPeople";
import RejectedUFO from "&icons/RejectedUFO";

// Interfaces
import { Application } from "&server/models/Application";

// Utils
import urls from "&utils/urls";
import { GetStaticPaths, GetStaticProps } from "next";
import { applicationFromJson } from "&actions/ApplicationActions";
import { stageToIndex, StageType } from "&server/models/StageType";

const acceptedText =
  "Congratulations! After careful consideration, our team has decided to work with you next semester! We enjoyed the meeting with you and believe that our missions align with each other. Let’s build a powerful and meaningful product together to make our community better!";
const rejectedText =
  "After careful consideration, we are sorry to inform you that we decide not to move on with your application. We enjoyed learning about your organization and its impact on the community. We appreciate your time and work! Keep in touch!";

interface ApprovedProps {
  application: Application;
}

const DecisionLanding = ({ application }: ApprovedProps) => {
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
        {application.decision
          ? `Congratulations, ${application.primaryContact.name}!`
          : "Thank you for your Submission"}
      </h1>

      <Statusbar application={application} />

      {application.decision === true || application.decision == null ? (
        <ApprovedPeople className="landingImage" />
      ) : (
        <RejectedUFO className="landingImage" />
      )}

      <div className="landingContent">
        <div className="landingPadding" />

        {application.decision != null && (
          <h3 className="landingText">
            {application.decision ? acceptedText : rejectedText}
          </h3>
        )}

        <div className="landingPadding" />
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

    if (stageToIndex[appJson.stage!] < stageToIndex[StageType.DECISION]) {
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
    StageType.DECISION
  );

  return {
    paths: applications.map((id: string) => ({
      params: { id },
    })),
    fallback: true,
  };
};

export default DecisionLanding;

DecisionLanding.showSidebar = true;
DecisionLanding.isLanding = true;
