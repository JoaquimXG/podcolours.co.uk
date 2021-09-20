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

module.exports = (emailData, ejsTemplate, templateQueries) => {
    ejs.renderFile(
        ejsTemplate,
        templateQueries,
        {},
        (_, str) => {
            emailData.html = str;
            transporter.sendMail(emailData)
                .then((info) => log.info(info.response))
        }
    );
};
