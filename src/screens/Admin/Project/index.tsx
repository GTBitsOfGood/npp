import { getUserById } from "&actions/UserActions";
import { Application } from "&server/models/Application";
import { User } from "&server/models/User";
import React, { useState, useEffect } from "react";
import { getApplications } from "../../../actions/ApplicationActions";

interface TableData extends Application {
  userInfo: User | undefined;
}

const Project = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [displayedData, setDisplayedData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const applications = await getApplications();
    const data = applications.map(async (application) => {
      if (application?.users && application?.users.length) {
        const userInfo = await getUserById(application.users.pop() as string);
        return { ...application, userInfo: userInfo };
      }
      return { ...application, userInfo: undefined };
    });
    Promise.all(data)
      .then((res) => {
        setTableData(res);
        handleTabClick("new");
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // new means
  // SUBMITTED
  // AWAITING_SCHEDULE

  // in progress means
  // SCHEDULED
  // REVIEW

  // closed means
  // DECISION
  const handleTabClick = (tab: string) => {
    switch (tab) {
      case "new":
        setDisplayedData(
          tableData.filter(
            (application) =>
              application.stage === "SUBMITTED" ||
              application.stage === "AWAITING_SCHEDULE"
          )
        );
        break;
      case "in progress":
        setDisplayedData(
          tableData.filter(
            (application) =>
              application.stage === "SCHEDULED" ||
              application.stage === "REVIEW"
          )
        );
        break;
      case "closed":
        setDisplayedData((displayedData) =>
          displayedData.filter(
            (application) => application.stage === "DECISION"
          )
        );
        break;
      default:
        setDisplayedData(
          tableData.filter(
            (application) =>
              application.stage === "SUBMITTED" ||
              application.stage === "AWAITING_SCHEDULE"
          )
        );
    }
  };

  return (
    <div className="adminLandingPage">
      <h2 className="landingPageTitle">Project Application</h2>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="tabs">
            <button onClick={() => handleTabClick("new")}>New</button>
            <button onClick={() => handleTabClick("in progress")}>
              In Progress
            </button>
            <button onClick={() => handleTabClick("closed")}>Closed</button>
          </div>
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>ORGANIZATION</th>
                  <th>EIN</th>
                  <th>ADDRESS</th>
                  <th>DATE SUBMITTED</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.map((application) => {
                  return (
                    <>
                      <tr>
                        <td>
                          {application?.userInfo &&
                          application?.userInfo?.organization
                            ? application?.userInfo?.organization
                                ?.organizationName
                            : "N/A"}
                        </td>
                        <td>00-00000</td>
                        <td>
                          <div>
                            {application?.userInfo &&
                            application?.userInfo?.organization
                              ? `${application?.userInfo?.organization?.address?.city}, ${application?.userInfo?.organization?.address?.state}`
                              : "N/A"}
                          </div>
                          <div className="streetName">
                            {application?.userInfo
                              ? application?.userInfo?.organization?.address
                                  ?.streetAddress
                              : "N/A"}
                          </div>
                        </td>
                        <td>
                          {application?.createdAt
                            ? application?.createdAt.toString().substring(0, 10)
                            : "N/A"}
                        </td>
                        <td>
                          <span className="status">{application.stage}</span>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
Project.showSidebar = true;
Project.isAdmin = true;
