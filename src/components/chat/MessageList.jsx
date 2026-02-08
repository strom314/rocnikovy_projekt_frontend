import { useEffect, useRef, useState } from "react";
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

  const scrollRef = useRef(null);
  const shouldScrollDownRef = useRef(false);

  //auto scrolling when user sends a message
  useEffect(() => {
    if (shouldScrollDownRef.current) {
      scrollDown();
    } else {
      handleAutoScroll();
    }
  }, [messages]);

  async function fetchMessages(isPolling = false) {
    try {
      if (!isPolling) {
        setLoading(true);
      }

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
      if (!isPolling) {
        setLoading(false);
      }
    }
  }

  //fetching messages
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      setError(null);
      return;
    }

    setError(null);
    shouldScrollDownRef.current = true;

    //initial fetch
    fetchMessages(false);

    //polling
    const intervalId = setInterval(() => {
      fetchMessages(true);
    }, 2000);

    //cleanup interval
    return () => clearInterval(intervalId);
  }, [selectedConversationId, token]);

  function handleAutoScroll() {
    const container = scrollRef.current;
    if (!container) return;

    const threshold = 100;
    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + threshold;

    if (isAtBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }
  function scrollDown() {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "instant",
    });
    shouldScrollDownRef.current = false;
  }

  return (
    <div className={styles.messageWindow}>
      {error && <p>{error}</p>}
      <ul className={styles.messageDisplay} ref={scrollRef}>
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
        {loading && messages.length === 0 && <li>Loading...</li>}
      </ul>

      <div>
        <MessageInput
          selectedConversationId={selectedConversationId}
          fetchMessages={() => fetchMessages(true)}
        />
      </div>
    </div>
  );
}

export default MessageList;
