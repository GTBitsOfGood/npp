import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { updateOrgStatus } from "&actions/UserActions";
import classes from "./Verification.module.scss";
import Button from "&components/Button";
import urls from "&utils/urls";
import Link from "next/link";

import { OrganizationStatus } from "&server/models/OrganizationStatus";
import { Organization } from "&server/models/Organization";
import { User } from "&server/models/User";

const VerifyPage = () => {
  const router = useRouter();
  const { org: email } = router.query;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({} as User);
  const [org, setOrg] = useState({} as Organization);

  useEffect(() => {
    if (email)
      void fetch(`${urls.api.user}?email=${email}`)
        .then((response) => response.json())
        .then((user) => {
          setOrg(user.payload.organization || {});
          setUser(user.payload);
          setLoading(false);
        })
        .catch(() => setLoading(false));
  }, [email]);

  const updateOrg = (status: OrganizationStatus) => {
    void updateOrgStatus(user.id, status);
    void router.push("/admin/verification");
  };

  const emptyObj = (obj: any) => Object.keys(obj).length === 0;

  if (!loading && !emptyObj(user) && !emptyObj(org)) {
    return (
      <div className={classes.verifyOrgContainer}>
        <Link href="/admin/verification">
          <div className={classes.backButton}>
            <i className={classes.arrow}></i>
            BACK TO VERIFICATION
          </div>
        </Link>

        <h3>Account</h3>
        <p>{email}</p>

        <h3>Organization Name</h3>
        <p>{org?.organizationName}</p>

        <h3>EIN</h3>
        <p>{org?.ein}</p>

        {org?.website && (
          <>
            <h3>Website</h3>
            <p>
              <a href={org?.website} rel="noreferrer" target="_blank">
                {org?.website}
              </a>
            </p>
          </>
        )}

        <h3>Address</h3>
        <p>
          {org?.address.streetAddress}, {org?.address.city},{" "}
          {org?.address.state}, {org?.address.zipCode}
        </p>

        <h3>Mission</h3>
        <p>{org?.mission}</p>

        <Button
          className={classes.verify}
          variant="primary"
          onClick={() => updateOrg(OrganizationStatus.Verified)}
        >
          Verify
        </Button>
        <Button
          className={classes.reject}
          variant="secondary"
          onClick={() => updateOrg(OrganizationStatus.Rejected)}
        >
          Reject
        </Button>
      </div>
    );
  } else if (!loading) {
    return (
      <h1 className="loadingText">
        Couldn&apos;t find a nonprofit associated with {email}!
      </h1>
    );
  } else {
    return <></>;
  }
};

export default VerifyPage;

// different sidebar for admin pages?
VerifyPage.showSidebar = true;
VerifyPage.isLanding = false;
