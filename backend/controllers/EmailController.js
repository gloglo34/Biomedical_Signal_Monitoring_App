import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  const { receivingEmail } = req.body;

  if (!receivingEmail) {
    return res.status(400).json({ error: "Receiving email is required." });
  }

  try {
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
      subject: "MediTrack Pro Notification",
      text: "Hi, this is a test email from MediTrack Pro",
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
