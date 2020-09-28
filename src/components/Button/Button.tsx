import React from "react";
import clsx from "clsx";
import classes from "./Button.module.scss";
interface PropTypes extends React.ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "default";
}
const Button: React.FC<PropTypes> = ({
  children,
  variant,
  ...rest
}: PropTypes) => (
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