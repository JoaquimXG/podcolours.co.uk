const log = require('../logs/logger')

//Sets loggedin value to false if the user was loggedin
module.exports = (req, res) => {
    if (req.user) {
        log.info(`Successful logout - User: ${req.user.email}`)
        req.logout()
        res.json({success: true})
    }
    else {
        log.warn("Bad Logout - User not signed in")
        res.json({success: false})
    }
}
