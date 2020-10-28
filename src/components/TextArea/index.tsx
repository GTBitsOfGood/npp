import React from "react";
import clsx from "clsx";
import styling from "./TextArea.module.scss";

interface TextAreaProps extends React.ComponentProps<"textarea"> {
  error?: boolean;
  className?: string;
}

const TextArea = ({ error, className, ...rest }: TextAreaProps) => (
  <textarea
    className={clsx(className, styling.ta, error && styling.disableInput)}
    {...rest}
  />
);

export default TextArea;
