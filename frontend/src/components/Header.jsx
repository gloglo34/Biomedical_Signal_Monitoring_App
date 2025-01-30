import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { PatientContext } from "../context/PatientContext";
import { usePatientData } from "../hooks/usePatientData";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [patients, setPatients] = useState([]);
  const { selectedPatientEmail, setSelectedPatientEmail } =
    useContext(PatientContext);
  const {
    data: patientData,
    isLoading,
    error: fetchError,
  } = usePatientData(selectedPatientEmail);
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
          // Filter out unauthorized patients
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
        console.error("Failed to fetch patients:", error);
      }
    };

    fetchPatients();
  }, [userEmail, setSelectedPatientEmail]);

  // Extract lastSyncTime from the custom hook's patientData
  const lastSyncTime = patientData?.devices?.[0]?.lastSyncTime
    ? new Date(patientData.devices[0].lastSyncTime).toLocaleString()
    : "No data available";

  return (
    <header className="header">
      <h2>Welcome {userEmail}</h2>

      {fetchError && <p style={{ color: "red" }}>{fetchError.message}</p>}

      {patients.length > 0 ? (
        <div className="patient-actions">
          <label htmlFor="patient-select">
            <strong>Current Patient: </strong>{" "}
          </label>
          <select
            id="patient-select"
            value={selectedPatientEmail || ""}
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
            {isLoading ? "Loading..." : lastSyncTime}
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
