import React, { useState, useEffect } from "react";
import ButtonLink from "&components/ButtonLink";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import urls from "&utils/urls";
import { Issue } from "&server/models/Issue";
import { getIssues } from "&actions/IssueActions";

interface PropTypes {
  projectId: string | null;
}

const Maintenance = ({ projectId }: PropTypes) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  useEffect(() => {
    getIssues().then((res) => setIssues(res));
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
              <th className="num">#</th>
              <th className="type">ISSUE TYPE</th>
              <th className="description">DESCRIPTION</th>
              <th className="start">START DATE</th>
              <th className="end">END DATE</th>
              <th className="status">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {issues &&
              issues.map((issue, index) => {
                console.log(issue);
                return (
                  <tr key={index}>
                    <td data-label="#">{issue.id}</td>
                    <td data-label="Issue Type">{issue.issueType.pop()}</td>
                    <td data-label="Description">{issue.description}</td>
                    <td data-label="Start Date">
                      {issue.createdAt && issue.createdAt.toLocaleString()}
                    </td>
                    <td data-label="End Date">
                      {issue.updatedAt && issue?.updatedAt.toLocaleString()}
                    </td>
                    <td data-label="Status">
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

// ISSUES WITH THIS FUNCTION
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const ApplicationManager = require("&server/mongodb/actions/ApplicationManager");
//   console.log(context);
//   try {
//     const session = await getSession({ req: context.req as any });
//     console.log("this should be in props \n: " + JSON.stringify(session?.user));
//     if (session?.user == null) {
//       throw new Error("User is not logged in!");
//     }
//     console.log(session);
//     return {
//       props: {
//         // projectId: accepted._id.toString(),
//         issues: session?.user,
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         issues: null,
//         error: error.message,
//       },
//     };
//   }
// };

export default Maintenance;
Maintenance.showSidebar = true;
Maintenance.isAdmin = true;
