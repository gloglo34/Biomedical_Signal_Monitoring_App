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

export default function HrCard() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Heart Rate",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  });

  useEffect(() => {
    const fetchHeartRateData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/fitbitData/heartrate?email=gloriazhou34@gmail.com`
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
            },
          ],
        });
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchHeartRateData();
  }, []);

  return (
    <div className="hr-card">
      <span className="card-header">
        <h5>Heart Rate</h5>
        <i className="material-symbols-outlined">monitor_heart</i>
      </span>
      <div className="card-content">
        <Line data={chartData} height={300} width={400} />
      </div>
    </div>
  );
}
