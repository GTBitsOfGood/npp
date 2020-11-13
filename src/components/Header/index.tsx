import React from "react";
import Link from "next/link";

// Components
import UserIcon from "./UserIcon";

// Styling
import classes from "./Header.module.scss";

const Header = () => {
  const [mouseIn, setMouseIn] = React.useState<boolean>(false);

  return (
    <div
      className={classes.root}
      onMouseEnter={() => setMouseIn(true)}
      onMouseLeave={() => setMouseIn(false)}
    >
      <div className={classes.sidePadding} />

      <div className={classes.mainContent}>
        <Link href="/" passHref>
          <a className={classes.headerImg}>
            <img alt="Bits of Good Logo" src="/static/text-logo.png" />
          </a>
        </Link>

        <UserIcon containerMouse={mouseIn} />
      </div>

      <div className={classes.sidePadding} />
    </div>
  );
};

export default Header;
