// export default function Header() {
//   return (
//     <header className="app-header">
//       <h2>Welcome</h2>
//     </header>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";

export default function Header({ onPatientChange }) {
  const [patients, setPatients] = useState([]);
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
        }
      } catch (error) {
        setError("Failed to fetch patients");
        console.error(error);
      }
    };

    fetchPatients();
  }, [userEmail]);

  return (
    <header className="header">
      <h2>Welcome {userEmail}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {patients.length > 0 ? (
        <div>
          <label htmlFor="patient-select">Current Patient: </label>
          <select>
            {patients.map((patient) => (
              <option key={patient.email} value={patient.email}>
                {patient.email}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>No authorized patients yet.</p>
      )}
    </header>
  );
}
