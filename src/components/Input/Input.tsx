import React from "react";
import clsx from "clsx";
import styling from "./Input.module.scss";

interface PropTypes extends React.ComponentProps<"input"> {
  error?: boolean;
  className?: string;
}

const Input: React.FC<PropTypes> = ({
  children,
  error,
  className,
  ...rest
}: PropTypes) => (
  <input
    className={clsx(className, styling.input, error && styling.disableInput)}
    {...rest}
  >
    {children}
  </input>
);

export default Input;