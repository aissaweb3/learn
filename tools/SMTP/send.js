//require('dotenv').config(); // Load environment variables from .env file
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email from .env
    pass: process.env.EMAIL_PASS // your password from .env
  }
});

// Email options
let mailOptions = {
  from: process.env.EMAIL_USER, // sender address
  to: 'recipient-email@example.com', // list of receivers
  subject: 'Test Email', // Subject line
  text: 'Hello, this is a test email!', // plain text body
  // html: '<b>Hello, this is a test email!</b>' // html body (optional)
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error occurred:', error.message);
    return process.exit(1);
  }
  
  console.log('Email sent successfully!');
});
