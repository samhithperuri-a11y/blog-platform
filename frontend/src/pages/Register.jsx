import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", { username, password });
      alert("Register success ✅");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.error || "Register failed");
    }
  };

  return (
    <div className="center">
      <div className="card card-pad form">
        <h2 className="h2">Register</h2>

        <form onSubmit={handleRegister}>
          <div className="field">
            <div className="label">Username</div>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
          </div>

          <div className="field">
            <div className="label">Password</div>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
          </div>

          <button className="btn btn-primary" type="submit">Create account</button>
        </form>
      </div>
    </div>
  );
}
export default Register;


