import { useNavigate } from "react-router-dom";

export default function Dashboard1() {
  const sth = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleAddPatient = () => {
    navigate("/addPatient");
  };
  return (
    <div>
      <h1>Welcome to the MediTrack Pro</h1>
      <p>You are logged in as {sth}</p>
      <h4>Add patient to start monitoring their health metrics.</h4>
      <div>
        <img src="../assets/illust.png" width="600" />
      </div>
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
