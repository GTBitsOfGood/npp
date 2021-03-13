import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

// Components
import ButtonLink from "&components/ButtonLink";

// Utils
import urls from "&utils/urls";

interface PropTypes {
  projectId: string | null;
}

interface Issue {
  contact: Object;
  description: String;
  images: Array<String>;
  issueType: Array<String>;
  product: String;
  status: String;
  dateSubmitted: Date;
  dateCompleted: Date;
  _id: String;
}

const ReportLanding = ({ projectId }: PropTypes) => {
  const [issues, setIssues] = useState([]);

  // this can be moved into the getServerSideProps function which has access to user id -> i just can't get it working :((
  useEffect(() => {
    fetch("http://localhost:3000/api/issue?userId=5fb18e3732669f610658cad2")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIssues(data.payload);
      });
  }, []);

  return (
    <div className="landingPage">
      <div className="landingUpper">
        <div className="landingImage" />
        <div className="landingContent">
          <p className="landingText">
            Experiencing issues with your current Bits of Good product? Are
            loading times too long, or are your users facing bugs? Let us know,
            and we will contact you soon with an estimated timeline for a fix.
          </p>

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
      </div>

      <div className="tableContainer">
        <h2 className="tableText">Maintenance History</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>ISSUE TYPE</th>
              <th>DESCRIPTION</th>
              <th>START DATE</th>
              <th>END DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue: Issue, index) => {
              console.log(issue);
              return (
                <tr key={index}>
                  <td>{issue._id}</td>
                  <td>{issue.issueType.pop()}</td>
                  <td>{issue.description}</td>
                  <td>{new Date(issue.dateSubmitted).toLocaleString()}</td>
                  <td>
                    {issue?.dateCompleted === undefined
                      ? "-"
                      : new Date(issue?.dateCompleted).toLocaleString()}
                  </td>
                  <td>
                    {issue.status === "RESOLVED" ? (
                      <span
                        className="status"
                        style={{ backgroundColor: "#daedff" }}
                      >
                        Completed
                      </span>
                    ) : (
                      <span
                        className="status"
                        style={{
                          backgroundColor: "#ffdfb8",
                        }}
                      >
                        In progress
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
