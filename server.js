require('dotenv').config();
const log = require('./logs/logger')
const http = require('http')
const https = require('https');
const fs = require('fs');


//All middleware is handled out of server.js
const prepareMiddleware = require("./middleware/index");

//Routes
const home = require("./routes/home");
const { testIndex, testSaveState, testGetState, emailResultsPdf } = require("./routes/test");
const getPeople = require("./routes/getPeople");
const profile = require("./routes/profile");
const {
    signUpIndex,
    parseSignUpRequest,
    checkIfUserExists,
} = require("./routes/signup");
const login = require('./routes/login');
const admin = require("./routes/admin");
const {verifyIsAdmin, adminUserResults, resultsAsPdfOrHtml} = require('./routes/adminUserResults');
const legal = require("./routes/legal");
const fourZeroFour = require('./routes/404');
const errorHandler = require('./routes/error');
const logout = require('./routes/logout');
const {parseUpdateUserRequest, updateUserIndex} = require('./routes/updateuser');
const passwordResetRouter = require('./routes/passwordReset');;

const app = prepareMiddleware();

app.use("/passwordreset", passwordResetRouter);

//Home Page
app.get("/", home);

//Personality test page
app.get("/test", testIndex);

//API endpoint to save current test state
app.post("/test/saveState", testSaveState, adminUserResults, emailResultsPdf);

//API endpoint to retrieve current test state from database
app.get("/test/getState", testGetState);

//API endpoint to retreive random celeb
app.post("/test/getpeople", getPeople);

//User profile page
app.get("/profile", profile);

//Admin page for user results
app.get("/admin", admin);

//Individual results to be viewed by admins
app.get("/adminUserResults/:email", verifyIsAdmin, adminUserResults, resultsAsPdfOrHtml)

//Parse ajax signup request and add user to database if email available
app.post("/signup", parseSignUpRequest, checkIfUserExists, signUpIndex);

//Login handler
app.post("/postlogin", login);

//Update user information in database
app.post("/updateuser", parseUpdateUserRequest, checkIfUserExists, updateUserIndex);

//Allows frontend to check if users is authenticated
//Just returns the boolean used on the backend to denote user login status
app.get("/isauthenticated", (req, res) => {
    res.json({ isAuthenticated: req.user ? true : false });
});

//Handles user logging out
app.get("/logout", logout)

//Legal details page, disclaimer and policies
app.get("/legal", legal)

//404 Page for all other routes
app.get("*", fourZeroFour);

//Custom server error 500 handler
app.use(errorHandler);

var httpPort = process.env.APPPORT ? process.env.APPPORT : 80
var httpsPort = process.env.APPPORTHTTPS ? process.env.APPPORTHTTPS : 443
//app.listen(httpPort);


if (process.env.HTTPS == "true") {
    try {
        const options = {
              key: fs.readFileSync('certificates/privkey.pem'),
              cert: fs.readFileSync('certificates/fullchain.pem')
        };

        log.info("Running with https")
        log.debug(`Listening https on ${httpsPort}`)
        https.createServer(options, app).listen(httpsPort)
    } catch (e) {
        log.error(e)
        log.warn("Unable to start on HTTPS, please check file permissions")
    }
}

log.debug(`Listening http on ${httpPort}`)
http.createServer(app).listen(httpPort)
