import { useEffect, useState, useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
import "../../styles/Insights.css";

export default function SleepInsights() {
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
        <h5>Sleep Insights</h5>
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
        <strong>Sleep timeline</strong>
        <p>
          When one is asleep, the body typically goes through several sleep
          cylcles that generally last between 90 - 120 minutes. Based on body
          signals and movement, Fitbit estimates 3 stages of sleep.
        </p>
        <ul>
          <li>
            <strong>Light sleep</strong>, when one moves more and occasionally
            wakeup for brief moments.
          </li>
          <li>
            <strong>Deep sleep</strong>, when one's heart beats slower and
            steadier, and movements might be less.
          </li>
          <li>
            <strong>REM sleep</strong>, when one tends to dream more vividly,
            and may see changes in heartrate and breathing
          </li>
        </ul>

        <strong>Graph contents</strong>
        <p></p>
        <strong>Why it matters</strong>
        <p>
          Tracking sleep changes can help you understand your patient's sleep
          quality.
        </p>
      </div>
    </div>
  );
}
