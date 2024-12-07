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
        redirect_uri: "http://localhost:5000/oauth2/callback",
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
