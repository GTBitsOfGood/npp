import React from "react";

// Components
import NavLink from "../NavLink";
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
        <NavLink href="/" key="Logo">
          <img
            alt="Bits of Good Logo"
            src="/static/text-logo.png"
            className={classes.headerImg}
          />
        </NavLink>

        <UserIcon containerMouse={mouseIn} />
      </div>

      <div className={classes.sidePadding} />
    </div>
  );
};

export default Header;
