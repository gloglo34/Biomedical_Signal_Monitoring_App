import nodemailer from "nodemailer";
import Patient from "../models/Patient.js";

export const sendEmail = async (req, res) => {
  const { receivingEmail } = req.body;

  const redirect_uri = encodeURIComponent(
    `http://localhost:5000/oauth2/callback`
  );

  if (!receivingEmail) {
    return res.status(400).json({ error: "Receiving email is required." });
  }

  try {
    const fitbitAuthURL = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${redirect_uri}&scope=activity+cardio_fitness+electrocardiogram+heartrate+irregular_rhythm_notifications+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight`;

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
      subject: "MediTrack Pro Authorization Request",
      text: `Hi, please authorize access to your fitbit data by clicking the following link:${fitbitAuthURL}`,
      html: `<p>Hi,</p>
          <p>Plase authorize access to your fitbit data by clicking the link below:</p>
          <a href="${fitbitAuthURL}">${fitbitAuthURL}</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });

    try {
      const existingPatient = await Patient.findOne({ email: receivingEmail });
      if (!existingPatient) {
        const newPatient = new Patient({
          email: receivingEmail,
          authorizationStatus: "Pending",
        });
        await newPatient.save();
        console.log("Patient saved to database");
      }
      console.log("Patient already in databse");
    } catch (dbError) {
      console.error("Error saving patient to database:", dbError);
      return res
        .status(500)
        .json({ error: "Failed to save patient to the database." });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
