import React from "react";
import { helloWorld } from "../../actions/General";
import classes from "./IndexPage.module.scss";
import Button from "../../components/Button/Button";
import Checkbox from "../../components/Checkbox/Checkbox";
import Input from "../../components/Input/input";
import TextArea from "../../components/TextArea/TextArea";

const IndexPage: React.FC = () => {
  const [payload, setPayload] = React.useState("");

  React.useEffect(() => {
    // Example how to create page without ssr
    helloWorld()
      .then((resp) => {
        setPayload(resp.message as string);
      })
      .catch(() => {
        setPayload("Failed to fetch!");
      });
  }, []);

  return (
    <>
      <h2 className={classes.centerText}>Welcome to Next.js!</h2>
      <h3>
        This page is static rendered, because all API calls are made in
        useEffect
      </h3>
      <h4>CSR Message: {payload}</h4>
      <p>You can tell because the text above flashes on page refresh</p>
      <Button>Apply Now</Button>
      <Checkbox
      checked={false}
      label={"Hello"}
      />
      <Input error = {true}/>
      <TextArea error = {true}/>
    </>
  );
};

export default IndexPage;
