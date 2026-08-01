require('dotenv').config();
const log = require("../../logs/logger")
const {sendHtmlEmail} = require("../functions/sendEmail")

module.exports = (emailRecipient, token, name, hostname) => {
    const emailData = {
        from: "info@podcolours.co.uk",
        subject: "Reset your Pod Colours password",
        to: emailRecipient
    };

    var protocol = "http://"
    var port = process.env.APPPORT
    if (process.env.HTTPS == "true") {
        protocol = 'https://'
        port = process.env.APPPORTHTTPS
    }
    var link = `${protocol}${hostname}:${port}/passwordreset/reset?token=${token}&email=${emailRecipient}`;

    //Sent without awaiting - the reset request has already been acknowledged,
    //so a mail failure is logged rather than left to reject unhandled
    sendHtmlEmail(emailData,  __dirname + "/passwordResetEmail.ejs", { link: link, name: name }, )
        .catch((err) => log.error(`Failed to send password reset email to ${emailRecipient}`, err))
};
