import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

// Components
import Input from "&components/Input";
import Button from "&components/Button";
import Checkbox from "&components/Checkbox";
import TextArea from "&components/TextArea";
import ImageUpload from "&components/ImageUpload";

// Utils
import urls from "&utils/urls";
import { useSession } from "&utils/auth-utils";
import { createIssue } from "&actions/IssueActions";
import { IssueType } from "&server/models/IssueType";
import { getLocalItem } from "&utils/local-storage-utils";
import { UploadedFile } from "&server/utils/ImageUpload";
import { getApplications } from "&actions/ApplicationActions";

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
  const [images, setImages] = useState<UploadedFile[]>([]);

  useEffect(() => {
    setIssueType((initialValue) =>
      getLocalItem("report-issueType", initialValue)
    );
    setIssuePassage((initialValue) =>
      getLocalItem("report-issuePassage", initialValue)
    );
    setContactName((initialValue) =>
      getLocalItem("report-contactName", initialValue)
    );
    setPhone((initialValue) => getLocalItem("report-phone", initialValue));
    setOrgPhone((initialValue) =>
      getLocalItem("report-orgPhone", initialValue)
    );
    setImages((initialValue) => getLocalItem("report-images", initialValue));
  }, []);

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

  const submit = async () => {
    if (issuePassage === "" || contactName === "") {
      await Swal.fire({
        title: "Error",
        text: "Please provide all required fields!",
        icon: "error",
      });
      return;
    }

    try {
      localStorage.removeItem("report-issueType");
      localStorage.removeItem("report-issuePassage");
      localStorage.removeItem("report-contactName");
      localStorage.removeItem("report-phone");
      localStorage.removeItem("report-orgPhone");
      localStorage.removeItem("report-images");

      const typeNames = [];
      if (issueType[0]) typeNames.push(IssueType.NOT_LOADING);
      if (issueType[1]) typeNames.push(IssueType.DATA_MISSING);
      const result = await createIssue({
        product: (await getApplications())[0].id, // This is a quick patch. The application id should be in the route or selected as a field
        issueType: typeNames,
        description: issuePassage,
        images: images.map((image) => image.blobName),
        contact: {
          name: contactName,
          primaryPhone: phone,
          organizationPhone: orgPhone,
        },
        user: session.user.id,
      });

      if (result == null || result.id == null) {
        throw new Error("Failed to create report!");
      }

      await Swal.fire({
        title: "Success",
        text: "Successfully submitted report!",
        icon: "success",
      });

      await router.push(urls.pages.app.report.landing);
    } catch (error) {
      console.log("Error", error);

      await Swal.fire({
        title: "Error",
        text: "Failed to submit application, please try again later!",
        icon: "error",
      });
    }
  };

  const saveForLater = async () => {
    try {
      localStorage.setItem("report-issueType", JSON.stringify(issueType));
      localStorage.setItem("report-issuePassage", issuePassage);
      localStorage.setItem("report-contactName", contactName);
      localStorage.setItem("report-phone", phone);
      localStorage.setItem("report-orgPhone", orgPhone);
      localStorage.setItem("report-images", JSON.stringify(images));

      await Swal.fire({
        title: "Saved",
        text: "Successfully saved report!",
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
          <h1 className="formTitle"> Report a Problem </h1>
          <h5 className="formDescription">
            Experiencing issues with your current Bits of Good product? Are
            loading times too long, or are your users facing bugs? Let us know,
            and we will contact you soon with an estimated timeline for a fix.
          </h5>
        </div>

        <div className="padding" />

        <div className="rightCol">
          <h2 className="sectionHeader"> General Issue</h2>

          <h5>
            Issue Type
            <span className="inline"> (select all that apply) </span>
          </h5>
          <div className="checkboxContainer">
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

          <h5>What is the issue?</h5>
          <TextArea
            rows={4}
            value={issuePassage}
            placeholder={placeHolder}
            onChange={(event) => setIssuePassage(event.target.value)}
          />

          <h5>
            Screenshot
            <span className="inline"> (optional) </span>
          </h5>
          <ImageUpload setImages={setImages} images={images} />

          <h2 className="sectionHeader">Contact Information</h2>

          <h5> Primary Contact </h5>
          <Input
            value={contactName}
            placeholder="Riley Smith"
            onChange={(event) => setContactName(event.target.value)}
          />

          <h5>
            Organization Phone Number
            <span className="inline"> optional </span>
          </h5>
          <Input
            type="number"
            value={orgPhone}
            placeholder="(414) 555-0161"
            onChange={(event) => setOrgPhone(event.target.value)}
          />

          <h5>
            Primary Contact Phone Number
            <span className="inline"> optional </span>
          </h5>
          <Input
            type="number"
            value={phone}
            placeholder="(414) 555-0161"
            onChange={(event) => setPhone(event.target.value)}
          />

          <div className="buttonContainer">
            <Button variant="secondary" onClick={saveForLater}>
              <h3>Save For Later</h3>
            </Button>

            <Button className="secondButton" variant="primary" onClick={submit}>
              <h3>Submit</h3>
            </Button>
          </div>
        </div>

        <div className="sidePadding" />
      </div>
    </div>
  );
};

export default ReportScreen;

ReportScreen.showSidebar = true;
ReportScreen.isLanding = false;
