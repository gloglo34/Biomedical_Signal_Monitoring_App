import express from "express";
import { exchangeAuthorizationCode } from "../controllers/OAuth2Controller.js";
import Patient from "../models/Patient.js";

const router = express.Router();

//Callback endpoint for handling Fitbit OAuth redirect
router.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    console.error("Authorization code or state is missing.");
    return res
      .status(400)
      .json({ error: "Authorization code or state is missing." });
  }

  try {
    console.log("Authorization code:", code);
    console.log("state:", state);

    const tokens = await exchangeAuthorizationCode(code);
    console.log("Tokens received:", tokens);

    const patient = await Patient.findById(state);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    patient.authorizationStatus = "Authorized";
    patient.fitbitAccessToken = tokens.access_token;
    patient.fitbitRefreshToken = tokens.refresh_token;
    patient.fitbitUserId = tokens.user_id;
    patient.fitbitScopes = tokens.scope;
    patient.tokenExpiresIn = tokens.expires_in;

    await patient.save();

    res.send(`
      <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
        <h1 style="color: green;">Thank You!</h1>
        <p style="font-size: 1.2em;">
          Your authorization was successful. Your caregiver can now access your health data for monitoring purposes.
        </p>
        <p>You may safely close this tab.</p>
      </div>
    `);

    // res.status(200).json({
    //   message: "Authorization successful and patient data updated!",
    //   patient,
    // });
  } catch (error) {
    console.error("Error exchanging authrization code:", error.message);
    res.status(500).send("<h1>Error</h1>");
  }
});

export default router;
