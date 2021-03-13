import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

// Components
import ButtonLink from "&components/ButtonLink";

const issues = [{}];

// Utils
import urls from "&utils/urls";

interface PropTypes {
  projectId: string | null;
}

const ReportLanding = ({ projectId }: PropTypes) => (
  <div className="landingPage">
    <div className="landingUpper">
      <div className="imageBox" />

      <div className="landingContent">
        <h3 className="landingText">
          Experiencing issues with your current Bits of Good product? Are
          loading times too long, or are your users facing bugs? Let us know,
          and we will contact you soon with an estimated timeline for a fix.
        </h3>

        <div className="landingButton">
          <ButtonLink
            variant="primary"
            href={urls.pages.app.report.create(projectId ?? "1")}
            // disabled={projectId == null}
          >
            <h3>Report a Problem</h3>
          </ButtonLink>
        </div>
      </div>

      <div className="landingPadding" />
    </div>

    <div className="tableContainer">
      <h2 className="tableText">Maintenance History</h2>
      <table>
        <thead>
          <th>#</th>
          <th>ISSUE TYPE</th>
          <th>DESCRIPTION</th>
          <th>START DATE</th>
          <th>END DATE</th>
          <th>STATUS</th>
        </thead>
        <tbody>
          {issues.map((issue) => {
            return (
              <tr>
                <td>000000</td>
                <td>data missing</td>
                <td>testing</td>
                <td>01/20/2020</td>
                <td> </td>
                <td>
                  <span
                    className="status"
                    style={{ backgroundColor: "yellow" }}
                  >
                    In progress
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
        projectId: accepted._id.toString(),
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
