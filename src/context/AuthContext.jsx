import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/user", {
          headers: { Authorization: storedToken },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setToken(storedToken);
        } else {
          // if token is  expired
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Auth verification failed", err);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to make using context easier
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
