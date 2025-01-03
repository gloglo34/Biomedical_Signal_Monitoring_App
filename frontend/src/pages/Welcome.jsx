import { useNavigate } from "react-router-dom";
import "../styles/LogReg.css";
import myVid from "../assets/vid.mp4";

export default function Welcome() {
  const userEmail = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleManagePatients = () => {
    navigate("/managePatients");
  };

  const handleViewDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="home-container">
      <header className="welcome-header">
        <h1>Welcome to MediTrack Pro</h1>
        <p>Your ultimate solution for near real-time health monitoring.</p>
      </header>

      <main className="welcome-main">
        <div className="video-and-about">
          <div className="video-container">
            <video
              className="vid"
              width="100%"
              height="100%"
              autoPlay
              loop
              muted
            >
              <source src={myVid} type="video/mp4" />
            </video>
          </div>

          <section className="welcome-overview">
            <h2>About the App</h2>
            <p>
              MediTrack Pro allows you to monitor your patients' vital health
              metrics in real-time using wearable devices like Fitbit. Get
              insights into their heart rate, sleep patterns, and more, all in
              one place.
            </p>
            <h2>Quick Start Guide</h2>
            <ul>
              <li>
                <strong>Step 1:</strong> Add a patient to the system.
              </li>
              <li>
                <strong>Step 2:</strong> Ensure the patient authorizes Fitbit
                data sharing.
              </li>
              <li>
                <strong>Step 3:</strong> Navigate to the dashboard to start
                monitoring.
              </li>
            </ul>
          </section>
        </div>
        <section className="cta-buttons">
          <button className="cta-btn" onClick={handleViewDashboard}>
            View Dashboard
          </button>
          <button className="cta-btn" onClick={handleManagePatients}>
            Manage Patients
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </section>
      </main>
    </div>
  );
}
