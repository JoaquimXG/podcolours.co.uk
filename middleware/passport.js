var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

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
    function(req, email, password, done) {
        req.db.collection("users").findOne({ email: email }, (err, result) => {
            if (err) return done(err)
            if (!result) {
                return done(null, false, {errorCode: 1,  message: 'Incorrect username.' });
            }
            if (result.password != password) {
                return done(null, false, {errorCode: 2, message: 'Incorrect password.' });
            }
            return done(null, result)
        })
    }
));

module.exports = passport;
