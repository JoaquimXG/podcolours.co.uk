require('dotenv').config();
const log = require('../logs/logger')

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
    var urlDict = generateMongoUrl()
    log.debug(`=== Connection: ${urlDict.urlWithDatabase} ===`);
    //Include MongoDB as express middleware
    app.use(mongo(urlDict.urlWithPassword, urlDict.database))

    //Public folder for images, css and js files
    app.use(express.static("public"));

    //gzips files before sending responses to server
    app.use(compression())

    //ejs for templating
    app.set("view engine", "ejs");

    //Express sessions for managing user logins
    var secret = process.env.SESSIONSECRET ? process.env.SESSIONSECRET : "secret"
    app.use(
        session({
            secret: secret,
            resave: true,
            saveUninitialized: true,
            cookie: {maxAge: false},
            store: MongoStore.create({mongoUrl: urlDict.urlWithPasswordAndDatabase, crypto: {secret: secret}})
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

    var user = process.env.MONGOUSER
    var password = process.env.MONGOPASSWORD
    var authSource = process.env.AUTHSOURCE

    if (!user || !password || !authSource) {
        log.warn("Missing Environment variables for Mongo Authentication - Attempting to connect without authentication")
        var mongoHostUrl = `mongodb://${host}:${port}/`
        var urlWithDatabase = `mongodb://${host}:${port}/${database}`
        var urlWithPassword = mongoHostUrl
        var urlWithPasswordAndDatabase = urlWithDatabase
    } else {
        log.debug(`All variables provided for authenticated mongodb connection - Attempting connection with user ${user}`)
        var mongoHostUrl = `mongodb://${host}:${port}/?authSource=${authSource}`
        var urlWithDatabase = `mongodb://${host}:${port}/${database}?authSource=${authSource}`
        var urlWithPassword = `mongodb://${user}:${password}@${host}:${port}/?authSource=${authSource}`
        var urlWithPasswordAndDatabase = `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=${authSource}`
    }

    return {
        urlWithPassword: urlWithPassword,
        urlWithDatabase: urlWithDatabase,
        urlWithPasswordAndDatabase: urlWithPasswordAndDatabase,
        host: mongoHostUrl,
        database: database
    }
}
