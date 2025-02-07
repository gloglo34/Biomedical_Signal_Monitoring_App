import { useEffect, useState, useContext } from "react";
import { PatientContext } from "../context/PatientContext";
import "../styles/PatientProfile.css";
import myIcon from "../assets/icon.png";
import { usePatientData } from "../hooks/usePatientData";

export default function PatientProfile() {
  const { selectedPatientEmail } = useContext(PatientContext);
  const { data, isLoading, error } = usePatientData(selectedPatientEmail);

  if (isLoading) return <p>Loading patient data...</p>;
  if (error) return <p>Error fetching data:{error.message}</p>;

  const profile = data?.profile?.user || {};
  const devices = data?.devices?.[0] || {};

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Patient Profile</h2>
        <img src={profile.avatar} className="profile-avatar" />
        <p>
          <strong>First Name: </strong> {profile.firstName || "N/A"}
        </p>
        <p>
          <strong>Last Name: </strong>
          {profile.lastName || "N/A"}
        </p>
        <p>
          <strong>Age: </strong>
          {profile.age || "N/A"}
        </p>
        <p>
          <strong>Gender: </strong> {profile.gender || "N/A"}
        </p>
        <p>
          <strong>Date of Birth:</strong> {profile.dateOfBirth || "N/A"}
        </p>
        <p>
          <strong>Weight: </strong>
          {profile.weight || "N/A"} kg
        </p>
        <p>
          <strong>Height: </strong> {profile.height || "N/A"} cm
        </p>
      </div>

      <div className="device-info">
        <h2>Device Information</h2>

        <img src={myIcon} alt="Fitness tracker icon" className="device-icon" />
        <p>
          <strong>Device: </strong>
          {devices.deviceVersion || "No data"}
        </p>
        <p>
          <strong>Battery Level: </strong>
          {devices.batteryLevel || "No data"}%
        </p>
        <p>
          <strong>Type: </strong>
          {devices.type || "No data"}
        </p>
        <p>
          <strong>Last sync time: </strong>
          {devices.lastSyncTime
            ? new Date(devices.lastSyncTime).toLocaleString()
            : "No data"}
        </p>
      </div>
    </div>
  );
}
