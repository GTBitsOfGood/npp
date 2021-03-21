import React from "react";

const Project = () => {
  return (
    <div className="landingPage">
      this is the admin project page
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
        </table>
      </div>
    </div>
  );
};

export default Project;
Project.showSidebar = true;
