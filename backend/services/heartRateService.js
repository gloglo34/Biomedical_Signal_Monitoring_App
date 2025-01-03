import HeartRate from "../models/HeartRate.js";
import { refreshAccessToken } from "../controllers/OAuth2Controller.js";

export async function saveHeartRate(patient, date) {
  const heartRateUrl = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/activities/heart/date/${date}/1d/5min.json`;

  try {
    const accessToken = patient.fitbitAccessToken;

    let response = await fetch(heartRateUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      console.log(`Access token expired for ${patient.email}. Refreshing...`);
      const newAccessToken = await refreshAccessToken(patient);
      response = await fetch(heartRateUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });
    }

    if (!response.ok) {
      throw new Error("Failed to fetch heart rate data");
    }

    const data = await response.json();
    const restingHeartRate =
      data["activities-heart"][0]?.value?.restingHeartRate || null;
    const intraday = data["activities-heart-intraday"]?.dataset || [];

    await HeartRate.updateOne(
      { email: patient.email, date },
      { email: patient.email, date, restingHeartRate, intraday },
      { upsert: true } //Create a new document if none exists
    );

    console.log(
      `Heart rate data saved for patient ${patient.email} on ${date}`
    );
  } catch (error) {
    console.error(
      `Error saving heart rate data for ${patient.email} on ${date}:`,
      error
    );
  }
}
