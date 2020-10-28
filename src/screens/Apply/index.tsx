import React, { useState } from "react";
// import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import classes from "./ApplyScreen.module.scss";
import Checkbox from "../../components/Checkbox";
import TextArea from "../../components/TextArea";
import Input from "../../components/Input";
import Button from "../../components/Button";

const descriptionPlaceholder =
  "Enter a brief description of the type of product you are looking for. It’s okay if you aren’t entirely sure, but this could give us a couple of ideas to discuss with you during our first meeting.";

const ApplyScreen = () => {
  // const router = useRouter();
  const [session, loading] = useSession();

  const [isWebsite, setIsWebsite] = useState(false);
  const [lookingFor, setLookingFor] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [orgPhone, setOrgPhone] = useState("");

  const submit = () => {
    console.log(
      isWebsite,
      lookingFor,
      contactName,
      contactEmail,
      contactPhone,
      orgPhone
    );
  };

  const saveForLater = () => {
    // TODO: save items
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={classes.root}>
      <h1>Sign up for a Project!</h1>

      <h2>Product Needs</h2>
      <div className={classes.divider} />

      <h5>
        Product Type
        <span className={classes.inline}> (select all that apply)</span>
      </h5>
      <div className={classes.checkboxcontainer}>
        <div className={classes.checkbox}>
          <Checkbox
            label="Website"
            checked={isWebsite}
            onClick={() => setIsWebsite(true)}
          />
        </div>
        <div className={classes.checkbox}>
          <Checkbox
            label="Mobile App"
            checked={!isWebsite}
            onClick={() => setIsWebsite(false)}
          />
        </div>
      </div>

      <h5>What You Are Looking For</h5>
      <TextArea
        value={lookingFor}
        className={classes.ta}
        placeholder={descriptionPlaceholder}
        onChange={(event) => setLookingFor(event.target.value)}
      />

      <div className={classes.contactinfo}>
        <h2>Contact Information</h2>
        <div className={classes.divider} />

        <h5>Primary Contact</h5>
        <Input
          value={contactName}
          placeholder="Emily Wilson"
          className={classes.textinput}
          onChange={(event) => setContactName(event.target.value)}
        />

        <h5>Email</h5>
        <Input
          value={contactEmail}
          className={classes.textinput}
          placeholder="hello@bitsofgood.org"
          onChange={(event) => setContactEmail(event.target.value)}
        />

        <h5>
          Organization Phone Number
          <span className={classes.inline}> optional</span>
        </h5>
        <Input
          value={orgPhone}
          className={classes.textinput}
          placeholder="(+1) 202-555-0161"
          onChange={(event) => setOrgPhone(event.target.value)}
        />

        <h5>
          Primary Contact Phone Number
          <span className={classes.inline}> optional</span>
        </h5>
        <Input
          value={contactPhone}
          className={classes.textinput}
          placeholder="(+1) 202-555-0161"
          onChange={(event) => setContactPhone(event.target.value)}
        />
      </div>

      <div className={classes.buttoncontainer}>
        <div className={classes.button}>
          <Button variant="primary" onClick={saveForLater}>
            <h3>Save for Later</h3>
          </Button>
        </div>
        <div className={classes.button}>
          <Button variant="secondary" onClick={submit}>
            <h3 className={classes.submit}>Submit</h3>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplyScreen;
