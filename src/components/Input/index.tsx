import React from "react";
import clsx from "clsx";
import styling from "./Input.module.scss";

interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
  className?: string;
}

const Input = ({ children, error, className, ...rest }: InputProps) => (
  <input
    className={clsx(className, styling.input, error && styling.disableInput)}
    {...rest}
  >
    {children}
  </input>
);

export default Input;
