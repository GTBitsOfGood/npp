import React, { ReactNode } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import isString from "lodash/isString";
import isObject from "lodash/isPlainObject";

interface NavLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  hrefParts?: Record<string, string>;
}

const NavLink = ({
  href,
  children,
  className,
  hrefParts = {},
  ...rest
}: NavLinkProps) => {
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
