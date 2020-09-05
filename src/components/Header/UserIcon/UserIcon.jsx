import React from "react";
import PropTypes from "prop-types";
import { login, logout } from "../../../actions/User";
import styles from "./UserIcon.module.scss";

const UserIcon = ({ session }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const openMenu = () => setMenuOpen(true);

  const closeMenu = () => setMenuOpen(false);

  if (!session) {
    return (
      <button className={styles.loginButton} onClick={login}>
        Sign in
      </button>
    );
  }

  return (
    <div
      className={styles.root}
      style={{
        backgroundImage: `url("${session.user.image}")`,
      }}
      onMouseEnter={openMenu}
    >
      {menuOpen && (
        <div className={styles.menu} onMouseLeave={closeMenu}>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

UserIcon.propTypes = {
  session: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      image: PropTypes.string,
    }).isRequired,
  }),
};

UserIcon.defaultProps = {
  session: null,
};

export default UserIcon;
