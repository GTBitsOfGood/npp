import React from "react";
import clsx from "clsx";
import classes from "./Checkbox.module.scss";

interface CheckboxProps extends React.ComponentProps<"div"> {
  label: string;
  checked: boolean;
}

const Checkbox = ({ checked, label, ...rest }: CheckboxProps) => (
  <div
    className={clsx(classes.container, checked && classes.checked)}
    {...rest}
  >
    <div className={classes.checkbox}>{checked ? "✓" : ""}</div>
    <p>{label}</p>
  </div>
);

export default Checkbox;
