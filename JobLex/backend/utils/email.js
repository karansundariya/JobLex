const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // your gmail address
        pass: process.env.EMAIL_PASS  // your gmail app password
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };
    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail; 