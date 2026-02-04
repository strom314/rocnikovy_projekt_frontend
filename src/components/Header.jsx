import { useAuth } from "../context/AuthContext";

function Header() {
  const { logout } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <div>
      <h1>my messenger</h1>
      <div>
        <p>profile</p>
        <p>picture</p>
        <button onClick={handleLogout}>log out</button>
      </div>
    </div>
  );
}

export default Header;
