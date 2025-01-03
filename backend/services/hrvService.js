import HRV from "../models/HRV.js";
import { refreshAccessToken } from "../controllers/OAuth2Controller.js";

export async function saveHRV(patient, date) {
  const hrvUrl = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/hrv/date/${date}/all.json`;

  try {
    const accessToken = patient.fitbitAccessToken;

    let response = await fetch(hrvUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      console.log(`Access token expired for ${patient.email}. Refreshing...`);
      const newAccessToken = await refreshAccessToken(patient);
      response = await fetch(hrvUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });
    }

    if (!response.ok) {
      throw new Error("Failed to fetch HRV data");
    }

    const data = await response.json();
    const minutes = data.hrv[0]?.minutes || [];

    await HRV.updateOne(
      { email: patient.email, date },
      { email: patient.email, date, minutes },
      { upsert: true }
    );
    console.log(`HRV data saved for patient ${patient.email} on ${date}`);
  } catch (error) {
    console.error(`Error saving HRV data for ${patient.email} on ${date}`);
  }
}
