import express from "express";
import Patient from "../models/Patient.js";
import { refreshAccessToken } from "../controllers/OAuth2Controller.js";
import NodeCache from "node-cache";
import Alert from "../models/Alert.js";

const myCache = new NodeCache({ stdTTL: 900 });

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
    // console.log(data);
    console.log("Getting device data from API");
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
    // console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching sleep data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Apply caching
router.get("/spo2", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const spo2Url = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/spo2/date/today/all.json`;

  try {
    const cacheKey = `${email}_spo2`;
    if (myCache.has(cacheKey)) {
      console.log("Getting spo2 data from cache");
      return res.json(myCache.get(cacheKey));
    } else {
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
      myCache.set(cacheKey, data);
      // console.log(data);
      console.log("Getting spo2 data from API");
      res.json(data);
    }
  } catch (error) {
    console.error("Error fetching spo2 data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/heartrate", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const heartrateUrl = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/activities/heart/date/today/1d/5min.json`;

  try {
    let accessToken = patient.fitbitAccessToken;

    let respnse = await fetch(heartrateUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    //1) Handle expired tokens
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
    // console.log(data);
    console.log("Getting heartrate data from API");

    //2) Extract heart rate intraday dataset
    const hrData = data["activities-heart-intraday"]?.dataset ?? [];

    //3) Apply threshold logic
    const NORMAL_LOW = 55;
    const NORMAL_HIGH = 100;
    const abnormalReadings = hrData.filter(
      (item) => item.value < NORMAL_LOW || item.value > NORMAL_HIGH
    );

    //4) If abnormal readings are found handle the alert
    if (abnormalReadings.length > 0) {
      for (const reading of abnormalReadings) {
        const existingAlert = await Alert.findOne({
          patientId: patient._id,
          time: reading.time,
          value: reading.value,
        });

        if (!existingAlert) {
          const newAlert = new Alert({
            patientId: patient._id,
            email: patient.email,
            timestamp: new Date(),
            time: reading.time,
            value: reading.value,
            message: `Abnormal heart rate detected: ${reading.value} bpm at ${reading.time}`,
            read: false,
          });
          await newAlert.save();
          console.log("New abnormal heart rate alert saved.");
        } else {
          console.log("Duplicate alert detected. Skipping.");
        }
      }
    }

    //5) Finally return the original heart rate data (for frontend to display the chart)
    res.json(data);
  } catch (error) {
    console.error("Error fetching heart rate data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Apply caching
router.get("/hrv", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const hrvUrl = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/hrv/date/today/all.json`;

  try {
    //check cache for user-specific key
    const cacheKey = `${email}_hrv`;
    if (myCache.has(cacheKey)) {
      console.log("Getting hrv data from cache");
      return res.json(myCache.get(cacheKey));
    } else {
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
      // console.log(data);
      myCache.set(cacheKey, data);
      console.log("Getting hrv data from API");
      res.json(data);
    }
  } catch (error) {
    console.error("Error fetching hrv data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Apply caching
router.get("/profile", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const profileUrl = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/profile.json`;

  try {
    const cacheKey = `${email}_profile`;
    if (myCache.has(cacheKey)) {
      console.log("Getting profile data from cache");
      return res.json(myCache.get(cacheKey));
    } else {
      let accessToken = patient.fitbitAccessToken;

      let respnse = await fetch(profileUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (respnse.status === 401) {
        console.log("Access token expired. Refreshing...");

        accessToken = await refreshAccessToken(patient);

        respnse = await fetch(profileUrl, {
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
      myCache.set(cacheKey, data);
      console.log("Getting profile data from API");
      // console.log(data);
      res.json(data);
    }
  } catch (error) {
    console.error("Error fetching hrv data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/br", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const brUrl = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/br/date/today/all.json`;

  try {
    let accessToken = patient.fitbitAccessToken;

    let respnse = await fetch(brUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (respnse.status === 401) {
      console.log("Access token expired. Refreshing...");

      accessToken = await refreshAccessToken(patient);

      respnse = await fetch(brUrl, {
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
    // console.log(data);
    console.log("Getting br data from API");
    res.json(data);
  } catch (error) {
    console.error("Error fetching br data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/steps", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const stepsUrl = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/activities/steps/date/today/1d/15min.json`;

  try {
    let accessToken = patient.fitbitAccessToken;

    let respnse = await fetch(stepsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (respnse.status === 401) {
      console.log("Access token expired. Refreshing...");

      accessToken = await refreshAccessToken(patient);

      respnse = await fetch(stepsUrl, {
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
    // console.log(data);
    console.log("Getting steps data from API");
    res.json(data);
  } catch (error) {
    console.error("Error fetching br data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Apply caching
router.get("/skinTemp", async (req, res) => {
  const { email } = req.query;
  const patient = await Patient.findOne({ email });
  const skinTempUrl = `https://api.fitbit.com/1/user/${patient.fitbitUserId}/temp/skin/date/today.json`;

  try {
    const cacheKey = `${email}_skinTemp`;
    if (myCache.has(cacheKey)) {
      console.log("Getting skin temp data from cache");
      return res.json(myCache.get(cacheKey));
    } else {
      let accessToken = patient.fitbitAccessToken;

      let respnse = await fetch(skinTempUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (respnse.status === 401) {
        console.log("Access token expired. Refreshing...");

        accessToken = await refreshAccessToken(patient);

        respnse = await fetch(skinTempUrl, {
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
      myCache.set(cacheKey, data);
      console.log("Getting skin temp data from API");
      // console.log(data);
      res.json(data);
    }
  } catch (error) {
    console.error("Error fetching skin temp data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
