import React from "react";
import clsx from "clsx";
import classes from "./Checkbox.module.scss";

interface PropTypes extends React.ComponentProps<"div"> {
  checked: boolean;
  label: string;
}

const Checkbox: React.FC<PropTypes> = ({
  checked,
  label,
  ...rest
}: PropTypes) => (
  <div
    className={clsx(classes.container, checked && classes.checked)}
    {...rest}
  >
    <div className={classes.checkbox}>{checked ? "✓" : ""}</div>
    <p>{label}</p>
  </div>
);

export default Checkbox;
