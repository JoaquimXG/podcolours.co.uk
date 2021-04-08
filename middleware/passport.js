var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(req, id, done) {
    req.db.collection('users').findOne({ _id: id }, (err, result) => {
        if (err) { return done(err); }
        done(null, result);
    });
});

passport.use(new LocalStrategy({
    passReqToCallback: true
},
    function(req, email, password, done) {
        req.db.collection("users").findOne({ email: email }, (err, result) => {
            if (err) return done(err)
            if (!result) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (result.password != password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, result)
        })
    }
));

module.exports = passport;
