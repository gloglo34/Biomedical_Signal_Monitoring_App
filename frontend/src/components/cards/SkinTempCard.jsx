import { useEffect, useState, useContext } from "react";
import { PatientContext } from "../../context/PatientContext";

export default function SkinTempCard() {
  const [skinTemp, setSkinTemp] = useState(null);
  const { selectedPatientEmail } = useContext(PatientContext);

  useEffect(() => {
    const fetchSkinTempData = async () => {
      if (!selectedPatientEmail) return;

      try {
        const response = await fetch(
          `https://localhost:443/fitbitData/skinTemp?email=${selectedPatientEmail}`
        );

        const res = await response.json();
        const avgSkinTemp = res.tempSkin[0].value.nightlyRelative;
        setSkinTemp(avgSkinTemp);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchSkinTempData();
  }, [selectedPatientEmail]);

  return (
    <div className="skinTemp-card">
      <span className="card-header">
        <h4>Skin Temperature</h4>
        <i className="material-symbols-outlined">thermometer</i>
      </span>
      <div className="card-content">
        <p>
          <strong>Nightly Relative Skin Temperature : </strong> {skinTemp}{" "}
        </p>
      </div>
    </div>
  );
}
