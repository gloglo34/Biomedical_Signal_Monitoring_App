import { useState, useEffect } from "react";
import axios from "axios";

export default function Header() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientEmail, setSelectedPatientEmail] = useState("");
  const [lastSyncTime, setLastSyncTime] = useState("");
  const [error, setError] = useState("");

  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    // Fetch the list of authorized patients
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/patients?userEmail=${userEmail}`
        );

        if (response.status === 200) {
          setPatients(response.data);

          // Automatically select the first patient in the list
          if (response.data.length > 0) {
            setSelectedPatientEmail(response.data[0].email);
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
          `http://localhost:5000/fitbitData/devices?email=${selectedPatientEmail}`
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

  const handlePatientChange = (e) => {
    setSelectedPatientEmail(e.target.value);
    setLastSyncTime(""); // Reset sync time while fetching new data
  };

  return (
    <header className="header">
      <h2>Welcome {userEmail}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {patients.length > 0 ? (
        <div>
          <label htmlFor="patient-select">
            <strong>Current Patient:</strong>{" "}
          </label>
          <select
            id="patient-select"
            value={selectedPatientEmail}
            onChange={handlePatientChange}
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
        </div>
      ) : (
        <p>No authorized patients yet.</p>
      )}
    </header>
  );
}
