import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LogReg.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      //Log in the user
      const response = await axios.post("https://localhost:443/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        //Save logged in user to localstorage
        localStorage.setItem("email", email);

        //Fetch the list of patients added by the user
        const patientsResponse = await axios.get(
          `https://localhost:443/patients?userEmail=${email}`
        );

        if (patientsResponse.status === 200) {
          //Filter authorized patients
          const authorizedPatients = patientsResponse.data.filter(
            (patient) => patient.authorizationStatus === "Authorized"
          );

          if (authorizedPatients.length > 0) {
            navigate("/dashboard");
          } else {
            navigate("/welcome");
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleLogin}>
        <h1>Login</h1>

        {/* {error && <p>{error}</p>} */}

        {error && <p style={{ color: "orange" }}>{error}</p>}

        <div className="input-box">
          <input
            type="text"
            placeholder="Enter email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <i className="material-symbols-outlined">mail</i>
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className="material-symbols-outlined">lock</i>
        </div>

        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Remember me
          </label>

          <a href="#">Forgot password?</a>
        </div>

        <button type="submit" className="loginbtn">
          Login
        </button>

        <div className="register-link">
          <p>
            Don't have an account? <a href="/register">Create account</a>
          </p>
        </div>
      </form>
    </div>
  );
}
