import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";
import ButtonLink from "&components/ButtonLink";

// Screens
import Scheduled from "&screens/App/Scheduled";
import UnderReview from "&screens/App/UnderReview";
import SubmittedScreen from "&screens/App/Submitted";
import ApprovedLanding from "&screens/App/ApprovedLanding";
import RejectedLanding from "&screens/App/RejectedLanding";
import ScheduleLanding from "&screens/App/ScheduleLanding";

// Iconography
import ApplyNewBulb from "&icons/ApplyNewBulb";

// Interfaces
import { StageType } from "&server/models/StageType";
import { Application } from "&server/models/Application";

// Utils
import urls from "&utils/urls";
import { applicationFromJson } from "&actions/ApplicationActions";

interface PropTypes {
  applications: Application[];
}

const ProjectPage = ({ applications }: PropTypes) => {
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [loading, session]);

  if (loading || !session) {
    return <h1 className="loadingText">Loading...</h1>;
  }

  const latestApp = applications[0];

  if (latestApp) {
    if (latestApp.stage === StageType.SUBMITTED)
      return <SubmittedScreen application={latestApp} />;
    else if (latestApp.stage === StageType.AWAITING_SCHEDULE)
      return <ScheduleLanding application={latestApp} />;
    else if (latestApp.stage === StageType.SCHEDULED)
      return <Scheduled application={latestApp} />;
    else if (latestApp.stage === StageType.REVIEW)
      return <UnderReview application={latestApp} />;
    else if (latestApp.stage === StageType.DECISION) {
      if (latestApp.decision)
        return <ApprovedLanding application={latestApp} />;
      else return <RejectedLanding application={latestApp} />;
    }
  }

  return (
    <div className="landingPage">
      <h1 className="landingHeader">Apply for a New Project</h1>

      <Statusbar application={latestApp} />

      <ApplyNewBulb className="landingImage" />

      <h3 className="landingText">
        As a partner, Bits of Good will help you build software that turns your
        need into real productLorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut
      </h3>

      <div className="landingButton">
        <ButtonLink variant="primary" href={urls.pages.app.apply}>
          <h3>Apply Now</h3>
        </ButtonLink>
      </div>

      {latestApp != null &&
        latestApp.stage === "DECISION" &&
        latestApp.decision === false && (
          <div className="landingButton">
            <ButtonLink variant="secondary" href={urls.pages.app.apply}>
              <h3>Apply Again</h3>
            </ButtonLink>
          </div>
        )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ApplicationManager = require("&server/mongodb/actions/ApplicationManager");

  try {
    const session = await getSession({ req: context.req as any });

    if (session?.user == null) {
      throw new Error("User is not logged in!");
    }

    const applications = await ApplicationManager.getApplications(session.user);
    const appJson = applications.map((application: Application) => {
      const formatted = applicationFromJson(application);

      return {
        ...formatted,
        createdAt: formatted.createdAt?.toISO(),
        updatedAt: formatted.updatedAt?.toISO(),
      };
    });

    return {
      props: {
        applications: appJson,
      },
    };
  } catch (error) {
    return {
      props: {
        applications: [],
        error: error.message,
      },
    };
  }
};

export default ProjectPage;
