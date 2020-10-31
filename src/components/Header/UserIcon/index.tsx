import React, { useState } from "react";
import { useSession } from "next-auth/client";

// Iconography
import { Icon } from "@iconify/react";
import caretDown from "@iconify/icons-radix-icons/caret-down";

// Styling
import classes from "./UserIcon.module.scss";

// Actions
import { login, logout } from "&actions/UserActions";

const UserIcon = () => {
  const [session, loading] = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

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
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <h3>{session.user.name}</h3>
          <Icon icon={caretDown} />
        </div>
        <h5 className={classes.role}>Verification Needed</h5>
      </div>
      <img src={session.user.image} className={classes.userImg} />

      {menuOpen && (
        <div className={classes.menu} onMouseLeave={() => setMenuOpen(false)}>
          <button className={classes.logoutButton} onClick={logout}>
            <h3>Log Out</h3>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserIcon;
