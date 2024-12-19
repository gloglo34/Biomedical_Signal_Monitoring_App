import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function SleepCard() {
  const [sleepChartData, SetSleepChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sleep",
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/fitbitData/sleep?email=gloriazhou34@gmail.com`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();
        const data = res.sleep[0].levels.data;
        const levels = data.map((item) => {
          switch (item.level) {
            case "wake":
              return 0;
            case "light":
              return 1;
            case "rem":
              return 2;
            case "deep":
              return 3;
            default:
              return null;
          }
        });
        const times = data.map((item) =>
          new Date(item.dateTime).toLocaleTimeString()
        );

        SetSleepChartData({
          labels: times,
          datasets: [
            {
              label: "Sleep",
              data: levels,
              stepped: true,
            },
          ],
        });
      } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
      }
    };
    fetchSleepData();
  }, []);

  return (
    <div className="sleep-card">
      <span className="card-header">
        <h5>Sleep</h5>
        <i className="material-symbols-outlined">bedtime</i>
      </span>
      <div className="card-content">
        <Line data={sleepChartData} width={400} height={200} />
      </div>
    </div>
  );
}
