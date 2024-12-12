import express from "express";
import Patient from "../models/Patient.js";
import axios from "axios";
import { refreshAccessToken } from "../controllers/OAuth2Controller.js";

const router = express.Router();

router.get("/devices", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const devicesUrl = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/devices.json`;

  try {
    let accessToken = patient.fitbitAccessToken;

    let respnse = await fetch(devicesUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (respnse.status === 401) {
      console.log("Access token expired. Refreshing...");

      accessToken = await refreshAccessToken(patient);

      respnse = await fetch(devicesUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

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
  const sleepUrl = `https://api.fitbit.com/1.2/user/${patient.fitbitUserId}/sleep/date/today.json`;

  try {
    let accessToken = patient.fitbitAccessToken;

    let respnse = await fetch(sleepUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (respnse.status === 401) {
      console.log("Access token expired. Refreshing...");

      accessToken = await refreshAccessToken(patient);

      respnse = await fetch(sleepUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

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
  const spo2Url = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/spo2/date/today.json`;

  try {
    let accessToken = patient.fitbitAccessToken;

    let respnse = await fetch(spo2Url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (respnse.status === 401) {
      console.log("Access token expired. Refreshing...");

      accessToken = await refreshAccessToken(patient);

      respnse = await fetch(spo2Url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
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

router.get("/heartrate", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const heartrateUrl = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/activities/heart/date/today/1d/15min.json`;

  try {
    let accessToken = patient.fitbitAccessToken;

    let respnse = await fetch(heartrateUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (respnse.status === 401) {
      console.log("Access token expired. Refreshing...");

      accessToken = await refreshAccessToken(patient);

      respnse = await fetch(heartrateUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    if (!respnse.ok) {
      return res.status(respnse.status).json({ error: respnse.statusText });
    }

    const data = await respnse.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching heart rate data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/hrv", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const hrvUrl = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/hrv/date/today/all.json`;

  try {
    let accessToken = patient.fitbitAccessToken;

    let respnse = await fetch(hrvUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (respnse.status === 401) {
      console.log("Access token expired. Refreshing...");

      accessToken = await refreshAccessToken(patient);

      respnse = await fetch(hrvUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    if (!respnse.ok) {
      return res.status(respnse.status).json({ error: respnse.statusText });
    }

    const data = await respnse.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching hrv data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
