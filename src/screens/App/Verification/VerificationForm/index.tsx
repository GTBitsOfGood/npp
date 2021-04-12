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
import { DateTime } from "luxon";

const missionPlaceholder =
  "At Bits of Good, our mission is to change lives one bit at a time - we serve our community by building powerful applications for local nonprofits.";

const VerificationFormScreen = () => {
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
    setOrgName((initialValue) =>
      getLocalItem("verification-orgName", initialValue)
    );
    setEINNumber((initialValue) =>
      getLocalItem("verification-einNumber", initialValue)
    );
    setWebsite((initialValue) =>
      getLocalItem("verification-website", initialValue)
    );
    setStreetAddress((initialValue) =>
      getLocalItem("verification-streetAddress", initialValue)
    );
    setCity((initialValue) => getLocalItem("verification-city", initialValue));

    setState((initialValue) =>
      getLocalItem("verification-state", initialValue)
    );
    setZipCode((initialValue) =>
      getLocalItem("verification-zipCode", initialValue)
    );
    setMissionStatement((initialValue) =>
      getLocalItem("verification-missionStatememt", initialValue)
    );
  }, []);

  const getLocalItem = (name: string, fallbackValue: string | boolean[]) => {
    const storedValue = localStorage.getItem(name);

    if (storedValue == null) {
      return fallbackValue;
    }

    try {
      return JSON.parse(storedValue);
    } catch (error) {
      return storedValue;
    }
  };

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [loading, session]);

  const submit = async () => {
    try {
      localStorage.removeItem("verification-orgName");
      localStorage.removeItem("verification-einNumber");
      localStorage.removeItem("verification-website");
      localStorage.removeItem("verification-streetAddress");
      localStorage.removeItem("verification-city");
      localStorage.removeItem("verification-state");
      localStorage.removeItem("verification-zipCode");
      localStorage.removeItem("verification-missionStatement");

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
        ...(websiteURL && { website: websiteURL }),
        // @ts-ignore
        dateSubmitted: DateTime.now(),
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

  const saveForLater = async () => {
    try {
      localStorage.setItem("verification-orgName", orgName);
      localStorage.setItem("verification-einNumber", einNumber);
      localStorage.setItem("verification-website", websiteURL);
      localStorage.setItem("verification-streetAddress", streetAddress);
      localStorage.setItem("verification-city", city);
      localStorage.setItem("verification-state", state);
      localStorage.setItem("verification-zipCode", zipCode);
      localStorage.setItem("verification-missionStatement", missionStatement);

      await Swal.fire({
        title: "Saved",
        text: "Successfully saved verification application!",
        icon: "success",
      });
    } catch (error) {
      console.log("Error", error);

      await Swal.fire({
        title: "Error",
        text: "Failed to save, please try again!",
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
          <h5 className="formDescription">
            Before we begin, we must verify your 501(c)(3) status as a
            nonprofit. This is just a formality before we are able to view any
            project applications you have for us.
          </h5>
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

          <div className={classes.termsContainer}>
            <input type="checkbox" className={classes.termsCheckbox} />
            <p className={classes.termsText}>
              {"By continuing, you agree to our "}
              <a href="replace this" className={classes.termsLink}>
                Terms of Service
              </a>
            </p>
          </div>

          <div className={classes.buttonContainer}>
            <Button
              className={classes.saveButton}
              variant="secondary"
              onClick={saveForLater}
            >
              <h4 className={classes.saveButtonText}>Save for Later</h4>
            </Button>
            <Button
              className={classes.submitButton}
              variant="primary"
              onClick={submit}
            >
              <h4 className={classes.submitButtonText}>Submit</h4>
            </Button>
          </div>
        </div>

        <div className="sidePadding" />
      </div>
    </div>
  );
};

export default VerificationFormScreen;

VerificationFormScreen.showSidebar = false;
VerificationFormScreen.isLanding = false;
