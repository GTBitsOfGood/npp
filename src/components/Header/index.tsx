import React from "react";

// Libraries
import clsx from "clsx";

// Authentication
import { useSession } from "next-auth/client";

// Routes
import { homeRoutes, authRoutes } from "./routes";

// Components
import NavLink from "../NavLink";
import UserIcon from "./UserIcon";

// Styling
import classes from "./Header.module.scss";

interface HeaderProps {
  currentRoute: string;
}

const Header = ({ currentRoute }: HeaderProps) => {
  const [session, loading] = useSession();

  const routes = [];
  if (currentRoute.startsWith("/app")) {
    routes.push(homeRoutes[0]);
  } else {
    routes.push(...homeRoutes);
  }

  if (!loading && session) {
    routes.push(...authRoutes);
  }

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

        {routes.map(({ name, link }) => (
          <NavLink href={link} key={name}>
            <div
              className={clsx(
                classes.route,
                currentRoute === link && classes.selected
              )}
            >
              <h3>{name}</h3>
            </div>
          </NavLink>
        ))}

        {!loading && <UserIcon />}
      </div>

      <div className={classes.sidePadding} />
    </div>
  );
};

export default Header;
