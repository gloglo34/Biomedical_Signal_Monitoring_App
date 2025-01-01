import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function StepsCard() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        labels: "Steps",
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
          text: "Steps",
        },
      },
    },
  };

  useEffect(() => {
    const fetchStepsData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/fitbitData/steps?email=gloriazhou34@gmail.com`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();
        const data = res["activities-steps-intraday"].dataset;
        const times = data.map((item) => item.time);
        const values = data.map((item) => item.value);

        setChartData({
          labels: times,
          datasets: [
            {
              labels: "Steps",
              data: values,
              backgroundColor: "rgba(137, 196, 244)",
              borderRadius: 2,
            },
          ],
        });
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchStepsData();
  }, []);

  return (
    <div className="steps-card">
      <span className="card-header">
        <h4>Steps</h4>
        <i className="material-symbols-outlined">footprint</i>
      </span>
      <div className="card-content">
        <Bar data={chartData} options={options} width={400} height={200} />
      </div>
    </div>
  );
}
