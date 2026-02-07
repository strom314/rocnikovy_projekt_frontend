import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MessageInput from "./MessageInput";

function MessageList({ selectedConversationId }) {
  const { token } = useAuth();

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
    <div>
      <h1>message list</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>

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
