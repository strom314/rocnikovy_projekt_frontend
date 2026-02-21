import { useAuth } from "../context/AuthContext";
import styles from "./header.module.css";

function Header() {
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <div className={styles.header}>
      <h1 className={styles.appTitle}>Stromus chatus</h1>
      <div className={styles.userContainer}>
        <p className={styles.username}>{user.username}</p>
        <p>picture</p>
        <button className={styles.logoutButton} onClick={handleLogout}>
          log out
        </button>
      </div>
    </div>
  );
}

export default Header;
