import React from "react";

// Libraries
import clsx from "clsx";

// Components
import NavLink from "../NavLink";

// Styling
import classes from "./Sidebar.module.scss";

// Utils
import urls, { landingUrls } from "&utils/urls";

interface HeaderProps {
  currentRoute: string;
}

const Sidebar = ({ currentRoute }: HeaderProps) => {
  const problem = urls.pages.index;

  return (
    <div className={classes.root}>
      <h3>MENU</h3>
      <NavLink
        href={urls.pages.app.project}
        className={clsx(
          classes.pages,
          landingUrls.includes(currentRoute) && classes.active
        )}
      >
        Project Application
      </NavLink>

      <div
        className={clsx(
          classes.pages,
          landingUrls.includes(currentRoute) && classes.rectangle
        )}
      />

      <NavLink
        href={problem}
        className={clsx(
          classes.pages,
          currentRoute === problem && classes.active
        )}
      >
        Report a Problem
      </NavLink>

      <div
        className={clsx(
          classes.pages,
          currentRoute === problem && classes.rectangle
        )}
      />
    </div>
  );
};

export default Sidebar;
