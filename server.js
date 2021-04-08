//All middleware is handled out of server.js
const prepareMiddleware = require("./middleware/index");

//Routes
const home = require("./routes/home");
const { testIndex, testSaveState, testGetState } = require("./routes/test");
const profile = require("./routes/profile");
const {
    signUpIndex,
    parseSignUpRequest,
    checkIfUserExists,
} = require("./routes/signup");
const login = require('./routes/login')
const fourZeroFour = require('./routes/404')
const errorHandler = require('./routes/error')
const logout = require('./routes/logout')
const {parseUpdateUserRequest, updateUserIndex} = require('./routes/updateuser')

//Use default mongo url or first command line argument
var mongoUrl = process.argv[2]
    ? process.argv[2]
    : "mongodb://localhost:27017/podcolours";
console.log(`=== Connection: ${mongoUrl} ===`);

const app = prepareMiddleware({ mongoUrl: mongoUrl });
//const passport = require('./middleware/passport')

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize())
app.use(passport.session())

//Home Page
app.get("/", home);

//Personality test page
app.get("/test", testIndex);

//API endpoint to save current test state
app.post("/test/saveState", testSaveState);

//API endpoint to retrieve current test state from database
app.get("/test/getState", testGetState);

//User profile page
app.get("/profile", profile);

//Parse ajax signup request and add user to database if email available
app.post("/signup", parseSignUpRequest, checkIfUserExists, signUpIndex);

//Login handler
app.post("/", login);

function postLoginHandler(req, res, next) {
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
    })(req, res, next)
}

app.post("/postlogin", postLoginHandler, (req, res, next) => {
    console.log("after request")
})

//Update user information in database
app.post("/updateuser", parseUpdateUserRequest, checkIfUserExists, updateUserIndex);

//Allows frontend to check if users is authenticated
//Just returns the boolean used on the backend to denote user login status
app.get("/isauthenticated", (req, res) => {
    res.send({ isAuthenticated: req.session.loggedin });
});

//Handles user logging out
app.get("/logout", logout)

//404 Page for all other routes
app.get("*", fourZeroFour);

//Custom server error 500 handler
app.use(errorHandler);

//TODO change to 80 when deploying for coursework
app.listen(8080);
