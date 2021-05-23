const log = require('../../logs/logger')
const bcrypt = require('bcrypt')
const renderTokenExpired = require('./renderTokenExpired');

//Sets loggedin value to false if the user was loggedin
module.exports = async (req, res) => {
    var user = await req.db.collection("users").findOne({ email: req.query.email})

    //Check if user exists
    if (user === null) {
        renderTokenExpired(res);
        log.info(`Attemp to reach password reset form with bad email. User not found : ${req.body.email}`,
            {route: "passwordreset/reset", action: "failure"})
        return
    }

    //Check if token expired
    if (user.resetTokenExpires < Date.now()) {
        renderTokenExpired(res);
        log.info(`Reset password token expired: ${req.body.email}`,
            {route: "passwordreset/reset", action: "failure"})
        return;
    }

    //Check if token is a match
    var isMatch = await bcrypt.compare(req.query.token, user.resetTokenHash) 
    if (!isMatch) {
        renderTokenExpired(res);
        log.info(`Reset Password token doesn't match: ${req.body.email}`,
            {route: "passwordreset/reset", action: "failure"})
        return;
    }

    //Render reset page if all checks have passed
    res.render("pages/passwordReset");
    log.info(`Reset Password page rendered: ${req.body.email}`,
        {route: "passwordreset/reset", action: "success"})
}
