const mongo = require('./mongo')
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression")
const session = require("express-session");
const MongoStore = require('connect-mongo')
const passport = require('./passport')

const app = express();

module.exports = (opts) => {
    //Include MongoDB as express middleware
    app.use(mongo(opts.mongoUrl))

    //Public folder for images, css and js files
    app.use(express.static("public"));

    //gzips files before sending responses to server
    app.use(compression())

    //ejs for templating
    app.set("view engine", "ejs");

    //Express sessions for managing user logins
    app.use(
        session({
            //TODO replace secret with session variable
            secret: "a+VT+Vt4V+Y7EoLHatwfPDauKGMBygejiZNNEPwZP0g",
            resave: true,
            saveUninitialized: true,
            cookie: {maxAge: false},
            store: MongoStore.create({mongoUrl: opts.mongoUrl, crypto: {secret: false}})
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
    return app;
}

