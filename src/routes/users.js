var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");

const notificationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: "Too many requests. Please try again later." },
  headers: true,
});
router.post("/sendNotification", notificationLimiter, async (req, res) => {
  try {
    const { name, mobile, email } = req.body;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saburali26048@gmail.com", 
        pass: process.env.API_KEY_MAIL,     
      },
    });

    let mailOptions = {
      from: "saburali26048@gmail.com",
      to: "sksabur.org@gmail.com", 
      subject: "New Connection Request",
      text: `Hey! Sabur Find the new conncetion request below.\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nThank You`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: "Notification sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send notification" });
  }
});
router.get("/details", notificationLimiter, async (req, res) => {
  const queryParam = req.query.project;
  res.json({ details: queryParam });
});


module.exports = router;
