import React from "react";
import clsx from "clsx";
import styling from "./TextArea.module.scss";

interface PropTypes extends React.ComponentProps<"textarea"> {
  error?: boolean;
  className?: string;
}

const TextArea: React.FC<PropTypes> = ({
  children,
  error,
  className,
  ...rest
}: PropTypes) => (
  <textarea
    className={clsx(className, styling.ta, error && styling.disableInput)}
    {...rest}
  >
    {children}
  </textarea>
);

export default TextArea;
