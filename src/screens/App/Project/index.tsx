import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import clsx from "clsx";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";
import ButtonLink from "&components/ButtonLink";

// Utils
import { applicationFromJson } from "&actions/ApplicationActions";
import urls, { getApplicationUrl } from "&utils/urls";
import { Application } from "&server/models/Application";
import { useSession } from "&utils/auth-utils";

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

  return (
    <div className="landingPage">
      <h1 className="landingHeader">
        {latestApp != null ? "Project Status" : "Apply for a New Project"}
      </h1>

      <Statusbar application={latestApp} />

      <h3 className="landingText">
        As a partner, Bits of Good will help you build software that turns your
        need into real productLorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut
      </h3>

      <div className={clsx("landingButton", classes.button)}>
        <ButtonLink variant="primary" href={appUrl}>
          <h3>{latestApp != null ? "View" : "Apply Now"}</h3>
        </ButtonLink>
      </div>
      {latestApp != null &&
        latestApp.stage === "DECISION" &&
        latestApp.decision === false && (
          <div className={clsx("landingButton", classes.button)}>
            <ButtonLink
              variant="secondary"
              href={urls.pages.app.application.apply}
            >
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
