import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPatient() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleBacktoDashboard = () => {
    navigate("/dashboard1");
  };

  return (
    <div>
      <h1>Add a new patient</h1>
      <p>Enter the email address of the patient you wish to monitor.</p>
      <p>They must have a Fitbit account.</p>

      <form>
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
