var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')

passport.serializeUser(function(user, done) {
    done(null, {_id: user._id, email: user.email});
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy({
    passReqToCallback: true,
    usernameField: "email",
},
    async function(req, email, password, done) {
        req.db.collection("users").findOne({ email: email }, async (err, result) => {
            if (err) return done(err)
            if (!result) {
                return done(null, false, {errorCode: 1,  message: 'Incorrect username.' });
            }
            var isMatch = await bcrypt.compare(password, result.hash) 
            if (!isMatch) {
                return done(null, false, {errorCode: 2, message: 'Incorrect password.' });
            }
            return done(null, result)
        })
    }
));

module.exports = passport;
