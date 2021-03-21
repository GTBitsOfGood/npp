import { Organization } from "&server/models/Organization";
import urls from "&utils/urls";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Verification = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(urls.baseUrl + "/api/user")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.payload);
      });
  }, []);

  interface User {
    email: String;
    organization: Organization;
    _id: String;
  }

  return (
    <div className="tableContainer">
      <h2 className="tabletext">Verification</h2>
      <table>
        <thead>
          <tr>
            <th>Account</th>
            <th>Organization</th>
            <th>EIN</th>
            <th>Address</th>
            <th>Date Submitted</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User, index) => {
            console.log(user);
            return (
              // change to verify screen once it is set up
              <Link href={urls.pages.admin.verification.index}>
                <tr key={index}>
                  <td>{user.email}</td>
                  <td>{user.organization.organizationName}</td>
                  <td>{user.organization.ein}</td>
                  <td>
                    {user.organization.address.city},{" "}
                    {user.organization.address.state}
                  </td>
                  <td>{user.organization.dateSubmitted}</td>
                  <td>{user.organization.status}</td>
                </tr>
              </Link>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Verification;

// different sidebar for admin?
Verification.showSidebar = true;
Verification.isLanding = false;
