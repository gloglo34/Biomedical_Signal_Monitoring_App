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

export default function HrvCard() {
  const { selectedPatientEmail } = useContext(PatientContext);
  const [hrvChartData, setHrvChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "HRV",
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
          text: "RMSSD (ms)",
        },
      },
    },
  };

  useEffect(() => {
    const fetchHrvData = async () => {
      if (!selectedPatientEmail) return;

      try {
        const response = await fetch(
          `https://localhost:443/fitbitData/hrv?email=${selectedPatientEmail}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();

        //Check if HRV data is available
        if (!res.hrv || res.hrv.lenght === 0) {
          console.warn("No HRV data available for selected patient.");
          setHrvChartData({
            labels: [],
            datasets: [
              {
                label: "HRV",
                data: [],
              },
            ],
          });
          return;
        }

        const data = res.hrv[0]?.minutes || [];
        const times = data.map((item) =>
          new Date(item.minute).toLocaleTimeString()
        );
        const rmssdValues = data.map((item) => item.value.rmssd);

        setHrvChartData({
          labels: times,
          datasets: [
            {
              label: "HRV",
              data: rmssdValues,
              borderColor: "rgba(137, 196, 244)",
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
      }
    };
    fetchHrvData();
  }, [selectedPatientEmail]);

  return (
    <div className="hrv-card">
      <span className="card-header">
        <h4>HRV</h4>
        <i className="material-symbols-outlined">show_chart</i>
      </span>
      <div className="card-content">
        <Line data={hrvChartData} options={options} height={300} width={400} />
      </div>
    </div>
  );
}
