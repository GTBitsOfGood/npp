import { Organization } from "&server/models/Organization";
import { OrganizationStatus } from "&server/models/OrganizationStatus";
import urls from "&utils/urls";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import classes from "./Verification.module.scss";

const Verification = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(OrganizationStatus.Pending);

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

  const sortBy = (event: any) => {
    let status = event.target.id;
    if (status === "pending") {
      setSelected(OrganizationStatus.Pending);
    } else if (status === "verified") {
      setSelected(OrganizationStatus.Verified);
    } else {
      setSelected(OrganizationStatus.Unverified);
    }
  };

  return (
    <div className="tableContainer">
      <h2 className="tabletext">Verification</h2>
      <div>
        <button
          className={clsx(
            classes.statuses,
            selected === OrganizationStatus.Pending &&
              (classes.active, classes.rectangle)
          )}
          id="pending"
          onClick={sortBy}
        >
          Pending
        </button>
        <button
          className={clsx(
            classes.statuses,
            selected === OrganizationStatus.Verified &&
              (classes.active, classes.rectangle)
          )}
          id="verified"
          onClick={sortBy}
        >
          Verified
        </button>
        <button
          className={clsx(
            classes.statuses,
            selected === OrganizationStatus.Unverified &&
              (classes.active, classes.rectangle)
          )}
          id="unverified"
          onClick={sortBy}
        >
          Unverified
        </button>
      </div>
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
          {users
            .filter(
              (unfiltered: User) => unfiltered.organization.status === selected
            )
            .map((user: User, index) => {
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
