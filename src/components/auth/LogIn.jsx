import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { Link } from "react-router-dom";

function LogIn() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setErrors("");

    try {
      const response = await fetch("http://localhost:3000/log-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.errors?.errors?.[0]?.msg || data?.message || "login failed";

        throw new Error(errorMessage);
      }

      login(data.token, data.user);

      navigate("/chat");
    } catch (error) {
      setErrors(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1>Log in</h1>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          {errors && <div className={styles.errorText}>{errors}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className={styles.signupLink}>
            don't have an account? <Link to={"/signup"}>sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
