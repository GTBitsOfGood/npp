import React, { ComponentProps } from "react";

// Libraries
import clsx from "clsx";

// Styling
import styling from "./Select.module.scss";

interface SelectProps extends ComponentProps<"select"> {
  error?: boolean;
}
const Select = ({ error, required = true, ...rest }: SelectProps) => (
  <select
    required={required}
    className={clsx(styling.input, error && styling.disableInput)}
    {...rest}
  />
);

export default Select;
