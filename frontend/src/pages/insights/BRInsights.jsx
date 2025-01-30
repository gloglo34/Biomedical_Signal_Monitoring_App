import { useEffect, useState, useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
import "../../styles/Insights.css";

export default function BRInsights() {
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
        <h5>Breathing rate Insights</h5>
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
        <strong>What is brathing rate?</strong>
        <p>
          Breathing rate is the number of breaths taken per minute. The body
          usually adjusts breathing rate to help get enough oxygen. Breathing
          rate is typically between 12 - 20 breaths per minute.
        </p>
        <strong>Graph contents</strong>
        <p>
          In the graph, BR measurements are from the longest sleep period of
          that particular day. Only sleep periods greater than 3 hours are
          considered.
        </p>
        <strong>Why it matters</strong>
        <p>
          Tracking BR during sleep is valuable for monitoring overall
          well-being. Typically, average BR during sleep won't vary
          significantly from night to night. Even small increase in BR could be
          meaningful. Factors that can affect BR include age,gender,weight,lung
          and heart conditions, anxiety and fever.
        </p>
      </div>
    </div>
  );
}
