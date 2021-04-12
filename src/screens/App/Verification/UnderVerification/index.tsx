import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Components
import Button from "&components/Button";

// Interfaces
import { Organization } from "&server/models/Organization";

// Utils
import urls from "&utils/urls";
import { getUserById } from "&actions/UserActions";
import { useSession } from "&utils/auth-utils";

// Styling
import classes from "./UnderVerification.module.scss";

const UnderVerificationScreen = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [organization, setOrganization] = useState<Organization>();

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [loading, session]);

  useEffect(() => {
    void fetchOrgData();
  }, []);

  const fetchOrgData = async () => {
    const user = await getUserById(session.user.id);

    setOrganization(user.organization);
  };

  if (loading || !session) {
    return <h1 className="loadingText">Loading...</h1>;
  }

  return (
    <div className="applicationPage">
      <div className="root">
        <div className="sidePadding" />

        <div className="leftCol">
          <h1 className="formTitle">Under Verification</h1>
          <h5 className="formDescription">
            You already submitted your verification request. Please wait for us
            to confirm the information. Thank you.
          </h5>
        </div>

        <div className="padding" />

        <div className="rightCol">
          <h2>Basic Information</h2>
          <h3>Organization Name</h3>
          <p>{organization?.organizationName}</p>

          <h3>EIN (Employer Identification Number)</h3>
          <p>{organization?.ein}</p>

          <h3>Website</h3>
          <p>{organization?.website}</p>

          <h3>Street Address</h3>
          <p>{organization?.address.streetAddress}</p>

          <div className={classes.addressContainer}>
            <div className={classes.city}>
              <h3>City</h3>
              <p>{organization?.address.city}</p>
            </div>

            <div className={classes.state}>
              <h3>State</h3>
              <p>{organization?.address.state}</p>
            </div>

            <div className={classes.zip}>
              <h3>Zip Code</h3>
              <p>{organization?.address.zipCode}</p>
            </div>
          </div>

          <h2 className={classes.missionHeader}>Your Mission</h2>
          <p className={classes.missionText}>{organization?.mission}</p>

          <div className={classes.buttonContainer}>
            <Button
              className={classes.resubmitButton}
              variant="secondary"
              onClick={() => router.push(urls.pages.app.verification)}
            >
              <h4 className={classes.saveButtonText}>
                Resubmit a verification request
              </h4>
            </Button>
          </div>
        </div>

        <div className="sidePadding" />
      </div>
    </div>
  );
};

export default UnderVerificationScreen;

UnderVerificationScreen.showSidebar = false;
UnderVerificationScreen.isLanding = false;
