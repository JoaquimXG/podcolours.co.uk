require('dotenv').config();
const log = require("../../logs/logger")
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

async function sendHtmlEmail(emailData, ejsTemplate, templateQueries, attachments) {
    await ejs.renderFile(
        ejsTemplate,
        templateQueries,
        {},
        async (_, str) => {
            emailData.html = str;
            if (attachments) {
                emailData.attachments = attachments
            }
            await transporter.sendMail(emailData)
                .then((info) => log.info(info.response))
        }
    );
};

async function sendTextEmail(emailData, text, attachments) {
    emailData.text = text;
    if (attachments) {
        emailData.attachments = attachments
    }
    await transporter.sendMail(emailData)
        .then((info) => log.info(info.response))
}


module.exports = {
    sendTextEmail,
    sendHtmlEmail
}
