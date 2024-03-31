const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'battlefiesta07@gmail.com',
        pass: process.env.gmail_password
    }
});

const sendemail = async (receiver,sub, message) => {
    const mailOptions = {
        from: 'BookStore <battlefiesta07@gmail.com>',
        to: receiver,
        subject: sub,
        text: message
    };

    // Return a promise
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                // Reject the promise with the error
                // console.log("error:",error);
                reject(error);
            } else {
                // Resolve the promise with true
                // console.log("Email Sent successfully");
                resolve(true);
            }
        });
    });
}

module.exports = sendemail;