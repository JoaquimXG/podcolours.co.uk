const log = require('../logs/logger')

//Sets loggedin value to false if the user was loggedin
module.exports = (req, res) => {
    if (req.user) {
        log.info(`Successful logout - User: ${req.user.email}`, {route: "logout", action: "success"})
        req.logout()
        res.json({success: true})
    }
    else {
        res.json({success: false})
        log.warn("Bad Logout - User not signed in", {route: "logout", action: "failure"})
    }
}
