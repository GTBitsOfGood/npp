import React, { useState } from "react";
// import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Input from "&components/Input";
import Button from "&components/Button";
import TextArea from "&components/TextArea";

// Styling
import classes from "./ApplyScreen.module.scss";

/* Questions:
1. How to do a drop down box?
*/

const missionPlaceholder =
  "At Bits of Good, our mission is to change lives one bit at a time - we serve our community by building powerful applications for local nonprofits.";

const VerificationScreen = () => {
  const [loading] = useSession();

  const [orgName, setOrgName] = useState("");
  const [einNumber, setEINNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [streetAddress, setStreesAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");

  const submit = () => {
    console.log(
      orgName,
      einNumber,
      website,
      streetAddress,
      city,
      state,
      zipcode
    );
  };
};
