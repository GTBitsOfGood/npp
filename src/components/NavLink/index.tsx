import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import isString from "lodash/isString";
import isObject from "lodash/isPlainObject";

interface PropTypes {
  href: string;
  hrefParts?: Record<string, string>;
  className?: string;
}

const NavLink: React.FC<PropTypes> = ({
  href,
  hrefParts = {},
  className,
  children,
  ...rest
}) => {
  const optionalProps = {};

  if (hrefParts != null && isObject(hrefParts)) {
    let as = href;

    Object.keys(hrefParts).forEach((key) => {
      as = as.replace(`[${key}]`, hrefParts[key]);
    });

    // @ts-ignore Conditionally add this prop for destructuring
    optionalProps.as = as;
  }

  return (
    <Link
      href={href}
      passHref={children != null && !isString(children)}
      {...optionalProps}
      {...rest}
    >
      {isString(children) ? <a className={className}>{children}</a> : children}
    </Link>
  );
};

export default NavLink;
