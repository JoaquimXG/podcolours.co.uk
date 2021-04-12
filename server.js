require('dotenv').config();
const log = require('./logs/logger')

//All middleware is handled out of server.js
const prepareMiddleware = require("./middleware/index");

//Routes
const home = require("./routes/home");
const { testIndex, testSaveState, testGetState } = require("./routes/test");
const handleGetCeleb = require("./routes/getPeople");
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

const app = prepareMiddleware();

//Home Page
app.get("/", home);

//Personality test page
app.get("/test", testIndex);

//API endpoint to save current test state
app.post("/test/saveState", testSaveState);

//API endpoint to retrieve current test state from database
app.get("/test/getState", testGetState);

//API endpoint to retreive random celeb
app.post("/test/getpeople", handleGetCeleb);

//User profile page
app.get("/profile", profile);

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

//404 Page for all other routes
app.get("*", fourZeroFour);

//Custom server error 500 handler
app.use(errorHandler);

log.debug(`Listening on ${process.env.APPPORT ? process.env.APPPORT : 8080}`)
app.listen(process.env.APPPORT ? process.env.APPPORT : 8080);
