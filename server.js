const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

const {errorHandler, countKeptCards} = require('./serverUtils.js')

//Use default mongo url or first command line arg
mongoUrl = process.argv[2]
    ? process.argv[2]
    : "mongodb://localhost:27017/podcolours";
console.log(`=== Connection: ${mongoUrl} ===`);

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

var db;
MongoClient.connect(mongoUrl, (err, database) => {
    if (err) throw err;
    db = database;
    app.listen(8080);
    console.log("Listening on port 8080");
});

//Routes
//Home Page
app.get("/", (_, res, next) => {
    header = {
        login: true,
        testButton: {
            class: "buttonSuccess",
            onClick: "location.href='/test'",
            text: "Take the Test",
            id: "testButton",
        },
    };

    db.collection("content").findOne(
        { _id: "/" },
        { _id: 0, content: 1 },
        (err, queryRes) => {
            if (err) next(err);
            try {
                res.render("pages/index", {
                    header: header,
                    content: queryRes.content,
                });
            }
            catch (err){
                next(err)
            }
        }
    );
});

//Personality test page
app.get("/test", (_, res, next) => {
    header = {
        login: true,
        testButton: {
            class: "buttonBlue",
            onClick: "",
            text: "Save your Progress",
            id: "saveResultsHeaderButton",
        },
    };
    db.collection("content").findOne(
        { _id: "/" },
        { _id: 0, content: 1 },
        (err, queryRes) => {
            if (err) next(err);
            try {
                res.render("pages/test", {
                    header: header,
                    content: queryRes.content,
                });
            } catch (err) {
                next(err)
            }
        }
    );
});

//API endpoint to save current test state
app.post("/test/saveState", (req, res, next) => {
    if (!req.session.loggedin){
        res.json({success: false,
            error: "user not authenticated"})
        return;
    }

    var lastUpdate = JSON.parse(req.body.lastUpdate)
    var testState = JSON.parse(req.body.testState)

    var updateObj = {$set: {
        cards: JSON.parse(req.body.cards),
        testState: testState,
        lastUpdate: lastUpdate == "NaN" ? Date.now() : lastUpdate,
    }}

    db.collection("users").update({username: req.session.email}, updateObj, (err, _) => {
        if (err) next(err)
        res.json({success: true});
    });
})

//API endpoint to retrieve current test state from database
app.get("/test/getState", (req, res, next) => {
    if (!req.session.loggedin){
        res.json({success: false,
            error: "user not authenticated"})
        return;
    }
    db.collection("users").findOne({username: req.session.email}, (err, result) => {
        if (err) next(err)
        try {
            res.json({
                success: true,
                cards: result.cards,
                lastUpdate: result.lastUpdate,
                testState: result.testState
            });
        } catch (err) {
            next(err)
        }
    });
})

//User profile page
app.get("/profile", (req, res, next) => {
    //Redirect user to homepage if they are not signed in
    //Homepage is setup to open loginModal automatically with this param
    if (!req.session.loggedin) {
        res.redirect("/?loginModal=1");
        return;
    }

    header = {
        login: false,
        testButton: {
            class: "buttonSuccess",
            onClick: "location.href='/test'",
            text: "Continue",
            id: "testButton",
        },
    };

    //Add two query promises to array to be resolved in parallel
    queryPromiseArray = [];
    queryPromiseArray.push(
        db.collection("content").findOne({ _id: "/" }, { _id: 0, content: 1 })
    );
    queryPromiseArray.push(
        db.collection("users").findOne({ username: req.session.email })
    );

    //Wait for both promises to resolve without error
    Promise.all(queryPromiseArray)
        .then((resultsArray) => {
            content = resultsArray[0].content;
            profile = resultsArray[1];
            cards = profile.cards;

            //Don't display button to continue test in header if
            //the user has already completed the test
            var colorCounts;
            if (profile.testState.complete === true) {
                header.testButton = false;
                colorCounts = cards.colorCounts;
            } else {
                colorCounts = countKeptCards(cards);
            }
                profile.cardCountString = `Red: ${colorCounts.red}, \
Blue: ${colorCounts.blue}, \
Green: ${colorCounts.green}, \
Yellow: ${colorCounts.yellow}`;

            res.render("pages/profile", {
                header: header,
                content: content,
                profile: profile,
            });
        })
        .catch((err) => {
            console.log(`Error getting profile from db ${err}`)
            next(err)
        });
});

app.post("/signup", (req, res, next) => {
    var lastUpdate = JSON.parse(req.body.lastUpdate)
    var testState = JSON.parse(req.body.testState)
    var cards;

    try {
        cards = JSON.parse(req.body.cards)
    }
    catch {
        cards = false
    }

    user = {
        username: req.body.email,
        password: req.body.password,
        cards: cards,
        testState: testState ? testState : {complete: false, result: null},
        lastUpdate: lastUpdate === "NaN" ? Date.now() : lastUpdate ,
    };

    //Add user to database and redirect to profile page
    //TODO, check if username is already taken and return an error if it has
    db.collection("users").save(user, (err, _) => {
        if (err) next(err)
        try {
            req.session.email = user.username;
            req.session.loggedin = true;
            formResponse = { userCreated: true };
            res.json(formResponse);
        } catch (err) {
            next(err)
        }
    });
});

//Login handler
app.post("/postlogin", (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;

    //Find user in database
    db.collection("users").findOne({ username: email }, (err, result) => {
        if (err) next(err)

        formResponse = {
            badPassword: false,
            badusername: false,
            loggedin: false,
        };

        //No result due to username/email not found in db
        if (!result) {
            formResponse.badusername = true;
            res.json(formResponse);
            return;
        }

        //Successful login
        if (result.password === password) {
            try {
                req.session.loggedin = true;
                req.session.email = email;
                formResponse.loggedin = true;
                res.send(formResponse);
            } catch (err) {
                next(err)
            }
        } else {
            //Password incorrect
            formResponse.badPassword = true;
            res.json(formResponse);
        }
    });
});

app.get("/isauthenticated", (req, res) => {
    if (req.session.loggedin) {
        var isAuthenticated = true;
    }
    else {
        isAuthenticated = false;
    }
    res.send({isAuthenticated: isAuthenticated})
    return;
})

app.get("*", (_, res) => {
    var error = {
        title: "Oh no, we seem to be lost...",
        text: "404: Page not Found",
        img: "/img/logo.png"
    }
    res.render("pages/error", {error: error});
    return;
})

app.use(errorHandler)
