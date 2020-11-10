import urls from "&utils/urls";
import React from "react";

// Libraries
import clsx from "clsx";

// Components
import NavLink from "../NavLink";

// Styling
import classes from "./Sidebar.module.scss";

interface HeaderProps {
  currentRoute: string;
}

const Sidebar = ({ currentRoute }: HeaderProps) => {
  const app = urls.pages.app.project;
  const problem = urls.pages.index;

  return (
    <div className={classes.root}>
      <h3>MENU</h3>
      <NavLink
        href={app}
        className={clsx(classes.pages, currentRoute === app && classes.active)}
      >
        Project Application
      </NavLink>

      <div
        className={clsx(
          classes.pages,
          currentRoute === app && classes.rectangle
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
