const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from:process.env.EMAIL_FROM,
            to,
            subject,
            text
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };
