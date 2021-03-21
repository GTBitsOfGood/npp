import React, { useState } from "react";

const Project = () => {
  const tableData = useState([]);

  const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // query database here for new info to populate table
    e.preventDefault();
  };

  return (
    <div className="adminLandingPage">
      <h2 className="landingPageTitle">Project Application</h2>
      <div className="tabs">
        <button onClick={handleTabClick}>New</button>
        <button>In Progress</button>
        <button>Closed</button>
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
            <tr>
              <td>Bits of Good</td>
              <td>00-00000</td>
              <td>
                <div>Atlanta, Georgia</div>
                <div className="streetName">100 northside dr. nw</div>
              </td>
              <td>01/03/2020</td>
              <td></td>
            </tr>
            <tr>
              <td>Liv2BGirl</td>
              <td>00-00000</td>
              <td>
                <div>Atlanta, Georgia</div>
                <div className="streetName">100 northside dr. nw</div>
              </td>
              <td>01/03/2020</td>
              <td>
                <span className="status">New</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Project;
Project.showSidebar = true;
