import Spo2 from "../models/Spo2.js";
import { refreshAccessToken } from "../controllers/OAuth2Controller.js";

export async function saveSpo2(patient, date) {
  const spo2Url = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/spo2/date/${date}/all.json`;

  try {
    const accessToken = patient.fitbitAccessToken;

    let response = await fetch(spo2Url, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      console.log(`Access token expired for ${patient.email}. Refreshing...`);
      const newAccessToken = await refreshAccessToken(patient);
      response = await fetch(spo2Url, {
        method: "GET",
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });
    }

    if (!response.ok) {
      throw new Error("Failed to fetch spo2 data");
    }

    const data = await response.json();
    const minutes = data.minutes || [];

    //Save spo2 data to database
    await Spo2.updateOne(
      { email: patient.email, date },
      { email: patient.email, date, minutes },
      { upsert: true }
    );

    console.log(`Spo2 data saved for ${patient.email} on ${date}`);
  } catch (error) {
    console.error(
      `Error saving Spo2 data for ${patient.email} on ${date}:`,
      error.message
    );
  }
}
