import { useEffect, useState } from "react";

export default function SkinTempCard() {
  const [skinTemp, setSkinTemp] = useState(null);

  useEffect(() => {
    const fetchSkinTempData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/fitbitData/skinTemp?email=gloriazhou34@gmail.com`
        );

        const res = await response.json();
        const avgSkinTemp = res.tempSkin[0].value.nightlyRelative;
        setSkinTemp(avgSkinTemp);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchSkinTempData();
  }, []);

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
