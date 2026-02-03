import { useAuth } from "../context/AuthContext";

function Chat() {
  const { user, token } = useAuth();

  return (
    <div>
      <h1>chat</h1>
      <div>username: {user.username}</div>
      <div>token: {token}</div>
    </div>
  );
}

export default Chat;
