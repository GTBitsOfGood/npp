import React from "react";
import clsx from "clsx";
import classes from "./Button.module.scss";

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "default";
}

const Button = ({ children, variant, ...rest }: ButtonProps) => (
  <button
    className={clsx(
      classes.container,
      variant === "secondary" && classes.secondaryContainer
    )}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
