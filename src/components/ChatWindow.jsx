import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import Sidebar from "./chat/Sidebar";
import MessageList from "./chat/MessageList";
import styles from "./chatWindow.module.css";

function Chat() {
  // const { user, token } = useAuth();

  const [selectedConversationId, setSelectedConversationId] = useState(null);

  function onSelectConversation(conversationId) {
    setSelectedConversationId(conversationId);
  }

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Header />
      </div>

      <div className={styles.sidebar}>
        <Sidebar
          onSelectConversation={onSelectConversation}
          selectedConversationId={selectedConversationId}
        />
      </div>

      <div className={styles.messageList}>
        <MessageList selectedConversationId={selectedConversationId} />
      </div>

      {/* <div>debug info</div>
      <div>username: {user.username}</div>
      <div>token: {token}</div> */}
    </div>
  );
}

export default Chat;
