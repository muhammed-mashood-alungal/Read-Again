const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.NODE_MAILER_KEY,
  },
  tls: {
    rejectUnauthorized: false,
  }
});
module.exports = transporter
