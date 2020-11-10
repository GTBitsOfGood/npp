import React, { useState } from "react";
import { useSession } from "next-auth/client";

// Iconography
import { Icon } from "@iconify/react";
import caretDown from "@iconify/icons-radix-icons/caret-down";

// Styling
import classes from "./UserIcon.module.scss";

// Actions
import { login, logout } from "&actions/UserActions";

interface PropTypes {
  containerMouse: boolean;
}

const UserIcon = ({ containerMouse }: PropTypes) => {
  const [session, loading] = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  React.useEffect(() => {
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

  return (
    <div className={classes.root}>
      <div className={classes.user}>
        <div
          className={classes.topRow}
          onMouseOver={() => setMenuOpen(true)}
          onFocus={() => setMenuOpen(true)}
          onClick={() => setMenuOpen((prevState) => !prevState)}
          onKeyPress={() => setMenuOpen((prevState) => !prevState)}
          role="menu"
          tabIndex={0}
        >
          <h3>{session.user.name}</h3>
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
        <h5 className={classes.role}>Verification Needed</h5>
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
