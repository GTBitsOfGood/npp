import React, { useState } from "react";

// Libraries
import clsx from "clsx";

// Components
import Link from "next/link";

// Iconography
import MenuIcon from "&icons/MenuIcon";

// Styling
import classes from "./Sidebar.module.scss";

// Utils
import urls from "&utils/urls";
import CloseIcon from "&icons/CloseIcon";

interface HeaderProps {
  currentRoute: string;
  isLanding: boolean;
  isAdmin: boolean;
}

const Sidebar = ({ currentRoute, isLanding, isAdmin }: HeaderProps) => {
  const [drawerOpen, toggleDrawerOpen] = useState(false);

  const links = (
    <>
      {isAdmin && (
        <Link href={urls.pages.app.admin.verification} passHref>
          <a className={clsx(classes.page, isLanding && classes.active)}>
            <h3 className={clsx(isLanding && classes.active)}>Verification</h3>
            {isLanding && <span className={classes.rectangle} />}
          </a>
        </Link>
      )}
      <Link
        href={isAdmin ? urls.pages.app.admin.landing : urls.pages.app.index}
        passHref
      >
        <a className={clsx(classes.page, isLanding && classes.active)}>
          <h3 className={clsx(isLanding && classes.active)}>
            Project Application
          </h3>
          {isLanding && <span className={classes.rectangle} />}
        </a>
      </Link>

      <Link
        href={
          isAdmin
            ? urls.pages.app.admin.maintenance
            : urls.pages.app.report.landing
        }
        passHref
      >
        <a
          className={clsx(
            classes.page,
            currentRoute === urls.pages.app.report.landing && classes.active
          )}
        >
          <h3
            className={clsx(
              currentRoute === urls.pages.app.report.landing && classes.active
            )}
          >
            {isAdmin ? "Maintenance" : "Maintenance History"}
          </h3>
          {currentRoute === urls.pages.app.report.landing && (
            <span className={classes.rectangle} />
          )}
        </a>
      </Link>
    </>
  );

  return (
    <div>
      <div className={classes.root}>
        <h3>MENU</h3>
        {links}
      </div>

      {drawerOpen ? (
        <div className={classes.root2}>
          <div className={classes.menuHeader}>
            <h3>MENU</h3>
            <div
              tabIndex={0}
              role="button"
              onClick={() => toggleDrawerOpen(false)}
              onKeyDown={() => toggleDrawerOpen(false)}
            >
              <CloseIcon />
            </div>
          </div>
          {links}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          className={classes.mobileView}
          onClick={() => toggleDrawerOpen(true)}
          onKeyDown={() => toggleDrawerOpen(true)}
        >
          <MenuIcon />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
