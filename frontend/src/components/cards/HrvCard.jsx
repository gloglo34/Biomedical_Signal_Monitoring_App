import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function HrvCard() {
  const [hrvChartData, setHrvChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "HRV",
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchHrvData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/fitbitData/hrv?email=gloriazhou34@gmail.com`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();
        const data = res.hrv[0].minutes;
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
            },
          ],
        });
      } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
      }
    };
    fetchHrvData();
  }, []);

  return (
    <div className="hrv-card">
      <span className="card-header">
        <h5>HRV</h5>
        <i className="material-symbols-outlined">show_chart</i>
      </span>
      <div className="card-content">
        <Line data={hrvChartData} height={300} width={400} />
      </div>
    </div>
  );
}
