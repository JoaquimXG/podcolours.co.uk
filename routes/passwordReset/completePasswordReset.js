const log = require('../../logs/logger')
const bcrypt = require('bcrypt')

//Sets loggedin value to false if the user was loggedin
module.exports = async (req, res) => {
    var user = await req.db.collection("users").findOne({email: req.body.email})

    //Check if email was found
    if (user === null) {
        res.sendStatus(403)
        log.info(`Can't complete reset, wrong email: ${req.body.email}`,
            {route: "passwordreset/reset", action: "failure"})
        return
    }

    //Check if token has expired
    if (user.resetTokenExpires < Date.now()) {
        res.sendStatus(403)
        log.info(`Reset password token expired: ${req.body.email}`,
            {route: "passwordreset/reset", action: "failure"})
        return;
    }

    //Check if token is a match
    var isMatch = await bcrypt.compare(req.body.token, user.resetTokenHash) 
    if (!isMatch) {
        res.sendStatus(403)
        return;
    }

    //All checks have passed, password can be reset
    var updateObj = {$set: {
        hash: await bcrypt.hash(req.body.password, 10),
        resetTokenExpires: Date.now()
    }}

    req.db.collection("users").update({email: req.body.email}, updateObj, (err, _) => { 
        if (err) next(err)
        res.sendStatus(200);
    })
}
