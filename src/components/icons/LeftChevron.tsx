import React from "react";

import { DisabledProps } from "&icons/IconTypes";

const LeftChevron = ({ disabled }: DisabledProps) => (
  <svg
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={disabled ? "#d2d2d2" : "#666666"}
      d="M7.5 12L15 4.5L16.05 5.55L9.6 12L16.05 18.45L15 19.5L7.5 12Z"
    />
  </svg>
);

export default LeftChevron;
