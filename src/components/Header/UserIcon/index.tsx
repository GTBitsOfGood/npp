import React, { useEffect, useState } from "react";

// Components
import Button from "&components/Button";

// Iconography
import { Icon } from "@iconify/react";
import caretDown from "@iconify/icons-radix-icons/caret-down";

// Styling
import classes from "./UserIcon.module.scss";

// Actions
import { login, logout } from "&actions/UserActions";

import { OrganizationStatus } from "&server/models/OrganizationStatus";
import { useSession } from "&utils/auth-utils";

interface UserIconProps {
  containerMouse: boolean;
}

const UserIcon = ({ containerMouse }: UserIconProps) => {
  const [session, loading] = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen((prevOpen) => prevOpen && containerMouse);
  }, [containerMouse]);

  if (loading) {
    return null;
  } else if (!session) {
    return (
      <Button variant="primary" className={classes.loginButton} onClick={login}>
        <h3>Log In</h3>
      </Button>
    );
  }

  const user = session.user;

  return (
    <div className={classes.root}>
      <div className={classes.user}>
        <div
          role="menu"
          tabIndex={0}
          className={classes.topRow}
          onFocus={() => setMenuOpen(true)}
          onMouseOver={() => setMenuOpen(true)}
          onClick={() => setMenuOpen((prevState) => !prevState)}
          onKeyPress={() => setMenuOpen((prevState) => !prevState)}
        >
          <h3>{user.name}</h3>

          <Icon icon={caretDown} />
          {menuOpen && (
            <div
              className={classes.menu}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button className={classes.logoutButton} onClick={logout}>
                <h3>Log Out</h3>
              </button>
            </div>
          )}
        </div>

        {user.orgStatus !== OrganizationStatus.Verified && !user.isAdmin ? (
          <h5 className={classes.role}>Verification Needed</h5>
        ) : (
          <h5 className={classes.role}>
            {user.isAdmin ? "Admin" : "Nonprofit"}
          </h5>
        )}
      </div>

      <img
        alt="Current User"
        src={session.user.image}
        className={classes.userImg}
      />
    </div>
  );
};

export default UserIcon;
