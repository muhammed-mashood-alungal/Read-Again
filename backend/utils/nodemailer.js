const nodemailer = require('nodemailer')
 const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, 
    secure: true,
    auth: {
      user: "muhdmashoodalungal@gmail.com",
      pass: "quns zfdw afxf uhfz ",
    },
  });
module.exports = transporter
