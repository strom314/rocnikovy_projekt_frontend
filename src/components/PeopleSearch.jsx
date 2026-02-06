import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function useDebouncedValue(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}

function PeopleSearch({ onSelectConversation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const { token, user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebouncedValue(query.trim(), 400);

  function onInputChange(e) {
    setQuery(e.target.value);
  }

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchPeople() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3000/users?search=${debouncedQuery}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to search users");
        }

        const data = await response.json();

        if (!cancelled) {
          setResults(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message ?? "Failed to search users");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPeople();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, token]);

  async function onCreateConversation(otherId) {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/conversation", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantIds: [otherId, user.id],
          isGroup: false,
        }),
      });

      if (!response.ok) {
        throw new Error("failed to create conversation");
      }

      const data = await response.json();

      onSelectConversation(data.id);
      setQuery("");
      setResults([]);
    } catch (error) {
      setError(error?.message ?? "Failed to create conversation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input type="text" value={query} onInput={onInputChange} />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {results.map((user) => (
          <li
            key={user.id}
            onClick={() => {
              onCreateConversation(user.id);
            }}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PeopleSearch;
