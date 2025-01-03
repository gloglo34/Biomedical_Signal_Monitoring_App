import { useNavigate } from "react-router-dom";
import "../styles/LogReg.css";

export default function Welcome() {
  const sth = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleAddPatient = () => {
    navigate("/managePatients");
  };
  return (
    <div className="home-container">
      <h1>Welcome to the MediTrack Pro</h1>
      <p>You are logged in as {sth}</p>
      <h4>Add patient to start monitoring their health metrics.</h4>

      <button onClick={handleAddPatient}>Add Patient</button>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <p>
          Having trouble? <a href="/help">Contact Support</a>
        </p>
      </div>
    </div>
  );
}
