import React, { ComponentProps } from "react";

// Libraries
import clsx from "clsx";

// Styling
import classes from "./Checkbox.module.scss";

interface CheckboxProps extends ComponentProps<"div"> {
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
