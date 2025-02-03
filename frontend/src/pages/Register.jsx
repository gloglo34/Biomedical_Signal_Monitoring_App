import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do no match");
      return;
    }

    try {
      const response = await axios.post(`https://localhost:443/auth/register`, {
        email,
        password,
      });

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again"
      );
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleRegister}>
        <h1>Register</h1>
        <p>Please fill in this form to create an account.</p>

        {error && <p style={{ color: "orange" }}>{error}</p>}

        <div className="input-box">
          <input
            type="text"
            placeholder="Enter email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Confirm password"
            name="password-confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="password-confirm"
            required
          />
        </div>

        <div className="register-link">
          <p>
            By creating an account you agree to our{" "}
            <a href="#">Terms & Privacy</a>
          </p>
        </div>

        <button type="submit" className="registerBtn">
          Register
        </button>

        <div className="register-link">
          <p>
            Already have an account? <a href="/">Log in</a>
          </p>
        </div>
      </form>
    </div>
  );
}
