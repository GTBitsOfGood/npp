import React from "react";
import clsx from "clsx";
import { useSession } from "next-auth/client";
import NavLink from "../NavLink";
import UserIcon from "./UserIcon/UserIcon";
import { homeRoutes, authRoutes } from "./routes";
import classes from "./Header.module.scss";

interface PropTypes {
  currentRoute: string;
}

const Header: React.FC<PropTypes> = ({ currentRoute }) => {
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
      <NavLink href="/" key="Logo">
        <img src="/static/text-logo.png" className={classes.headerImg} />
      </NavLink>
      {routes.map(({ name, link }) => (
        <NavLink href={link} key={name}>
          <div
            className={clsx(
              classes.route,
              currentRoute === link && classes.selected
            )}
          >
            {name}
          </div>
        </NavLink>
      ))}
      {!loading && <UserIcon />}
    </div>
  );
};

export default Header;
