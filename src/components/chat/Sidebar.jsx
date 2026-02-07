import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PeopleSearch from "./PeopleSearch";
import styles from "./sidebar.module.css";

function Sidebar({ onSelectConversation, selectedConversationId }) {
  const { token, user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadConversations() {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:3000/conversations", {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load conversations");
        }

        const data = await response.json();

        setConversations(data);
      } catch (error) {
        setError(error?.message ?? "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, [token, selectedConversationId]);

  return (
    <div>
      <h1>sidebar</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul className={styles.chatList}>
        {conversations.map((conversation) => {
          const [first, second] = conversation.participants;
          const other = first.userId === user.id ? second.user : first.user;

          return (
            <li
              className={[
                styles.chat,
                conversation.id === selectedConversationId
                  ? styles.selected
                  : "",
              ].join(" ")}
              key={conversation.id}
              onClick={() => {
                onSelectConversation(conversation.id);
              }}
            >
              chat with {other.username}
            </li>
          );
        })}
      </ul>

      <PeopleSearch onSelectConversation={onSelectConversation} />
    </div>
  );
}

export default Sidebar;
