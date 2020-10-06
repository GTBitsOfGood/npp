import React from "react";
import clsx from "clsx";
import classes from "./Form.module.scss";

interface PropTypes extends React.ComponentProps<"form"> {
  
}

const Form: React.FC<PropTypes> = ({
  ...rest
}: PropTypes) => (
  <div className={classes.container}>

  </div>
);

export default Form;
