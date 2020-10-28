import React, { ComponentProps } from "react";

// Libraries
import clsx from "clsx";

// Stying
import classes from "./TextArea.module.scss";

interface TextAreaProps extends ComponentProps<"textarea"> {
  error?: boolean;
}

const TextArea = ({ error, ...rest }: TextAreaProps) => (
  <textarea
    className={clsx(classes.textArea, error && classes.disableInput)}
    {...rest}
  />
);

export default TextArea;
