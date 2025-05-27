const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "muhdmashoodalungal@gmail.com",
    pass: "ndiz yywp afqh xyzf",
  },
  tls: {
    rejectUnauthorized: false,
  }
});
module.exports = transporter
