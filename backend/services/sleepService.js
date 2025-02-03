import Sleep from "../models/Sleep.js";
import { refreshAccessToken } from "../controllers/OAuth2Controller.js";

export async function saveSleep(patient, date) {
  const sleepUrl = `https://api.fitbit.com/1.2/user/${patient.fitbitUserId}/sleep/date/today.json`;

  try {
    const accessToken = patient.fitbitAccessToken;

    let response = await fetch(sleepUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      console.log(`Access token expired for ${patient.email}. Refreshing...`);
      const newAccessToken = await refreshAccessToken(patient);
      response = await fetch(sleepUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });
    }

    if (!response.ok) {
      throw new Error("Failed to fetch HRV data");
    }

    const data = await response.json();
    const sleepData = data.sleep;

    // Validate and extract main sleep
    if (!sleepData || sleepData.length === 0) {
      console.log(`No sleep data found for ${patient.email} on ${date}`);
      return;
    }

    const mainSleep = sleepData.find((record) => record.isMainSleep);

    const levelsData = mainSleep.levels?.data || [];
    const duration = mainSleep.duration || null;

    await Sleep.updateOne(
      { email: patient.email, date },
      { email: patient.email, date, levelsData, duration },
      { upsert: true }
    );

    console.log(
      `Sleep data for ${patient.email} on ${date} saved successfully.`
    );
  } catch (error) {
    console.error(
      `Error saving sleep data for ${patient.email} on ${date}:`,
      error
    );
  }
}
