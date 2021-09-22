require('dotenv').config();
const {sendHtmlEmail} = require("../functions/sendEmail")

module.exports = (emailRecipient, token, name) => {
    const emailData = {
        from: "info@podcolours.co.uk",
        subject: "Reset your Pod Colours password",
        to: emailRecipient
    };
    //TODO Remove hardcoded URL
    var link = `http://podcolours.co.uk/passwordreset/reset?token=${token}&email=${emailRecipient}`;

    sendHtmlEmail(emailData,  __dirname + "/passwordResetEmail.ejs", { link: link, name: name }, )
};
