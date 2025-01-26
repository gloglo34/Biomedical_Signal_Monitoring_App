import { useEffect, useState, useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
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

export default function HrCard() {
  const { selectedPatientEmail } = useContext(PatientContext);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Heart Rate",
        data: [],
      },
    ],
  });

  const options = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Heart Rate (bpm)",
        },
      },
    },
  };

  useEffect(() => {
    const fetchHeartRateData = async () => {
      if (!selectedPatientEmail) return;

      try {
        const response = await fetch(
          `https://localhost:443/fitbitData/heartrate?email=${selectedPatientEmail}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();
        const data = res["activities-heart-intraday"].dataset;
        const times = data.map((item) => item.time);
        const values = data.map((item) => item.value);

        setChartData({
          labels: times,
          datasets: [
            {
              label: "Heart Rate",
              data: values,
              tension: 0.3,
              borderColor: "rgba(137, 196, 244)",
            },
          ],
        });
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchHeartRateData();
    const interval = setInterval(fetchHeartRateData, 300000); // 5 minute
    return () => clearInterval(interval); // Cleanup on unmount
  }, [selectedPatientEmail]);

  return (
    <div className="hr-card">
      <span className="card-header">
        <h4>Heart Rate</h4>
        <i className="material-symbols-outlined">monitor_heart</i>
      </span>
      <div className="card-content">
        <Line data={chartData} options={options} height={300} width={400} />
      </div>
    </div>
  );
}
