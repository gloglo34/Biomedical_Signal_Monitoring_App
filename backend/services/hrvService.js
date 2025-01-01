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
    const intradayHRV = data.hrv[0]?.minutes || [];

    const hrvData = intradayHRV.map((entry) => ({
      time: entry.minute,
      rmssd: entry.value.rmssd,
      coverage: entry.value.coverage,
      hf: entry.value.hf,
      lf: entry.value.lf,
    }));

    await HRV.updateOne(
      { email, date },
      { email, date, intraday: hrvData },
      { upsert: true }
    );
    console.log(`HRV data saved for patient ${fitbitUserId} on ${date}`);
  } catch (error) {
    console.error(`Error saving HRV data for ${email} on ${date}`);
  }
}
