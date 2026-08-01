require("dotenv").config();
const log = require("../logs/logger");

const mongo = require("./mongo");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("./passport");
const logger = require("./logger");
const forceHttps = require("./forceHttps");
const { isArchiveMode } = require("./archiveMode");

const app = express();

module.exports = () => {
    var urlDict = generateMongoUrl();
    log.debug(`=== Connection: ${urlDict.urlWithDatabase} ===`);
    //Include MongoDB as express middleware
    app.use(mongo(urlDict.urlWithPassword, urlDict.database));

    //Public folder for images, css and js files
    app.use(express.static("public"));

    //gzips files before sending responses to server
    app.use(compression());

    //ejs for templating
    app.set("view engine", "ejs");

    //Exposed to every template so the views can render the archive banner
    //without each route handler having to pass the flag through
    app.locals.archiveMode = isArchiveMode;

    if (isArchiveMode) {
        //Nothing below this point is mounted in archive mode, so the site
        //sets no cookies at all - no session cookie, and nothing for passport
        //to deserialise. req.user is therefore always undefined, which every
        //route already treats as "logged out".
        log.warn(
            "ARCHIVE MODE - sessions, cookies and logins are disabled. Set ARCHIVEMODE=false to restore them"
        );
        if (process.env.HTTPS == "true") {
            app.enable("trust proxy");
        }
    } else {
        //Express sessions for managing user logins
        var secret = process.env.SESSIONSECRET
            ? process.env.SESSIONSECRET
            : "secret";
        var sess = {
            secret: secret,
            resave: true,
            saveUninitialized: true,
            cookie: { maxAge: false },
            store: MongoStore.create({
                mongoUrl: urlDict.urlWithPasswordAndDatabase,
                crypto: { secret: secret },
            }),
        };
        if (process.env.HTTPS == "true") {
            app.enable("trust proxy");
            sess.cookie.secure = true;
        }
        app.use(session(sess));

        //Initialising passport js with sessions
        app.use(passport.initialize());
        app.use(passport.session());
    }

    //HTTP body parse for handling post requests
    app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );

    //HTTP body parser for json post requests
    app.use(bodyParser.json());

    //Nothing sets a cookie in archive mode, so nothing needs to read one back
    if (!isArchiveMode) {
        app.use(cookieParser());
    }

    //Automatic logging of HTTP requests
    app.use(logger);

    //Force HTTPS, a check is contained to only force HTTPS when
    //HTTPS=true environment variable is set
    app.use(forceHttps);
    return app;
};

function generateMongoUrl() {
    var host = process.env.MONGOHOST ? process.env.MONGOHOST : "localhost";
    var port = process.env.MONGOPORT ? process.env.MONGOPORT : 27017;
    var database = process.env.MONGODATABASE
        ? process.env.MONGODATABASE
        : "podcolours";

    var user = process.env.MONGOUSER;
    var password = process.env.MONGOPASSWORD;
    var authSource = process.env.AUTHSOURCE;

    if (!user || !password || !authSource) {
        log.warn(
            "Missing Environment variables for Mongo Authentication - Attempting to connect without authentication"
        );
        var mongoHostUrl = `mongodb://${host}:${port}/`;
        var urlWithDatabase = `mongodb://${host}:${port}/${database}`;
        var urlWithPassword = mongoHostUrl;
        var urlWithPasswordAndDatabase = urlWithDatabase;
    } else {
        log.debug(
            `All variables provided for authenticated mongodb connection - Attempting connection with user ${user}`
        );
        var mongoHostUrl = `mongodb://${host}:${port}/?authSource=${authSource}`;
        var urlWithDatabase = `mongodb://${host}:${port}/${database}?authSource=${authSource}`;
        var urlWithPassword = `mongodb://${user}:${password}@${host}:${port}/?authSource=${authSource}`;
        var urlWithPasswordAndDatabase = `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=${authSource}`;
    }

    return {
        urlWithPassword: urlWithPassword,
        urlWithDatabase: urlWithDatabase,
        urlWithPasswordAndDatabase: urlWithPasswordAndDatabase,
        host: mongoHostUrl,
        database: database,
    };
}
