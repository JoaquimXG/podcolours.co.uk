require('dotenv').config();
const nodemailer = require("nodemailer");
let ejs = require("ejs");

//SendInBlue connection details for sending email
//Password kept in .env file
const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 465,
    secure: true,
    auth: {
        user: "joaquim.q.gomez@gmail.com",
        pass: process.env.SMTPSECRET,
    },
});

const messageTemplate = {
    from: "info@podcolours.co.uk",
    subject: "Reset your Pod Colours password",
};

module.exports = (emailRecipient, token, name) => {
    var link = `http://localhost:8080/passwordreset/reset?token=${token}&email=${emailRecipient}`;

    var emailData = messageTemplate;
    emailData.to = emailRecipient;

    ejs.renderFile(
        __dirname + "/passwordResetEmail.ejs",
        { link: link, name: name },
        {},
        (_, str) => {
            emailData.html = str;
            transporter.sendMail(emailData);
        }
    );
};
