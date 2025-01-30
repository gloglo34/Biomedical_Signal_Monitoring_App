import express, { json } from "express";
import HeartRate from "../models/HeartRate.js";
import HRV from "../models/HRV.js";
import Spo2 from "../models/Spo2.js";

const router = express.Router();

router.get("/heartrate", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Patient email is required." });
  }

  try {
    //Get today's date and calculate the date 2 days ago
    const today = new Date();
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);

    // Fetch heart rate data for the last 3 days
    const heartRateData = await HeartRate.find({
      email,
      date: { $gte: threeDaysAgo.toISOString().slice(0, 10) },
    }).sort({ date: 1 });

    //Structure the response
    const response = {
      restingHeartRate: heartRateData.map((record) => ({
        date: record.date,
        restingHeartRate: record.restingHeartRate || null,
      })),
      intraday: heartRateData.map((record) => ({
        date: record.date,
        intraday: record.intraday,
      })),
    };
    console.log("Retriveing hr data from db");

    res.json(response);
  } catch (error) {
    console.error("Error fetching heart rate data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/hrv", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Patient email is reqired." });
  }

  try {
    //Get today's date and calculate the date 2 days ago
    const today = new Date();
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);

    //Fetch HRV data for last 3 days
    const hrvData = await HRV.find({
      email,
      date: { $gte: threeDaysAgo.toISOString().slice(0, 10) },
    }).sort({ date: 1 });

    //Structure the response
    const response = {
      hrv: hrvData.map((record) => ({
        date: record.date,
        minutes: record.minutes.map((entry) => ({
          time: entry.minute,
          rmssd: entry.value.rmssd,
          coverage: entry.value.coverage,
          hf: entry.value.hf,
          lf: entry.value.lf,
        })),
      })),
    };
    res.json(response);
  } catch (error) {
    console.error(`Error fetching HRV data:`, error);
    res.status(500), json({ error: "Internal server error" });
  }
});

router.get("/spo2", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    res.status(400).json({ error: "Patient email is required" });
  }

  try {
    //Get today's date and calculate the date 3 days ago
    const today = new Date();
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);

    //Fetch spo2 data for last 3 days
    const spo2Data = await Spo2.find({
      email,
      date: { $gte: threeDaysAgo.toISOString().slice(0, 10) },
    }).sort({ date: 1 });

    //Structure the response
    const response = {
      spo2: spo2Data.map((record) => ({
        date: record.date,
        minutes: record.minutes.map((entry) => ({
          minute: entry.minute,
          value: entry.value,
        })),
      })),
    };
    res.json(response);
  } catch (error) {
    console.error(`Error fetching Spo2 data:`, error);
    res.status(500), json({ error: "Internal server error" });
  }
});

export default router;
