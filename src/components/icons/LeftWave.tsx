import React, { SVGProps } from "react";

const LeftWave = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fillRule="evenodd"
    clipRule="evenodd"
    strokeMiterlimit={2}
    strokeLinejoin="round"
    viewBox="0 0 1086 146"
    preserveAspectRatio="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M0 19c55.667 40.333 198.2 127 425 127H0V19zM1086.72 0v146H425C708.5 146 824 0 1086.5 0h.22z"
    />
  </svg>
);

export default LeftWave;
