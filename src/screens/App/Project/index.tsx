import React, { useEffect } from "react";
import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";

// Components
import Statusbar from "&components/Statusbar";
import ButtonLink from "&components/ButtonLink";

// Iconography
import ApplyNewBulb from "&icons/ApplyNewBulb";

// Utils
import { getSession, useSession } from "&utils/auth-utils";
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
          your need into real product. Before we begin the screening process, we
          need some preliminary information regarding your product needs and
          basic information for our point of contact throughout this process.
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

  try {
    const session = await getSession(context.req as NextApiRequest);

    if (session?.user == null) {
      throw new Error("User is not logged in!");
    }

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
    console.log(session.user);
    return {
      props: {
        organizationVerified: session.user.organizationVerified,
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
