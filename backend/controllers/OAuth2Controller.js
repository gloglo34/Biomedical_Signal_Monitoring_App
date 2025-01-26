import axios from "axios";
import qs from "qs";
import Patient from "../models/Patient.js";

export const exchangeAuthorizationCode = async (code, patientEmail) => {
  const clientCredentials = Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.post(
      "https://api.fitbit.com/oauth2/token",
      qs.stringify({
        grant_type: "authorization_code",
        redirect_uri: "https://localhost:443/oauth2/callback",
        code,
      }),
      {
        headers: {
          Authorization: `Basic ${clientCredentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Access Token Response:", response.data);

    //Extract token details
    const { access_token, refresh_token, user_id, scope, expires_in } =
      response.data;

    //Update the database with received tokens
    const patient = await Patient.findOne({ email: patientEmail });
    if (patient) {
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error exchanging authorization code:",
      error.response?.data || error.message
    );
    throw new Error("Failed to exchange authorization code.");
  }
};

export const refreshAccessToken = async (patient) => {
  const clientCredentials = Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.post(
      "https://api.fitbit.com/oauth2/token",
      qs.stringify({
        grant_type: "refresh_token",
        refresh_token: patient.fitbitRefreshToken,
      }),
      {
        headers: {
          Authorization: `Basic ${clientCredentials}`,
        },
      }
    );
    console.log("Refreshed Token Response: ", response.data);

    const { access_token, refresh_token, expires_in } = response.data;

    patient.fitbitAccessToken = access_token;
    patient.fitbitRefreshToken = refresh_token;
    patient.tokenExpiresIn = expires_in;
    await patient.save();

    return access_token;
  } catch (error) {
    console.error(
      "Error refreshing access token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to refresh access token.");
  }
};
