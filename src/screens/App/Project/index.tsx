import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";

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
import { useSession } from "&utils/auth-utils";
import urls, { getApplicationUrl } from "&utils/urls";
import { applicationFromJson } from "&actions/ApplicationActions";

// Styles
import classes from "./ProjectScreen.module.scss";

interface PropTypes {
  applications: Application[];
  organizationVerified: boolean;
}

const ProjectPage = ({ applications, organizationVerified }: PropTypes) => {
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        void router.replace(urls.pages.index);
      } else if (!organizationVerified) {
        void router.replace(urls.pages.app.verification);
      }
    }
  }, [loading, session]);

  const latestApp = applications?.[0];
  const appUrl = getApplicationUrl(latestApp);

  if (loading || !session) {
    return <h1 className="loadingText">Loading...</h1>;
  }

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

      {latestApp != null &&
      latestApp.stage === "DECISION" &&
      latestApp.decision === false ? (
        <div className="landingButton">
          <ButtonLink
            variant="secondary"
            href={urls.pages.app.application.apply}
          >
            <h3>Apply Again</h3>
          </ButtonLink>
        </div>
      ) : (
        <div className="landingButton">
          <ButtonLink variant="primary" href={urls.pages.app.application.apply}>
            <h3>Apply Now</h3>
          </ButtonLink>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ApplicationManager = require("&server/mongodb/actions/ApplicationManager");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const UserManager = require("&server/mongodb/actions/UserManager");

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

    const user = await UserManager.getUserById((session.user as any).id);

    return {
      props: {
        applications: appJson,
        organizationVerified:
          user.organization != null &&
          user.organization.organizationName != null,
      },
    };
  } catch (error) {
    return {
      props: {
        applications: [],
        organizationVerified: true,
        error: error.message,
      },
    };
  }
};

export default ProjectPage;
