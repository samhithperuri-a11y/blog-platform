import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/login", { username, password });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ marginBottom: 18 }}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Login to continue to your dashboard</p>
        </div>

        {errorMsg ? (
          <div style={styles.errorBox} role="alert">
            {errorMsg}
          </div>
        ) : null}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              autoComplete="username"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>

            <div style={styles.passwordWrap}>
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, paddingRight: 90 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                style={styles.showBtn}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.footerText}>
            Tip: After login, you’ll be redirected to dashboard.
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 16,
    // background:
    //   "radial-gradient(1200px 600px at 10% 10%, #eef2ff 0%, #ffffff 55%, #f1f5f9 100%)",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    borderRadius: 16,
    padding: 22,
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.10), 0 1px 0 rgba(15, 23, 42, 0.04)",
      marginTop:'-145px',
      marginLeft:'15px'
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: 14,
    color: "rgba(15, 23, 42, 0.65)",
  },
  form: { display: "grid", gap: 14 },
  field: { display: "grid", gap: 8 },
  label: { fontSize: 13, fontWeight: 700, color: "rgba(15, 23, 42, 0.8)" },
  input: {
    width: "100%",
    height: 44,
    borderRadius: 12,
    border: "1px solid rgba(15, 23, 42, 0.18)",
    padding: "0 12px",
    outline: "none",
    fontSize: 14,
  },
  passwordWrap: { position: "relative" },
  showBtn: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    height: 30,
    padding: "0 10px",
    borderRadius: 10,
    border: "1px solid rgba(15, 23, 42, 0.18)",
    background: "#fff",
    fontSize: 13,
  },
  btn: {
    height: 44,
    borderRadius: 12,
    border: "none",
    background: "#111827",
    color: "#fff",
    fontSize: 14,
    fontWeight: 800,
  },
  errorBox: {
    marginBottom: 12,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(239, 68, 68, 0.35)",
    background: "rgba(239, 68, 68, 0.08)",
    color: "#7f1d1d",
    fontSize: 13,
    fontWeight: 700,
  },
  footerText: {
    margin: "6px 0 0",
    fontSize: 12,
    color: "rgba(15, 23, 42, 0.55)",
    textAlign: "center",
  },
};

export default Login;
