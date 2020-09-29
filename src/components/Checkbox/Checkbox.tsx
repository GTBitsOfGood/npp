import React from "react";
import classes from "./Checkbox.module.scss";

interface PropTypes {
  checked: boolean;
  label: string;
}

const Checkbox = ({ checked, label, ...rest }: PropTypes) => (
  <div className={classes.container} {...rest}>
    <div className={classes.checkbox}>{checked ? "✓" : ""}</div>
    <p>{label}</p>
  </div>
);
export default Checkbox;
