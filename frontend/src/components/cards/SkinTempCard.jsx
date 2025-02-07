import { useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
import { usePatientData } from "../../hooks/usePatientData";

export default function SkinTempCard() {
  const { selectedPatientEmail } = useContext(PatientContext);
  const {
    data: patientData,
    isLoading,
    error,
  } = usePatientData(selectedPatientEmail);

  // Safely access the skin temperature data
  const avgSkinTemp =
    patientData?.skinTemp?.tempSkin[0]?.value?.nightlyRelative ??
    "No data available";

  if (isLoading) {
    return (
      <div className="skinTemp-card">
        <h4>Skin Temperature</h4>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="skinTemp-card">
        <h4>Skin Temperature</h4>
        <p>Error loading data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="skinTemp-card">
      <span className="card-header">
        <h4>Skin Temperature</h4>
        <i className="material-symbols-outlined">thermometer</i>
      </span>
      <div className="card-content">
        <p>
          <strong>Nightly Relative Skin Temperature: </strong> {avgSkinTemp}
        </p>
      </div>
    </div>
  );
}
