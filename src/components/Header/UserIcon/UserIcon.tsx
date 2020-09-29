import React from "react";
import { login, logout } from "../../../actions/User";
import { useSession } from "next-auth/client";
import classes from "./UserIcon.module.scss";
import { Icon, InlineIcon } from "@iconify/react";
import caretDownFilled from "@iconify/icons-ant-design/caret-down-filled";

const UserIcon: React.FC = () => {
  const [session, loading] = useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const openMenu = () => setMenuOpen(true);

  const closeMenu = () => setMenuOpen(false);

  if (loading) {
    return null;
  } else if (!session) {
    return (
      <button className={classes.loginButton} onClick={login}>
        Sign in
      </button>
    );
  }

  return (
    <div className={classes.root} onMouseEnter={openMenu}>
      <div className={classes.user}>
        {session.user.name}
        <div className={classes.role}>Non-Profit</div>
      </div>
      <Icon icon={caretDownFilled} />
        <img src={session.user.image} className={classes.userImg} />
      {menuOpen && (
        <div className={classes.menu} onMouseLeave={closeMenu}>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserIcon;
