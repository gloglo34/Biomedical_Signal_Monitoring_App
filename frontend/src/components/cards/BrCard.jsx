import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  scales,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(LinearScale, CategoryScale, BarElement, Tooltip);

export default function BrCard() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        labels: "BR",
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
          text: "Breathing rate (bpm)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Sleep stage",
        },
      },
    },
  };

  useEffect(() => {
    const fetchBrData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/fitbitData/br?email=gloriazhou34@gmail.com`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();
        const data = res.br[0].value;

        // Extract sleep stages and breathing rates
        const sleepStages = ["Deep", "REM", "Full", "Light"];

        const breathingRates = [
          data.deepSleepSummary.breathingRate,
          data.remSleepSummary.breathingRate !== -1
            ? data.remSleepSummary.breathingRate
            : null,
          data.fullSleepSummary.breathingRate,
          data.lightSleepSummary.breathingRate,
        ];

        setChartData({
          labels: sleepStages,
          datasets: [
            {
              label: "Breathing Rate (bpm)",
              data: breathingRates,
              backgroundColor: "rgba(137, 196, 244)",
              borderRadius: 5,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching Br Data:", error);
      }
    };
    fetchBrData();
  }, []);

  return (
    <div className="br-card">
      <span className="card-header">
        <h5>Breathing Rate</h5>
        <i className="material-symbols-outlined">pulmonology</i>
      </span>
      <div className="card-content">
        <Bar data={chartData} options={options} width={400} height={200} />
      </div>
    </div>
  );
}
