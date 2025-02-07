import nodemailer from "nodemailer";
import Patient from "../models/Patient.js";

export const sendEmail = async (req, res) => {
  const { receivingEmail, userEmail } = req.body;

  if (!receivingEmail || !userEmail) {
    return res
      .status(400)
      .json({ error: "Receiving email and user email are required." });
  }

  try {
    // Find or create patient
    const existingPatient = await Patient.findOne({ email: receivingEmail });
    let emailContent;
    let patientId;

    if (!existingPatient) {
      // Create a new patient
      const newPatient = new Patient({
        email: receivingEmail,
        authorizationStatus: "Pending",
        addedBy: [userEmail],
      });
      await newPatient.save();
      patientId = newPatient._id;

      // Generate email content for new patient
      const redirect_uri = encodeURIComponent(
        `https://localhost:443/oauth2/callback`
      );

      const fitbitAuthURL = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${redirect_uri}&scope=activity+cardio_fitness+electrocardiogram+heartrate+irregular_rhythm_notifications+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&state=${patientId}`;

      emailContent = {
        subject: "Utanostraz Authorization Request",
        text: `Hi, please authorize access to your Fitbit data by clicking the following link: ${fitbitAuthURL}`,
        html: `<p>Hi,</p>
              <p>Please authorize access to your Fitbit data by clicking the link below:</p>
              <a href="${fitbitAuthURL}">${fitbitAuthURL}</a>`,
      };

      // Send the email for the new patient
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.APP_EMAIL,
        to: receivingEmail,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Email sent successfully" });
    } else {
      patientId = existingPatient._id;

      // Check if the user already added the patient
      if (!existingPatient.addedBy.includes(userEmail)) {
        existingPatient.addedBy.push(userEmail);
        await existingPatient.save();
      }

      // Determine response based on authorization status
      if (existingPatient.authorizationStatus === "Pending") {
        return res
          .status(200)
          .json({ message: `The patient is already awaiting authorization` });
      } else if (existingPatient.authorizationStatus === "Authorized") {
        return res.status(200).json({
          message: `The patient is already authorized.`,
        });
      }
    }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
