import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

// Components
import ButtonLink from "&components/ButtonLink";

// Utils
import urls from "&utils/urls";

interface PropTypes {
  projectId: string | null;
}

const ReportLanding = ({ projectId }: PropTypes) => (
  <div className="landingPage">
    <h1 className="landingHeader">Report a Problem</h1>

    <div className="landingContent">
      <div className="landingPadding" />

      <h3 className="landingText">
        Experiencing issues with your current Bits of Good product? Are loading
        times too long, or are your users facing bugs? Let us know, and we will
        contact you soon with an estimated timeline for a fix.
      </h3>

      <div className="landingPadding" />
    </div>

    <div className="landingButton">
      <ButtonLink
        variant="primary"
        href={urls.pages.app.report.create(projectId ?? "1")}
        // disabled={projectId == null}
      >
        <h3>File an Issue</h3>
      </ButtonLink>
    </div>
  </div>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ApplicationManager = require("&server/mongodb/actions/ApplicationManager");

  try {
    const session = await getSession({ req: context.req as any });

    if (session?.user == null) {
      throw new Error("User is not logged in!");
    }

    const accepted = await ApplicationManager.getAcceptedApplication(
      session.user
    );

    return {
      props: {
        projectId: accepted.id,
      },
    };
  } catch (error) {
    return {
      props: {
        projectId: null,
        error: error.message,
      },
    };
  }
};

export default ReportLanding;

ReportLanding.showSidebar = true;
ReportLanding.isLanding = false;
