const log = require('../../logs/logger')
const bcrypt = require('bcrypt')

//Sets loggedin value to false if the user was loggedin
module.exports = async (req, res) => {
    var user = await req.db.collection("users").findOne({ email: req.query.email})

    if (user === null) {
        //TODO render expiry page
        res.json({canReset: false, message: "Token Expired"})
        log.info(`Attemp to reach password reset form with bad email. User not found : ${req.body.email}`,
            {route: "passwordreset/reset", action: "failure"})
        return
    }

    if (user.resetTokenExpires < Date.now()) {
        //TODO render expiry page
        res.json({canReset: false, message: "Token Expired"})
        log.info(`Reset password token expired: ${req.body.email}`,
            {route: "passwordreset/reset", action: "failure"})
        return;
    }

    //TODO render reset page
    res.send({canReset: true, message: "Token not expired"})
    return
}
