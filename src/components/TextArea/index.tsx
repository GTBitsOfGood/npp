import React, { ComponentProps } from "react";

// Libraries
import clsx from "clsx";

// Stying
import styling from "./TextArea.module.scss";

interface TextAreaProps extends ComponentProps<"textarea"> {
  error?: boolean;
}

const TextArea = ({ error, onChange, ...rest }: TextAreaProps) => (
  <textarea
    className={clsx(styling.ta, error && styling.disableInput)}
    {...rest}
  />
);

export default TextArea;
