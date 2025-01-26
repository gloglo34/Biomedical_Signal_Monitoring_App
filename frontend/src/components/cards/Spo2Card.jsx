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

export default function Spo2Card() {
  const { selectedPatientEmail } = useContext(PatientContext);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Spo2",
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
          text: "Spo2 (%)",
        },
      },
    },
  };

  useEffect(() => {
    const fetchSpo2Data = async () => {
      if (!selectedPatientEmail) return;

      try {
        const response = await fetch(
          `https://localhost:443/fitbitData/spo2?email=${selectedPatientEmail}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();

        //Check if Spo2 data is available
        if (!res.minutes || res.minutes.length === 0) {
          console.warn("No Spo2 data available for selected patient.");
          setChartData({
            labels: [],
            datasets: [
              {
                label: "Spo2",
                data: [],
              },
            ],
          });
          return;
        }

        const data = res.minutes;
        const values = data.map((item) => item.value);
        const minutes = data.map((item) =>
          new Date(item.minute).toLocaleTimeString()
        );

        setChartData({
          labels: minutes,
          datasets: [
            {
              label: "Spo2",
              data: values,
              borderColor: "rgba(137, 196, 244)",
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching spo2 data:", error);
      }
    };
    fetchSpo2Data();
  }, [selectedPatientEmail]);

  return (
    <div className="spo2-card">
      <span className="card-header">
        <h4>Oxygen Saturation</h4>
        <i className="material-symbols-outlined">spo2</i>
      </span>
      <div className="card-content">
        <Line data={chartData} options={options} height={300} width={400} />
      </div>
    </div>
  );
}
