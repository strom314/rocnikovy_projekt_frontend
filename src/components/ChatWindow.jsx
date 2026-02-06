import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";

function Chat() {
  const { user, token } = useAuth();

  const [selectedConversationId, setSelectedConversationId] = useState(null);

  function onSelectConversation(conversationId) {
    setSelectedConversationId(conversationId);
  }

  return (
    <div>
      <Header />
      <Sidebar
        onSelectConversation={onSelectConversation}
        selectedConversationId={selectedConversationId}
      />
      <MessageList selectedConversationId={selectedConversationId} />

      <div>debug info</div>
      <div>username: {user.username}</div>
      <div>token: {token}</div>
    </div>
  );
}

export default Chat;
