import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login({ login }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const sth = response.data.email;
        localStorage.setItem("email", JSON.stringify(sth));
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="login-form-container">
        <h1>Login</h1>
        <hr />

        {error && <p>{error}</p>}

        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input
          type="text"
          placeholder="Enter email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>

        <label htmlFor="password">
          <b>Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <hr />

        <button type="submit" className="loginbtn">
          Login
        </button>

        <p>
          Don't have an account? <a href="/register">Create account</a>
        </p>
      </div>
    </form>
  );
}
