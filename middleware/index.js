const mongo = require('./mongo')
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo')

const app = express();

module.exports = (opts) => {
    //Include MongoDB as express middleware
    app.use(mongo(opts.mongoUrl))

    //Public folder for images, css and js files
    app.use(express.static("public"));

    //ejs for templating
    app.set("view engine", "ejs");

    //Express sessions for managing user logins
    app.use(
        session({
            secret: "a+VT+Vt4V+Y7EoLHatwfPDauKGMBygejiZNNEPwZP0g",
            resave: true,
            saveUninitialized: true,
            store: MongoStore.create({mongoUrl: opts.mongoUrl})
        })
    );

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

