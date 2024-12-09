import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

router.get("/devices", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const devicesUrl = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/devices.json`;

  try {
    const respnse = await fetch(devicesUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${patient.fitbitAccessToken}`,
      },
    });
    if (!respnse.ok) {
      return res.status(respnse.status).json({ error: respnse.statusText });
    }

    const data = await respnse.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching devices data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/sleep", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const sleepUrl = `https://api.fitbit.com/1.2/user/${patient.fitbitUserId}/sleep/date/2024-12-01.json`;

  try {
    const respnse = await fetch(sleepUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${patient.fitbitAccessToken}`,
      },
    });
    if (!respnse.ok) {
      return res.status(respnse.status).json({ error: respnse.statusText });
    }

    const data = await respnse.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching sleep data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/spo2", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const spo2Url = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/spo2/date/2024-12-01.json`;

  try {
    const respnse = await fetch(spo2Url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${patient.fitbitAccessToken}`,
      },
    });
    if (!respnse.ok) {
      return res.status(respnse.status).json({ error: respnse.statusText });
    }

    const data = await respnse.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching spo2 data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
