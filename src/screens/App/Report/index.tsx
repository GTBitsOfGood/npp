import classes from "./ReportPage.module.scss";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import Input from "&components/Input";
import Button from "&components/Button";
import Checkbox from "&components/Checkbox";
import TextArea from "&components/TextArea";
import urls from "&utils/urls";
import { useRouter } from "next/router";

const placeHolder =
  "Enter a brief description of the issue with your software. We will do our best to replicate it on our end, and then reach out if we have any questions or have suggestions for how to fix it on your end.";

const ReportScreen = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [issueType, setIssueType] = useState([false, false]);
  const [issuePassage, setIssuePassage] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [orgPhone, setOrgPhone] = useState("");

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [loading, session]);

  const checkIssueType = (index: number) => {
    const tempType = [...issueType];
    tempType[index] = !tempType[index];
    setIssueType(tempType);
  };

  const submit = () => {
    console.log(issueType, issuePassage, contactName, phone, orgPhone);
  };

  const saveForLater = () => {
    console.log("Save for later!");
  };

  if (loading || !session) {
    return <h1 className="loadingText">Loading...</h1>;
  }

  return (
    <div>
      <div className={classes.root}>
        <div className={classes.spad} />
        <div className={classes.leftColumn}>
          <h1 className={classes.title}> Report a Problem </h1>
          <h5 className={classes.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud commodo consequat.
          </h5>
        </div>
        <div className={classes.pad} />
        <div className={classes.rightColumn}>
          <h2 className={classes.header}> General Issue</h2>
          <h5>
            Issue Type
            <span className={classes.inline}> (select all that apply) </span>
          </h5>
          <div className={classes.box}>
            <Checkbox
              label="Not Loading"
              checked={issueType[0]}
              onClick={() => checkIssueType(0)}
            />
            <Checkbox
              label="Data Missing"
              checked={issueType[1]}
              onClick={() => checkIssueType(1)}
            />
          </div>
          <h5> What is the issue? </h5>
          <TextArea
            rows={4}
            value={issuePassage}
            placeholder={placeHolder}
            onChange={(event) => setIssuePassage(event.target.value)}
          />
          <h2 className={classes.header}> Contact Information </h2>
          <h5> Primary Contact </h5>
          <Input
            value={contactName}
            placeholder="Riley Smith"
            onChange={(event) => setContactName(event.target.value)}
          />
          <h5>
            Organization Phone Number
            <span className={classes.inline}> optional </span>{" "}
          </h5>
          <Input
            type="number"
            value={orgPhone}
            placeholder="(414) 555-0161"
            onChange={(event) => setOrgPhone(event.target.value)}
          />
          <h5>
            Primary Contact Phone Number
            <span className={classes.inline}> optional </span>
          </h5>
          <Input
            type="number"
            value={phone}
            placeholder="(414) 555-0161"
            onChange={(event) => setPhone(event.target.value)}
          />
          <div className={classes.buttonbox}>
            <Button variant="secondary" onClick={saveForLater}>
              {" "}
              <h3> Save For Later </h3>{" "}
            </Button>
            <Button
              className={classes.submitButton}
              variant="primary"
              onClick={submit}
            >
              {" "}
              <h3> Submit </h3>
            </Button>
          </div>
        </div>
        <div className={classes.spad} />
      </div>
    </div>
  );
};

export default ReportScreen;
