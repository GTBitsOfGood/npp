import React, { ComponentProps } from "react";
import clsx from "clsx";
import classes from "./Button.module.scss";

interface ButtonProps extends ComponentProps<"button"> {
  variant: "primary" | "secondary";
  className?: string;
}

const Button = ({ children, variant, className, ...rest }: ButtonProps) => (
  <button
    className={clsx(
      classes.root,
      classes.primary,
      variant === "secondary" && classes.secondary,
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
