import React from "react";
import clsx from "clsx";
import styling from "./TextArea.module.scss";


interface PropTypes extends React.HTMLProps<HTMLTextAreaElement> {
  error?: boolean;
  errorMessage?: string;
}

const TextArea = ({children, error, errorMessage, ...rest}: PropTypes) => (
  <textarea
    className={styling.ta}
    {...rest}
  >
    {(children = error ? (errorMessage = "Form input missing!") : "")}
  </textarea>
);

export default TextArea;