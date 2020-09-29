import React from "react";
import clsx from "clsx";
import styling from "./Input.module.scss";


interface PropTypes extends React.HTMLProps<HTMLInputElement> {
  error?: boolean;
}

const Input = ({ children, error, ...rest }: PropTypes) => (
  <input
    className={clsx(styling.input, error && styling.disableInput)}
    {...rest}
  >
    {children}
  </input>
);

export default Input;