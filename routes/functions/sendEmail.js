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

//Rendering and sending are awaited directly rather than driven from a
//renderFile callback. The callback form returned before the mail had actually
//been sent, and any send failure rejected a promise nobody was holding - which
//takes the whole process down on Node 15 and above.
async function sendHtmlEmail(emailData, ejsTemplate, templateQueries, attachments) {
    emailData.html = await ejs.renderFile(ejsTemplate, templateQueries, {});
    if (attachments) {
        emailData.attachments = attachments
    }
    const info = await transporter.sendMail(emailData)
    log.info(info.response)
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
