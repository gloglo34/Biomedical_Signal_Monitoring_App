import { useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
import { usePatientData } from "../../hooks/usePatientData";
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
  const {
    data: patientData,
    isLoading,
    error,
  } = usePatientData(selectedPatientEmail);

  //Process heart rate data for the chart
  const heartRateData =
    patientData?.heartrate["activities-heart-intraday"].dataset || [];
  const times = heartRateData.map((item) => item.time);
  const values = heartRateData.map((item) => item.value);

  const restingHeartRate =
    patientData?.heartrate?.["activities-heart"]?.[0]?.value
      ?.restingHeartRate || "N/A";

  const chartData = {
    labels: times,
    datasets: [
      {
        label: "Heart Rate (bpm)",
        data: values,
        tension: 0.3,
        borderColor: "rgba(137, 196, 244)",
        fill: false,
      },
    ],
  };

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

  if (isLoading) {
    return (
      <div className="hr-card">
        <h4>Heart Rate</h4>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hr-card">
        <h4>Heart Rate</h4>
        <p>Error loading data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="hr-card">
      <span className="card-header">
        <h4>Heart Rate</h4>
        <i className="material-symbols-outlined">monitor_heart</i>
      </span>
      <div className="card-content">
        <p>Resting heart rate : {restingHeartRate}</p>
        {heartRateData.length > 0 ? (
          <Line data={chartData} options={options} height={300} width={400} />
        ) : (
          <p>No heart rate data available.</p>
        )}
      </div>
    </div>
  );
}
