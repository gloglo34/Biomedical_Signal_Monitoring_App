import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { PatientContext } from "../context/PatientContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [patients, setPatients] = useState([]);
  const { selectedPatientEmail, setSelectedPatientEmail } =
    useContext(PatientContext);
  const [lastSyncTime, setLastSyncTime] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    // Fetch the list of authorized patients
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `https://localhost:443/patients?userEmail=${userEmail}`
        );

        if (response.status === 200) {
          //Filter out unauthorized patients
          const authorizedPatients = response.data.filter(
            (patient) => patient.authorizationStatus === "Authorized"
          );

          setPatients(authorizedPatients);

          // Automatically select the first patient in the list
          if (authorizedPatients.length > 0) {
            setSelectedPatientEmail(authorizedPatients[0].email);
          } else {
            setSelectedPatientEmail(null);
          }
        }
      } catch (error) {
        setError("Failed to fetch patients");
        console.error(error);
      }
    };

    fetchPatients();
  }, [userEmail]);

  useEffect(() => {
    // Fetch last sync time for the selected patient
    const fetchLastSyncTime = async () => {
      if (!selectedPatientEmail) return;

      try {
        const response = await axios.get(
          `https://localhost:443/fitbitData/devices?email=${selectedPatientEmail}`
        );

        if (response.status === 200 && response.data.length > 0) {
          const lastSyncTime = new Date(response.data[0]?.lastSyncTime);
          setLastSyncTime(lastSyncTime.toLocaleString() || "No data available");
        } else {
          setLastSyncTime("No devices found");
        }
      } catch (error) {
        setError("Failed to fetch last sync time");
        console.error(error);
      }
    };

    fetchLastSyncTime();
  }, [selectedPatientEmail]);

  return (
    <header className="header">
      <h2>Welcome {userEmail}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {patients.length > 0 ? (
        <div className="patient-actions">
          <label htmlFor="patient-select">
            <strong>Current Patient: </strong>{" "}
          </label>
          <select
            id="patient-select"
            value={selectedPatientEmail}
            onChange={(e) => setSelectedPatientEmail(e.target.value)}
          >
            {patients.map((patient) => (
              <option key={patient.email} value={patient.email}>
                {patient.email}
              </option>
            ))}
          </select>
          <p>
            <strong>Last Sync Time: </strong>
            {lastSyncTime || "Loading..."}
          </p>

          <button onClick={() => navigate("/managePatients")}>
            <i className="material-symbols-outlined">group</i>
          </button>
        </div>
      ) : (
        <p>No authorized patients yet.</p>
      )}
    </header>
  );
}
