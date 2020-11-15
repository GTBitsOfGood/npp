import React, { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import Link, { LinkProps } from "next/link";

// Styling
import classes from "../Button/Button.module.scss";

interface ButtonLinkProps extends LinkProps {
  variant: "primary" | "secondary";
  linkProps?: ComponentProps<"a">;
  children?: ReactNode;
}

const ButtonLink = ({
  href,
  children,
  variant,
  linkProps,
  ...rest
}: ButtonLinkProps) => (
  <Link href={href} {...rest}>
    <a
      className={clsx(
        classes.root,
        variant === "primary" && classes.primary,
        variant === "secondary" && classes.secondary,
        linkProps?.className
      )}
      {...linkProps}
    >
      {children}
    </a>
  </Link>
);

export default ButtonLink;
