import React, { useState } from "react";
// import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Input from "&components/Input";
import Button from "&components/Button";
import TextArea from "&components/TextArea";

// Styling
import classes from "./Verification.module.scss";

/* Questions:
1. How to do a drop down box?
2. How to designate things as optional
*/

const missionPlaceholder =
  "At Bits of Good, our mission is to change lives one bit at a time - we serve our community by building powerful applications for local nonprofits.";

const VerificationScreen = () => {
  const [loading] = useSession();

  const [orgName, setOrgName] = useState("");
  const [einNumber, setEINNumber] = useState("");
  const [websiteURL, setWebsite] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [missonStatement, setMissionStatement] = useState("");

  const submit = () => {
    console.log(
      orgName,
      einNumber,
      websiteURL,
      streetAddress,
      city,
      state,
      zipcode,
      missonStatement
    );
  };

  const saveForLater = () => {
    // TODO: save items
  };

  if (loading) {
    return <h1 className={classes.loadingText}>Loading...</h1>;
  }

  return (
    <div className="verificationPage">
      <div className={classes.root}>
        <div className={classes.leftCol}>
          <h1 className={classes.formTitle}>Non-Profit Verification</h1>
          <h5 className={classes.formDescription}>
            {" "}
            TODO: Explain why we need this information: Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud commodo consequat.
          </h5>
        </div>

        <div className={classes.rightCol}>
          <h5>Organization Name</h5>
          <Input
            value={orgName}
            placeholder="Bits of Good"
            onChange={(event: any) => setOrgName(event.target.value)}
          />

          <h5>EIN</h5>
          <Input
            value={einNumber}
            placeholder="XX-XXXXXXX"
            onChange={(event: any) => setEINNumber(event.target.value)}
          />

          <h5>Website</h5>
          <Input
            value={websiteURL}
            placeholder="https://bitsofgood.org"
            onChange={(event: any) => setWebsite(event.target.value)}
          />

          <h5>Street Address</h5>
          <Input
            value={streetAddress}
            placeholder="848 Spring St NW"
            onChange={(event: any) => setStreetAddress(event.target.value)}
          />

          <h5>City</h5>
          <Input
            value={city}
            placeholder="Atlanta"
            onChange={(event: any) => setCity(event.target.value)}
          />

          <h5>Zipcode</h5>
          <Input
            value={zipcode}
            placeholder="30308"
            onChange={(event: any) => setZipcode(event.target.value)}
          />

          <h5>Your Mission</h5>
          <h1>
            We want to know the mission of your organization. Who do you care to
            serve? What services do you provide to the community? How could the
            collaboration with BoG help you achieve your mission?
          </h1>
          <TextArea
            rows={4}
            value={missonStatement}
            placeholder={missionPlaceholder}
            onChange={(event: any) => setMissionStatement(event.target.value)}
          />

          <div className={classes.buttonContainer}>
            <Button variant="primary" onClick={submit}>
              <h3>Apply</h3>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationScreen;
