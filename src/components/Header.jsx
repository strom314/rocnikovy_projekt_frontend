import { useAuth } from "../context/AuthContext";

function Header() {
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <div>
      <h1>my messenger</h1>
      <div>
        <p>{user.username}</p>
        <p>picture</p>
        <button onClick={handleLogout}>log out</button>
      </div>
    </div>
  );
}

export default Header;
