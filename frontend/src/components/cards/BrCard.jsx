import { useEffect, useState, useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  scales,
} from "chart.js";

ChartJS.register(LinearScale, CategoryScale, BarElement, Tooltip);

export default function BrCard() {
  const { selectedPatientEmail } = useContext(PatientContext);
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
      if (!selectedPatientEmail) return;

      try {
        const response = await fetch(
          `https://localhost:443/fitbitData/br?email=${selectedPatientEmail}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();

        //Check if the br array is empty
        if (!res.br || res.br.length === 0) {
          console.warn("No BR data available for the selected patient");
          setChartData({
            labels: ["Deep", "REM", "Full", "Light"],
            datasets: [
              {
                label: "Breathing Rate (bpm)",
                data: [0, 0, 0, 0], // Empty data
                backgroundColor: "rgba(137, 196, 244)",
                borderRadius: 5,
              },
            ],
          });
          return;
        }

        const data = res.br[0]?.value || {};

        // Extract sleep stages and breathing rates
        const sleepStages = ["Deep", "REM", "Full", "Light"];

        const breathingRates = [
          data.deepSleepSummary?.breathingRate || null,
          data.remSleepSummary?.breathingRate !== -1
            ? data.remSleepSummary?.breathingRate
            : null,
          data.fullSleepSummary?.breathingRate || null,
          data.lightSleepSummary?.breathingRate || null,
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
  }, [selectedPatientEmail]);

  return (
    <div className="br-card">
      <span className="card-header">
        <h4>Breathing Rate</h4>
        <i className="material-symbols-outlined">pulmonology</i>
      </span>
      <div className="card-content">
        <Bar data={chartData} options={options} width={400} height={200} />
      </div>
    </div>
  );
}
