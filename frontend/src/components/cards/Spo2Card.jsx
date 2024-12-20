import { useEffect, useState } from "react";
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
      try {
        const response = await fetch(
          `http://localhost:5000/fitbitData/spo2?email=gloriazhou34@gmail.com`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();
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
  }, []);

  return (
    <div className="spo2-card">
      <span className="card-header">
        <h5>Oxygen Saturation</h5>
        <i className="material-symbols-outlined">spo2</i>
      </span>
      <div className="card-content">
        <Line data={chartData} options={options} height={300} width={400} />
      </div>
    </div>
  );
}
