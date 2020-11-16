import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";
import ButtonLink from "&components/ButtonLink";

// Iconography
import ApplyNewBulb from "&icons/ApplyNewBulb";

// Utils
import { useSession } from "&utils/auth-utils";
import urls, { getApplicationUrl } from "&utils/urls";

interface PropTypes {
  organizationVerified: boolean;
}

const ProjectPage = ({ organizationVerified }: PropTypes) => {
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

  if (loading || !session) {
    return <h1 className="loadingText">Loading...</h1>;
  }

  return (
    <div className="landingPage">
      <h1 className="landingHeader">Apply for a New Project</h1>

      <Statusbar application={null} />

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

      <div className="landingButton">
        <ButtonLink variant="primary" href={urls.pages.app.application.apply}>
          <h3>Apply Now</h3>
        </ButtonLink>
      </div>
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

    const user = await UserManager.getUserById((session.user as any).id);

    const applications = await ApplicationManager.getApplications(session.user);
    if (applications.length > 0) {
      const latestApp = applications?.[0];
      const appUrl = getApplicationUrl(latestApp);

      return {
        props: {},
        redirect: {
          destination: appUrl,
          permanent: false,
        },
      };
    }

    return {
      props: {
        organizationVerified:
          user.organization != null &&
          user.organization.organizationName != null,
      },
    };
  } catch (error) {
    return {
      props: {
        organizationVerified: true,
        error: error.message,
      },
    };
  }
};

export default ProjectPage;

ProjectPage.showSidebar = true;
ProjectPage.isLanding = true;
