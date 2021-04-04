const mongo = require('./mongo')
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

module.exports = (opts) => {
    //Include MongoDB as express middleware
    app.use(mongo(opts.mongoUrl))

    //Express extensions
    app.use(express.static("public"));
    app.set("view engine", "ejs");
    app.use(
        session({
            secret: "a+VT+Vt4V+Y7EoLHatwfPDauKGMBygejiZNNEPwZP0g",
            saveUninitialized: true,
            resave: true,
        })
    );

    app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );
    return app;
}

