import express from "express";
import { exchangeAuthorizationCode } from "../controllers/OAuth2Controller.js";

const router = express.Router();

//Callback endpoint for handling Fitbit OAuth redirect
router.get("/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    console.error("Authorization code is missing.");
    return res.status(400).json({ error: "Authorization code is missing." });
  }

  try {
    console.log("Authorization code:", code);

    const tokens = await exchangeAuthorizationCode(code);
    console.log("Tokens received:", tokens);

    res.send("<h1>Thank you</h1>");
  } catch (error) {
    console.error("Error exchanging authrization code:", error.message);
    res.status(500).send("<h1>Error</h1>");
  }
});

export default router;
