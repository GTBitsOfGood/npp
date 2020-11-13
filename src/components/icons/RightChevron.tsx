import React from "react";

import { DisabledProps } from "&icons/IconTypes";

const RightChevron = ({ disabled }: DisabledProps) => (
  <svg
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={disabled ? "#d2d2d2" : "#666666"}
      d="M16.5002 12L9.00019 19.5L7.9502 18.45L14.4002 12L7.9502 5.55L9.00019 4.5L16.5002 12Z"
    />
  </svg>
);

export default RightChevron;
