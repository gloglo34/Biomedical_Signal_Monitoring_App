import { useEffect, useState, useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
import "../../styles/Insights.css";

export default function SkinTempInsights() {
  const { selectedPatientEmail } = useContext(PatientContext);

  const [lastThreeDates, setLastThreeDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [intradayData, setIntradayData] = useState([]);

  // Generate the last 3 dates dynamically
  const generateLastThreeDates = () => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  useEffect(() => {
    if (!selectedPatientEmail) return;

    // Fetch sleep history data from the database
    const fetchData = async () => {};

    fetchData();
  }, [selectedPatientEmail]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
  };

  const sleepChartData = {};

  const options = {};

  // if (loading) {
  //   return <p>Loading data...</p>;
  // }

  return (
    <div className="hrv-insights-container">
      <div className="graph-container">
        <h5>Skin Temperature Insights</h5>
        <label htmlFor="date-select">Select Date: </label>
        <select
          id="date-select"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
        >
          {lastThreeDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
        {/* <Line data={hrvChartData} options={options} /> */}
      </div>

      <div className="info-container">
        <strong>What is skin temperature?</strong>
        <p>
          Skin temperature is the temperature taken from your patient's wrist
          while they sleep. Its not the same as core temperature, which is the
          temperature inside the body and usually taken with a thermometer.
        </p>
        <strong>Graph contents</strong>
        <p></p>
        <strong>Why it matters</strong>
        <p>
          It's normal for skin temperature to cary throughout sleep and from
          night to night. Warming up or cooling down the skin is one way the
          body regulates itself and keeps core temperature stable. Factors that
          may cause skin temperature to vary nightly include changes in room
          temerature,bedding, circadian rhythm, menstrual cycle or the onset of
          fever.
        </p>
      </div>
    </div>
  );
}
