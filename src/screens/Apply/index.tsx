import React, { useState } from "react";
// import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Input from "&components/Input";
import Button from "&components/Button";
import Checkbox from "&components/Checkbox";
import TextArea from "&components/TextArea";

// Styling
import classes from "./ApplyScreen.module.scss";

const descriptionPlaceholder =
  "Enter a brief description of the type of product you are looking for. It’s okay if you aren’t entirely sure, but this could give us a couple of ideas to discuss with you during our first meeting.";

const ApplyScreen = () => {
  // const router = useRouter();
  const [loading] = useSession();

  const [productType, setProductType] = useState([false, false]);
  const [lookingFor, setLookingFor] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [orgPhone, setOrgPhone] = useState("");

  const checkProductType = (index: number) => {
    const tempProductType = [...productType];
    tempProductType[index] = !tempProductType[index];
    setProductType(tempProductType);
  };

  const submit = () => {
    console.log(
      productType,
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

  // TODO: Fix
  if (!loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={classes.root}>
      <div className={classes.leftCol}>
        <h1 className={classes.formTitle}>Sign up for a Project</h1>
        <h5 className={classes.formDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud commodo consequat.
        </h5>
      </div>

      <div className={classes.rightCol}>
        <h2 className={classes.sectionHeader}>Product Needs</h2>

        <h5>
          Product Type
          <span className={classes.inline}> (select all that apply)</span>
        </h5>
        <div className={classes.checkboxcontainer}>
          <div className={classes.checkbox}>
            <Checkbox
              label="Website"
              checked={productType[0]}
              onClick={() => checkProductType(0)}
            />
          </div>
          <div className={classes.checkbox}>
            <Checkbox
              label="Mobile App"
              checked={productType[1]}
              onClick={() => checkProductType(1)}
            />
          </div>
        </div>

        <h5>What You Are Looking For</h5>
        <TextArea
          value={lookingFor}
          className={classes.ta}
          placeholder={descriptionPlaceholder}
          onChange={(event: any) => setLookingFor(event.target.value)}
        />

        <h2 className={classes.sectionHeader}>Contact Information</h2>

        <h5>Primary Contact</h5>
        <Input
          value={contactName}
          placeholder="Emily Wilson"
          onChange={(event: any) => setContactName(event.target.value)}
        />

        <h5>Email</h5>
        <Input
          value={contactEmail}
          placeholder="hello@bitsofgood.org"
          onChange={(event: any) => setContactEmail(event.target.value)}
        />

        <h5>
          Organization Phone Number
          <span className={classes.inline}> optional</span>
        </h5>
        <Input
          value={orgPhone}
          placeholder="(414) 555-0161"
          onChange={(event: any) => setOrgPhone(event.target.value)}
        />

        <h5>
          Primary Contact Phone Number
          <span className={classes.inline}> optional</span>
        </h5>
        <Input
          value={contactPhone}
          placeholder="(414) 555-0161"
          onChange={(event: any) => setContactPhone(event.target.value)}
        />

        <div className={classes.buttonContainer}>
          <Button variant="primary" onClick={saveForLater}>
            <h3>Save for Later</h3>
          </Button>
          <div className={classes.secondButton}>
            <Button variant="secondary" onClick={submit}>
              <h3 className={classes.submit}>Submit</h3>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyScreen;
