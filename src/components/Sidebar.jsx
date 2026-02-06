import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import PeopleSearch from "./PeopleSearch";

function Sidebar({ onSelectConversation }) {
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
  }, [token]);

  return (
    <div>
      <h1>sidebar</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul>
        {conversations.map((conversation) => {
          const [first, second] = conversation.participants;
          const other = first.userId === user.id ? second.user : first.user;

          return (
            <li
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
