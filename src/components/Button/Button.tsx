import React from "react";
import classes from "./Button.module.scss";

interface PropTypes extends React.HTMLProps<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "default";
}

const Button = ({ children, variant, ...rest }: PropTypes) => (
  <button className={classes.container}>{children}</button>
);
export default Button;
