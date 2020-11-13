import * as React from "react";

const LeftWave = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 1086 146"
    fillRule="evenodd"
    clipRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit={2}
    preserveAspectRatio="none"
    {...props}
  >
    <path
      d="M0 19c55.667 40.333 198.2 127 425 127H0V19zM1086.72 0v146H425C708.5 146 824 0 1086.5 0h.22z"
      fill="#fff"
    />
  </svg>
);

export default LeftWave;
