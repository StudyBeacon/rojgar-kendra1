require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

sendEmail({
  to: process.env.EMAIL_USER,
  subject: 'Test Email from rojgaar-kendra',
  text: 'This is a test email.'
}).then(() => {
  console.log('Email sent!');
}).catch(err => {
  console.error('Email error:', err);
}); 