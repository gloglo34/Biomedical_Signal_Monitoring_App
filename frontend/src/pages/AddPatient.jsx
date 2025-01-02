import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddPatient() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleBacktoDashboard = () => {
    navigate("/dashboard1");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem("email");

    try {
      const response = await axios.post("http://localhost:5000/email/send", {
        receivingEmail: email,
        userEmail,
      });

      if (response.status === 200) {
        setMessage(response.data.message);

        if (response.data.message.includes("already authorized")) {
          navigate("/dashboard2");
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to send email.");
    }
  };

  return (
    <div>
      <h1>Add a new patient</h1>
      <p>Enter the email address of the patient you wish to monitor.</p>
      <p>They must have a Fitbit account.</p>

      <p>{message}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Patient's Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <button type="submit">Submit</button>
        <p>
          Once submitted, the patient will receive an email requesting their
          authorization to share their Fitbit data with you.
        </p>
        <button type="button" onClick={handleBacktoDashboard}>
          Back to Dashboard
        </button>
      </form>
    </div>
  );
}
