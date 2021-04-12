var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')

//Serialises user object in preparation for storing in the sessions database
passport.serializeUser(function(user, done) {
    done(null, {_id: user._id, email: user.email});
});

//Function is intended to converted the serialised from the stored session 
//back into a user object. To avoid unecessary databse queries, I have stored
//most of the user information we need in the sessions object so no query 
//is performed here and the user object is returned untouched.
passport.deserializeUser(function(user, done) {
    done(null, user);
});

//Locally stored passwords strategy 
//Takes an email and password from post request
//Searches the database for the corresponding email
//Hashes the password if there were results and returns 
//The appropriate user
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
