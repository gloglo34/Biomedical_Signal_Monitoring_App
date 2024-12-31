import express from "express";
import HeartRate from "../models/HeartRate.js";

const router = express.Router();

router.get("/heartrate", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Patient email is required." });
  }

  try {
    //Get today's date and calculate the date 2 days ago
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);

    // Fetch heart rate data for the last 3 days
    const heartRateData = await HeartRate.find({
      email,
      date: { $gte: sevenDaysAgo.toISOString().slice(0, 10) },
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

    res.json(response);
  } catch (error) {
    console.error("Error fetching heart rate data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
