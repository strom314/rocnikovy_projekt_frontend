import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./messageInput.module.css";

function MessageInput({ selectedConversationId, fetchMessages }) {
  const { token } = useAuth();

  const [message, setMessage] = useState("");

  const [error, setError] = useState(null);

  async function onMessageSend(e) {
    e.preventDefault();
    setError(null);

    if (!selectedConversationId) {
      setError("Select a conversation first");
      return;
    }

    if (message.trim().length === 0) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/conversation/${selectedConversationId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: message.trim() }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      fetchMessages();

      setMessage("");
    } catch (error) {
      setError(error?.message ?? "Failed to send message");
    }
  }

  return (
    <form onSubmit={onMessageSend} className={styles.container}>
      {error && <p>{error}</p>}
      <input
        className={styles.messageInput}
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <button type="submit">send</button>
    </form>
  );
}

export default MessageInput;
