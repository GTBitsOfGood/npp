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
          <h1 className="formTitle">Nonprofit Verification</h1>
          <h3 className="formDescription">
            Before we begin, we must verify your 501(c)(3) status as a
            nonprofit. This is just a formality before we are able to view any
            project applications you have for us.
          </h3>
        </div>

        <div className="padding" />

        <div className="rightCol">
          <h2>Basic Information</h2>
          <h3>Organization Name</h3>
          <Input
            value={orgName}
            placeholder="Bits of Good"
            onChange={(event) => setOrgName(event.target.value)}
          />

          <h3>EIN (Employer Identification Number)</h3>
          <Input
            value={einNumber}
            placeholder="XX-XXXXXXX"
            onChange={(event) => setEINNumber(event.target.value)}
          />

          <h3>
            Website
            <span className="inline"> (optional)</span>
          </h3>
          <Input
            value={websiteURL}
            placeholder="https://bitsofgood.org"
            onChange={(event) => setWebsite(event.target.value)}
          />

          <h3>Street Address</h3>
          <Input
            value={streetAddress}
            placeholder="848 Spring St NW"
            onChange={(event) => setStreetAddress(event.target.value)}
          />

          <div className={classes.addressContainer}>
            <div className={classes.city}>
              <h3>City</h3>
              <Input
                value={city}
                placeholder="Atlanta"
                onChange={(event) => setCity(event.target.value)}
              />
            </div>

            <div className={classes.state}>
              <h3>State</h3>
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
              <h3>Zip Code</h3>
              <Input
                value={zipCode}
                placeholder="30308"
                onChange={(event) => setZipCode(event.target.value)}
              />
            </div>
          </div>

          <h2 className={classes.missionHeader}>Your Mission</h2>
          <p className={classes.missionText}>
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

          {/* TOS Checkbox goes here */}

          <div className="buttonContainer">
            <Button className={classes.saveButton} variant="secondary">
              <h3>Save for Later</h3>
            </Button>
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
