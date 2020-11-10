import React from "react";

// Authentication
import { useSession } from "next-auth/client";

// Components
import NavLink from "../NavLink";
import UserIcon from "./UserIcon";

// Styling
import classes from "./Header.module.scss";

const Header = () => {
  const [loading] = useSession();

  return (
    <div className={classes.root}>
      <div className={classes.sidePadding} />

      <div className={classes.mainContent}>
        <NavLink href="/" key="Logo">
          <img
            alt="Bits of Good Logo"
            src="/static/text-logo.png"
            className={classes.headerImg}
          />
        </NavLink>

        {!loading && <UserIcon />}
      </div>

      <div className={classes.sidePadding} />
    </div>
  );
};

export default Header;
