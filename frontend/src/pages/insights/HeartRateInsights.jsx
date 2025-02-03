import { useEffect, useState, useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
import "../../styles/Insights.css";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export default function HeartRateInsights() {
  const { selectedPatientEmail } = useContext(PatientContext);

  const [restingHeartRateData, setRestingHeartRateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [intradayData, setIntradayData] = useState([]);
  const [lastThreeDates, setLastThreeDates] = useState([]);

  //Generating the last 3 dates dynamically
  const generateLastThreeDates = () => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]); //Format:YYYY:MM:DD
    }
    return dates;
  };

  useEffect(() => {
    if (!selectedPatientEmail) return;

    //Fetching data from history endpoint (database)
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://localhost:443/history/heartrate?email=${selectedPatientEmail}`
        );

        const data = await response.json();

        const lastThree = generateLastThreeDates();
        setLastThreeDates(lastThree);

        //Process resting heart rate data
        const processedRestingData = lastThree.map((date) => {
          const entry = data.restingHeartRate.find(
            (item) => item.date === date
          );
          return {
            date,
            restingHeartRate: entry ? entry.restingHeartRate : null,
          };
        });

        setRestingHeartRateData(processedRestingData);

        // Set the most recent date as the default selected date
        setSelectedDate(lastThree[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPatientEmail]);

  useEffect(() => {
    if (!selectedDate || !selectedPatientEmail) return;

    //Fetch intraday data for the selected date
    const fetchIntradayData = async () => {
      try {
        const response = await fetch(
          `https://localhost:443/history/heartrate?email=${selectedPatientEmail}`
        );
        const data = await response.json();

        const entry = data.intraday.find((item) => item.date === selectedDate);
        setIntradayData(entry ? entry.intraday : []); //set intraday data or empty if not available
        setLoading(false);
      } catch (error) {
        console.error("Error fetching intraday data:", error);
        setLoading(false);
      }
    };
    fetchIntradayData();
  }, [selectedDate, selectedPatientEmail]);

  const restingHeartRateChartData = {
    labels: restingHeartRateData.map((item) => item.date),
    datasets: [
      {
        label: "Resting Heart Rate (bpm)",
        data: restingHeartRateData.map((item) => item.restingHeartRate),
        borderColor: "rgba(137, 196, 244)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const intradayHeartRateChartData = {
    labels: intradayData.map((item) => item.time),
    datasets: [
      {
        label: "Intraday Heart Rate (bpm)",
        data: intradayData.map((item) => item.value),
        borderColor: "rgba(137, 196, 244)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div className="heartrate-insights-container">
      <div className="graph-container">
        <h5>Heart Rate History</h5>
        <label htmlFor="date-select">Select Date: </label>
        <select
          id="date-select"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {lastThreeDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
        <Line data={intradayHeartRateChartData} />
      </div>

      <div className="info-container">
        <strong>What is resting heart rate (RHR)?</strong>
        <p>
          RHR is the number of times the heart beats per minute when one is
          still and well-rested. RHR typically ranges from 60 - 100bpm, but can
          vary based on age and fitness level.
        </p>
        <strong>What is Intraday heart rate? </strong>
        <p>
          Intrday heart rate provides detailed heart rate measurements recorded
          throughout the day,offering insights into daily fluctuations based on
          activity and rest.
        </p>
        <strong>Graph contents</strong>
        <p>
          In the graph, you can visulaize intraday heart rate trends throughout
          the day as well as resting heart rate. Historical data is available
          for the last 3 days. Use the Date drop down to switch the date.
        </p>
        <strong>Why it matters</strong>
        <p>
          Heart rate can be an important indicator of fitness level and overall
          cardiovascular health. In general, active people often have lower
          resting heartarate. Many factors influence heart rate: stress,alcohol
          or caffeine intake or fever usually raise heart rate while exercise or
          meditation usually lowers it. Air temperature and certain medications
          can also affect heart rate.
        </p>
      </div>
    </div>
  );
}
