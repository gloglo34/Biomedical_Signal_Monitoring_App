import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isAddPatientVisible, setIsAddPatientVisible] = useState(false);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("email");

  // Fetch the list of all added patients with authorization status
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/patients?userEmail=${userEmail}`
        );
        if (response.status === 200) {
          setPatients(response.data);
        }
      } catch (error) {
        setError("Failed to fetch patients.");
        console.error(error);
      }
    };
    fetchPatients();
  }, [userEmail]);

  // Handle adding a new patient
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/email/send", {
        receivingEmail: email,
        userEmail,
      });

      if (response.status === 200) {
        setMessage(response.data.message);

        // Refresh the patient list
        const updatedPatients = await axios.get(
          `http://localhost:5000/patients?userEmail=${userEmail}`
        );
        setPatients(updatedPatients.data);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to send email.");
    }
  };

  // Handle deleting a patient
  const handleDeletePatient = async (patientEmail) => {
    try {
      await axios.delete(`http://localhost:5000/patients`, {
        data: { email: patientEmail, userEmail },
      });

      // Update the table after deletion
      setPatients((prevPatients) =>
        prevPatients.filter((patient) => patient.email !== patientEmail)
      );
    } catch (error) {
      console.error("Failed to delete patient:", error);
    }
  };

  return (
    <div className="manage-patients">
      <h1>Manage Patients</h1>

      {/* Error or success messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Patients Table */}
      <div className="patients-table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Authorization Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient.email}>
                  <td>{patient.email}</td>
                  <td>{patient.authorizationStatus}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeletePatient(patient.email)}
                    >
                      <i className="material-symbols-outlined">delete</i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No patients added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Patient Section */}
      <button
        className="toggle-add-patient-btn"
        onClick={() => setIsAddPatientVisible(!isAddPatientVisible)}
      >
        {isAddPatientVisible ? "− Hide Add Patient Form" : "+ Add Patient"}
      </button>

      {isAddPatientVisible && (
        <div className="add-patient-form">
          <h2>Add a new patient</h2>
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
          </form>
        </div>
      )}

      {/* Back to Dashboard */}
      <button
        type="button"
        className="back-to-dash"
        onClick={() => navigate("/welcome")}
      >
        Back to Home
      </button>
    </div>
  );
}
