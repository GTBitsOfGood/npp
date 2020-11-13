import React, { ComponentProps } from "react";

// Libraries
import clsx from "clsx";

// Iconography
import CheckMark from "&icons/CheckMark";

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
    <div className={classes.checkbox}>{checked ? <CheckMark /> : ""}</div>
    <h3>{label}</h3>
  </div>
);

export default Checkbox;
