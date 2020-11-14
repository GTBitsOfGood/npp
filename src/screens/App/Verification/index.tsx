import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Input from "&components/Input";
import Button from "&components/Button";
import Select from "&components/Select";
import TextArea from "&components/TextArea";

// Styling
import classes from "./Verification.module.scss";

// Utils
import urls from "&utils/urls";

/* Questions:
1. How to do a drop down box?
2. How to designate things as optional
*/

const missionPlaceholder =
  "At Bits of Good, our mission is to change lives one bit at a time - we serve our community by building powerful applications for local nonprofits.";

const states = [
  "Alabama",
  "Alaska",
  "American Samoa",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Federated States of Micronesia",
  "Florida",
  "Georgia",
  "Guam",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Marshall Islands",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Northern Mariana Islands",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Palau",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virgin Island",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const VerificationScreen = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  const [orgName, setOrgName] = useState("");
  const [einNumber, setEINNumber] = useState("");
  const [websiteURL, setWebsite] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [missonStatement, setMissionStatement] = useState("");

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [loading, session]);

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

  if (loading || !session) {
    return <h1 className="loadingText">Loading...</h1>;
  }

  return (
    <div className="verificationPage">
      <div className={classes.root}>
        <div className={classes.leftCol}>
          <h1 className={classes.formTitle}>Non-profit Verification</h1>
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
            onChange={(event) => setOrgName(event.target.value)}
          />

          <h5>EIN</h5>
          <Input
            value={einNumber}
            placeholder="XX-XXXXXXX"
            onChange={(event) => setEINNumber(event.target.value)}
          />

          <h5>
            Website
            <span className={classes.inline}> (Optional)</span>
          </h5>
          <Input
            value={websiteURL}
            placeholder="https://bitsofgood.org"
            onChange={(event) => setWebsite(event.target.value)}
          />

          <h5>Street Address</h5>
          <Input
            value={streetAddress}
            placeholder="848 Spring St NW"
            onChange={(event) => setStreetAddress(event.target.value)}
          />

          <div className={classes.addressContainer}>
            <div className={classes.type}>
              <h3>City</h3>
              <Input
                value={city}
                placeholder="Atlanta"
                onChange={(event) => setCity(event.target.value)}
              />
            </div>
            <div className={classes.type}>
              <h3>State</h3>
              <Select onChange={(event) => setState(event.target.value)}>
                {states.map((states) => (
                  <option key={states} value={states}>
                    {states}
                  </option>
                ))}
              </Select>
            </div>
            <div className={classes.type}>
              <h3>Zip Code</h3>
              <Input
                value={zipcode}
                placeholder="30308"
                onChange={(event) => setZipcode(event.target.value)}
              />
            </div>
          </div>

          {/*
          <div className={classes.inlineContainer}>
            <h5>City</h5>

            <h5>State</h5>

            <h5>Zipcode</h5>
          </div>

          <div className={classes.inlineContainer}>
            <Input
              value={city}
              placeholder="Atlanta"
              onChange={(event: any) => setCity(event.target.value)}
            />
            <Select onChange={(event: any) => setState(event.target.value)}>
              {states.map((states) => (
                <option key={states} value={states}>
                  {states}
                </option>
              ))}
            </Select>
            <Input
              value={zipcode}
              placeholder="30308"
              onChange={(event: any) => setZipcode(event.target.value)}
            />
          </div>
              */}

          <h5>Your Mission</h5>
          <h4>
            We want to know the mission of your organization. Who do you care to
            serve? What services do you provide to the community? How could the
            collaboration with BoG help you achieve your mission?
          </h4>
          <TextArea
            rows={4}
            value={missonStatement}
            placeholder={missionPlaceholder}
            onChange={(event) => setMissionStatement(event.target.value)}
          />

          <div className={classes.buttonContainer}>
            <Button variant="primary" onClick={submit}>
              <h3>Submit</h3>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationScreen;
