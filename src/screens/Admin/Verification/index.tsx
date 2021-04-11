import urls from "&utils/urls";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import classes from "./Verification.module.scss";

import { Organization } from "&server/models/Organization";
import { OrganizationStatus } from "&server/models/OrganizationStatus";

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
    orgStatus: OrganizationStatus;
    _id: String;
  }

  const sortBy = (event: any) => {
    let status = event.target.id;
    if (status === "pending") {
      setSelected(OrganizationStatus.Pending);
    } else if (status === "verified") {
      setSelected(OrganizationStatus.Verified);
    } else {
      setSelected(OrganizationStatus.Rejected);
    }
  };

  return (
    <div className="tableContainer">
      <h2 className="tabletext">Verification</h2>
      <div>
        <button
          className={clsx(
            classes.statuses,
            selected === OrganizationStatus.Pending && classes.active
          )}
          id="pending"
          onClick={sortBy}
        >
          Pending
        </button>

        <button
          className={clsx(
            classes.statuses,
            selected === OrganizationStatus.Verified && classes.active
          )}
          id="verified"
          onClick={sortBy}
        >
          Verified
        </button>
        <button
          className={clsx(
            classes.statuses,
            selected === OrganizationStatus.Rejected && classes.active
          )}
          id="rejected"
          onClick={sortBy}
        >
          Rejected
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
              (unfiltered: User) =>
                unfiltered.organization && unfiltered.orgStatus === selected
            )
            .map((user: User, index) => {
              return (
                <Link
                  key={index}
                  href={urls.pages.admin.verification.verify(
                    user.email as string
                  )}
                >
                  <tr>
                    <td>{user.email}</td>
                    <td>{user.organization.organizationName}</td>
                    <td>{user.organization.ein}</td>
                    <td>
                      {user.organization.address.city},{" "}
                      {user.organization.address.state}
                    </td>
                    <td>{user.organization.dateSubmitted}</td>
                    <td>
                      {selected === OrganizationStatus.Pending ? (
                        <span className={classes.pending}>
                          {user.orgStatus}
                        </span>
                      ) : selected === OrganizationStatus.Verified ? (
                        <span className={classes.verified}>
                          {user.orgStatus}
                        </span>
                      ) : (
                        <span className={classes.rejected}>
                          {user.orgStatus}
                        </span>
                      )}
                    </td>
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
