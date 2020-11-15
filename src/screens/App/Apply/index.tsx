import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

// Components
import Input from "&components/Input";
import Button from "&components/Button";
import Checkbox from "&components/Checkbox";
import TextArea from "&components/TextArea";

// Utils
import { createApplication } from "&actions/ApplicationActions";
import { ProductType } from "&server/models/ProductType";
import { useSession } from "&utils/auth-utils";

// Utils
import urls from "&utils/urls";

const descriptionPlaceholder =
  "Enter a brief description of the type of product you are looking for. It’s okay if you aren’t entirely sure, but this could give us a couple of ideas to discuss with you during our first meeting.";

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

const ApplyScreen = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  const [productType, setProductType] = useState([false, false]);
  const [lookingFor, setLookingFor] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [orgPhone, setOrgPhone] = useState("");

  useEffect(() => {
    setProductType((initialValue) =>
      getLocalItem("app-productType", initialValue)
    );
    setLookingFor((initialValue) =>
      getLocalItem("app-lookingFor", initialValue)
    );
    setContactName((initialValue) =>
      getLocalItem("app-contactName", initialValue)
    );
    setContactEmail((initialValue) =>
      getLocalItem("app-contactEmail", initialValue)
    );
    setContactPhone((initialValue) =>
      getLocalItem("app-contactPhone", initialValue)
    );
    setOrgPhone((initialValue) => getLocalItem("app-orgPhone", initialValue));
  }, []);

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [loading, session]);

  const checkProductType = (index: number) => {
    const tempProductType = [...productType];
    tempProductType[index] = !tempProductType[index];
    setProductType(tempProductType);
  };

  const submit = async () => {
    if (lookingFor === "" || contactName === "" || contactEmail === "") {
      await Swal.fire({
        title: "Error",
        text: "Please provide all required fields!",
        icon: "error",
      });
      return;
    }

    try {
      const typeNames = [];
      if (productType[0]) typeNames.push(ProductType.WEBSITE);
      if (productType[1]) typeNames.push(ProductType.MOBILE_APP);

      const result = await createApplication({
        productType: typeNames,
        description: lookingFor,
        primaryContact: {
          name: contactName,
          email: contactEmail,
          organizationPhone: orgPhone,
          primaryPhone: contactPhone,
        },
      });

      if (result == null || result.id == null) {
        throw new Error("Failed to submit application!");
      }

      localStorage.removeItem("app-productType");
      localStorage.removeItem("app-lookingFor");
      localStorage.removeItem("app-contactName");
      localStorage.removeItem("app-contactEmail");
      localStorage.removeItem("app-contactPhone");
      localStorage.removeItem("app-orgPhone");

      await Swal.fire({
        title: "Success",
        text: "Successfully submitted application!",
        icon: "success",
      });

      await router.replace(urls.pages.app.application.submitted(result.id!));
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
      localStorage.setItem("app-productType", JSON.stringify(productType));
      localStorage.setItem("app-lookingFor", lookingFor);
      localStorage.setItem("app-contactName", contactName);
      localStorage.setItem("app-contactEmail", contactEmail);
      localStorage.setItem("app-contactPhone", contactPhone);
      localStorage.setItem("app-orgPhone", orgPhone);

      await Swal.fire({
        title: "Saved",
        text: "Successfully saved application!",
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
          <h1 className="formTitle">Sign up for a Project</h1>
          <h5 className="formDescription">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud commodo consequat.
          </h5>
        </div>

        <div className="padding" />

        <div className="rightCol">
          <h2 className="sectionHeader">Product Needs</h2>

          <h5>
            Product Type
            <span className="inline"> (select all that apply)</span>
          </h5>
          <div className="checkboxContainer">
            <Checkbox
              label="Website"
              checked={productType[0]}
              onClick={() => checkProductType(0)}
            />
            <Checkbox
              label="Mobile App"
              checked={productType[1]}
              onClick={() => checkProductType(1)}
            />
          </div>

          <h5>What You Are Looking For</h5>
          <TextArea
            rows={4}
            value={lookingFor}
            placeholder={descriptionPlaceholder}
            onChange={(event) => setLookingFor(event.target.value)}
          />

          <h2 className="sectionHeader">Contact Information</h2>

          <h5>Primary Contact</h5>
          <Input
            value={contactName}
            placeholder="Emily Wilson"
            onChange={(event) => setContactName(event.target.value)}
          />

          <h5>Email</h5>
          <Input
            type="email"
            value={contactEmail}
            placeholder="hello@bitsofgood.org"
            onChange={(event) => setContactEmail(event.target.value)}
          />

          <h5>
            Organization Phone Number
            <span className="inline"> optional</span>
          </h5>
          <Input
            type="number"
            value={orgPhone}
            placeholder="(414) 555-0161"
            onChange={(event) => setOrgPhone(event.target.value)}
          />

          <h5>
            Primary Contact Phone Number
            <span className="inline"> optional</span>
          </h5>
          <Input
            type="number"
            value={contactPhone}
            placeholder="(414) 555-0161"
            onChange={(event) => setContactPhone(event.target.value)}
          />

          <div className="buttonContainer">
            <Button variant="secondary" onClick={saveForLater}>
              <h3>Save for Later</h3>
            </Button>

            <Button className="secondButton" variant="primary" onClick={submit}>
              <h3>Apply</h3>
            </Button>
          </div>
        </div>

        <div className="sidePadding" />
      </div>
    </div>
  );
};

export default ApplyScreen;
