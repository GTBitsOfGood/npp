import React, { SVGProps } from "react";

const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="#333"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.6739 12L3.83691 18.837L5.16291 20.163L11.9999 13.326L18.8369 20.163L20.1629 18.837L13.3259 12L20.1629 5.16301L18.8369 3.83701L11.9999 10.674L5.16291 3.83701L3.83691 5.16301L10.6739 12Z"
    />
  </svg>
);

export default CloseIcon;
