import { useAuth } from "../context/AuthContext";
import Header from "./Header";

function Chat() {
  const { user, token } = useAuth();

  return (
    <div>
      <Header />
      <div>username: {user.username}</div>
      <div>token: {token}</div>
    </div>
  );
}

export default Chat;
