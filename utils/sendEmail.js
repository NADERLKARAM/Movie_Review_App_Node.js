const nodemailer = require("nodemailer");

const sendEmail = async(options) =>{
      // 1) Create transporter ( service that will send email like  "mailtrap")
     const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.PASSWORD
        }
      });
  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: 'Movie app <naedrkamal4@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transport.sendMail(mailOpts);
};

module.exports = sendEmail;