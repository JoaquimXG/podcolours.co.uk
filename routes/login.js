var passport = require('../middleware/passport')
const log = require('../logs/logger')

//Parses a POST login request assessing whether user can login
//returns an object with boolean values allowing for a
//responsive frontend form
//Login logic is handled with passport js 
module.exports = (req, res, next) => {
    //Using passportJS for authentication using 'local' strategy
    //Function is called by password during login and passed the 
    //result of the local strategy function call in middleware/passport.js
    //if a user is returned the api will respnd with loggedin as true
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            next(err)
            return
        }

        var formResponse = {
            badPassword: false,
            bademail: false,
            loggedin: false,
        };

        if (!user) {
            if (info.errorCode === 2){
                formResponse.badPassword = true;
            }
            if (info.errorCode === 1) {
                formResponse.bademail = true;
            }
            res.json(formResponse)
            log.warn(`Bad Login ${info.message} - User: ${req.body.email}`, {route: "login", action: "failure"})
            return
        }

        req.login(user, (err) => {
            if (err) {
                next(err)
                return
            }
            formResponse.loggedin = true;
            res.json(formResponse)
            log.info(`Successful Login - User: ${user.email}`, {route: "login", action: "failure"})
            return;
        })
    })(req, res, next);
}
