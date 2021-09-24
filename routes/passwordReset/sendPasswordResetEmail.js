require('dotenv').config();
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

    sendHtmlEmail(emailData,  __dirname + "/passwordResetEmail.ejs", { link: link, name: name }, )
};
