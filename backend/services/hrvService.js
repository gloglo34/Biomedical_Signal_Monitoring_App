import HRV from "../models/HRV.js";
import { refreshAccessToken } from "../controllers/OAuth2Controller.js";

export async function saveHRV(email, fitbitUserId, accessToken, date) {
  const hrvUrl = `https://api.fitbit.com/1/user/${fitbitUserId}/hrv/date/${date}/all.json`;

  try {
    let response = await fetch(hrvUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      console.log("Access token expired. Refreshing...");
      accessToken = await refreshAccessToken(fitbitUserId);
      response = await fetch(hrvUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }

    if (!response.ok) {
      throw new Error("Failed to fetch HRV data");
    }

    const data = await response.json();
    const minutes = data.hrv[0]?.minutes || [];

    await HRV.updateOne(
      { email, date },
      { email, date, minutes },
      { upsert: true }
    );
    console.log(`HRV data saved for patient ${fitbitUserId} on ${date}`);
  } catch (error) {
    console.error(`Error saving HRV data for ${email} on ${date}`);
  }
}
