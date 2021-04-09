var passport = require('passport')

//Parses a POST login request assessing whether user can login
//returns an object with boolean values allowing for a
//responsive frontend form
//Login logic is handled with passport js 
module.exports = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            next(err)
            return
        }
        console.log(info)

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
            return
        }

        req.login(user, (err) => {
            if (err) {
                next(err)
                return
            }
            formResponse.loggedin = true;
            res.json(formResponse)
            return;
        })
    })(req, res, next);
}
