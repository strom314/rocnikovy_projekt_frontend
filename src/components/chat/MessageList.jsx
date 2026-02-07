import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MessageInput from "./MessageInput";
import styles from "./messageList.module.css";

function formatMessageDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function MessageList({ selectedConversationId }) {
  const { token, user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [messages, setMessages] = useState([]);

  async function fetchMessages() {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:3000/conversation/${selectedConversationId}/messages`,
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (!response.ok) {
        throw new Error("failed to fetch messages");
      }

      const data = await response.json();

      setMessages(data);
    } catch (error) {
      setError(error?.message ?? "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      setError(null);
      return;
    }

    fetchMessages();
  }, [selectedConversationId, token]);

  return (
    <div className={styles.messageWindow}>
      <div>
        <h1>message list</h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <ul className={styles.messageDisplay}>
          {messages.map((message) => (
            <li
              className={[
                styles.message,
                message.senderId === user.id ? styles.right : "",
              ].join(" ")}
              key={message.id}
            >
              {formatMessageDate(message.createdAt)} : {message.content}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <MessageInput
          selectedConversationId={selectedConversationId}
          fetchMessages={fetchMessages}
        />
      </div>
    </div>
  );
}

export default MessageList;
