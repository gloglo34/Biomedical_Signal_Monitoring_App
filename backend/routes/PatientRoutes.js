import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();
// This route gets all patients added by the user, along with their authorization status
router.get("/", async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: "User email is required." });
  }

  try {
    const patients = await Patient.find(
      { addedBy: userEmail },
      { email: 1, authorizationStatus: 1, _id: 0 }
    );

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients." });
  }
});

export default router;
