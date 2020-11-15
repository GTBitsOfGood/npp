import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";

// Iconography
import { Icon } from "@iconify/react";
import caretDown from "@iconify/icons-radix-icons/caret-down";

// Styling
import classes from "./UserIcon.module.scss";

// Actions
import { login, logout } from "&actions/UserActions";
import { User } from "&server/models";

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
      <button className={classes.loginButton} onClick={login}>
        <h3>Sign In</h3>
      </button>
    );
  }

  const user = session.user as User & { isAdmin: boolean };

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

        {!user.organizationVerified && !user.isAdmin ? (
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
