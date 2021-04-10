require('dotenv').config();

const mongo = require('./mongo')
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const compression = require("compression")
const session = require("express-session");
const MongoStore = require('connect-mongo')
const passport = require('./passport')
const logger = require('./logger')

const app = express();

module.exports = () => {
    var mongoUrl = generateMongoUrl()
    console.log(`=== Connection: ${mongoUrl} ===`);
    //Include MongoDB as express middleware
    app.use(mongo(mongoUrl))

    //Public folder for images, css and js files
    app.use(express.static("public"));

    //gzips files before sending responses to server
    app.use(compression())

    //ejs for templating
    app.set("view engine", "ejs");

    //Express sessions for managing user logins
    app.use(
        session({
            secret: process.env.SESSIONSECRET ? process.env.SESSIONSECRET : "secret",
            resave: true,
            saveUninitialized: true,
            cookie: {maxAge: false},
            store: MongoStore.create({mongoUrl: mongoUrl, crypto: {secret: false}})
        })
    );

    //Initialising passport js with sessions
    app.use(passport.initialize())
    app.use(passport.session())

    //HTTP body parse for handling post requests
    app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );

    //HTTP body parser for json post requests
    app.use(bodyParser.json());
    app.use(cookieParser())

    app.use(logger)
    return app;
}

function generateMongoUrl() {
    var host = process.env.MONGOHOST ? process.env.MONGOHOST : "localhost"
    var port = process.env.MONGOPORT ? process.env.MONGOPORT : 27017
    var database = process.env.MONGODATABASE ? process.env.MONGODATABASE : "podcolours"

    return `mongodb://${host}:${port}/${database}`
}
