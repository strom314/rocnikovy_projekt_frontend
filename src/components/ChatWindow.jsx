import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Chat() {
  const { user, token } = useAuth();

  return (
    <div>
      <Header />
      <Sidebar />

      <div>debug info</div>
      <div>username: {user.username}</div>
      <div>token: {token}</div>
    </div>
  );
}

export default Chat;
