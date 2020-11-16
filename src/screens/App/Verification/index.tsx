import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

// Components
import Input from "&components/Input";
import Button from "&components/Button";
import Select from "&components/Select";
import TextArea from "&components/TextArea";

// Utils
import urls from "&utils/urls";
import { states } from "&utils/constants";
import { updateOrganizationForUser } from "&actions/UserActions";
import { useSession } from "&utils/auth-utils";

// Styling
import classes from "./Verification.module.scss";

const missionPlaceholder =
  "At Bits of Good, our mission is to change lives one bit at a time - we serve our community by building powerful applications for local nonprofits.";

const VerificationScreen = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  const [orgName, setOrgName] = useState("");
  const [einNumber, setEINNumber] = useState("");
  const [websiteURL, setWebsite] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [missionStatement, setMissionStatement] = useState("");

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [loading, session]);

  const submit = async () => {
    try {
      if (
        orgName === "" ||
        einNumber === "" ||
        streetAddress === "" ||
        city === "" ||
        state === "" ||
        zipCode === "" ||
        missionStatement === ""
      ) {
        await Swal.fire({
          title: "Error",
          text: "Please provide all required fields!",
          icon: "error",
        });
        return;
      }

      const res = await updateOrganizationForUser(session.user.id, {
        organizationName: orgName,
        ein: einNumber,
        mission: missionStatement,
        address: {
          streetAddress,
          city,
          state,
          zipCode,
        },
      });

      if (res.organization == null) {
        throw new Error("Failed to update organization!");
      }

      await router.replace(urls.pages.app.index);
    } catch (error) {
      console.log("Error", error);

      await Swal.fire({
        title: "Error",
        text: "Failed to submit verification, please try again later!",
        icon: "error",
      });
    }
  };

  if (loading || !session) {
    return <h1 className="loadingText">Loading...</h1>;
  }

  return (
    <div className="applicationPage">
      <div className="root">
        <div className="sidePadding" />

        <div className="leftCol">
          <h1 className="formTitle">Non-profit Verification</h1>
          <h5 className="formDescription">
            TODO: Explain why we need this information: Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud commodo consequat.
          </h5>
        </div>

        <div className="padding" />

        <div className="rightCol">
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
            <span className="inline"> optional</span>
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
            <div className={classes.city}>
              <h5>City</h5>
              <Input
                value={city}
                placeholder="Atlanta"
                onChange={(event) => setCity(event.target.value)}
              />
            </div>

            <div className={classes.state}>
              <h5>State</h5>
              <Select onChange={(event) => setState(event.target.value)}>
                <option value="" disabled selected hidden>
                  Georgia
                </option>

                {states.map((states) => (
                  <option key={states} value={states}>
                    {states}
                  </option>
                ))}
              </Select>
            </div>

            <div className={classes.zip}>
              <h5>Zip Code</h5>
              <Input
                value={zipCode}
                placeholder="30308"
                onChange={(event) => setZipCode(event.target.value)}
              />
            </div>
          </div>

          <h5>Your Mission</h5>
          <p>
            We want to know the mission of your organization. Who do you care to
            serve? What services do you provide to the community? How could the
            collaboration with BoG help you achieve your mission?
          </p>

          <TextArea
            rows={4}
            value={missionStatement}
            placeholder={missionPlaceholder}
            onChange={(event) => setMissionStatement(event.target.value)}
          />

          <div className="buttonContainer">
            <Button variant="primary" onClick={submit}>
              <h3>Submit</h3>
            </Button>
          </div>
        </div>

        <div className="sidePadding" />
      </div>
    </div>
  );
};

export default VerificationScreen;

VerificationScreen.showSidebar = false;
VerificationScreen.isLanding = false;
