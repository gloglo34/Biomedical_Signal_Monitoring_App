import express from "express";
import Alert from "../models/Alert.js";

const router = express.Router();

router.get("/alerts", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find all alerts for provided email, sorted by timestamp(latest first)
    const alerts = await Alert.find({ email }).sort({ timestamp: -1 });

    // Return the alerts
    res.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/alerts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;

    const alert = await Alert.findByIdAndUpdate(id, { read }, { new: true });
    res.json(alert);
  } catch (error) {
    console.error("Error updating alert:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
