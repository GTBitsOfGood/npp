import React from "react";
import { GetServerSideProps } from "next";

// Components
import Statusbar from "&components/Statusbar";
import ButtonLink from "&components/ButtonLink";

// Iconography
import ApplyNewBulb from "&icons/ApplyNewBulb";

// Utils
import urls, { getApplicationUrl } from "&utils/urls";
import { getSession } from "&utils/auth-utils";

// interface PropTypes {
//   organizationVerified: boolean;
// }

const ReportsPage = () => (
  <div className="landingPage">
    <h1 className="landingHeader">Apply for a New Project</h1>

    <Statusbar application={null} />

    <ApplyNewBulb className="landingImage" />

    <div className="landingContent">
      <div className="landingPadding" />

      <h3 className="landingText">
        As a partner, Bits of Good will help you build software that turns your
        need into real product. Before we begin the screening process, we need
        some preliminary information regarding your product needs and basic
        information for our point of contact throughout this process.
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ApplicationManager = require("&server/mongodb/actions/ApplicationManager");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const UserManager = require("&server/mongodb/actions/UserManager");

  try {
    const session = await getSession({ req: context.req } as any);

    if (session?.user == null || !session.user.isAdmin) {
      return {
        props: {},
        redirect: {
          destination: urls.pages.index,
          permanent: false,
        },
      };
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
        organizationVerified: true,
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

export default ReportsPage;

ReportsPage.showSidebar = true;
ReportsPage.isLanding = false;
