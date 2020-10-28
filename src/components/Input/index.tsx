import React, { ComponentProps } from "react";

// Libraries
import clsx from "clsx";

// Styling
import styling from "./Input.module.scss";

interface InputProps extends ComponentProps<"input"> {
  error?: boolean;
}

const Input = ({ error, ...rest }: InputProps) => (
  <input
    className={clsx(styling.input, error && styling.disableInput)}
    {...rest}
  />
);

export default Input;
