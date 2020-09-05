import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useSession } from "next-auth/client";
import NavLink from "../NavLink";
import UserIcon from "./UserIcon/UserIcon";
import { homeRoutes, authRoutes } from "./routes";
import styles from "./Header.module.scss";

const Header = ({ currentRoute }) => {
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
    <div className={styles.root}>
      {routes.map(({ name, link }) => (
        <NavLink href={link} key={name}>
          <div
            className={clsx(
              styles.route,
              currentRoute === link && styles.selected
            )}
          >
            {name}
          </div>
        </NavLink>
      ))}
      {!loading && <UserIcon session={session} />}
    </div>
  );
};

Header.propTypes = {
  currentRoute: PropTypes.string.isRequired,
};

export default Header;
