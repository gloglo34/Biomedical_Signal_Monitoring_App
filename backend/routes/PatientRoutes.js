import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: "User email is required." });
  }

  try {
    const patients = await Patient.find(
      { addedBy: userEmail, authorizationStatus: "Authorized" },
      { email: 1, _id: 0 }
    );

    const p = Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients." });
  }
});

export default router;
