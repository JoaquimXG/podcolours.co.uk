const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

//Use default mongo url or first command line arg
mongoUrl = process.argv[2] ? process.argv[2] : "mongodb://localhost:27017/podcolours"
console.log(`=== Connection: ${mongoUrl} ===`)

//Express extensions
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(session({
    secret: "a+VT+Vt4V+Y7EoLHatwfPDauKGMBygejiZNNEPwZP0g",
    saveUninitialized: true,
    resave: true,
}))
app.use(bodyParser.urlencoded({
  extended: true
}))

var db;
MongoClient.connect(mongoUrl, (err, database) => {
  if (err) throw err;
  db = database;
  app.listen(8080);
  console.log('Listening on port 8080');
});

//Routes
//Home Page
app.get("/", (_, res) => {
    header = {
        login: true,
        secondButton: {
        class : "buttonSuccess",
        onClick: "location.href='/test'",
        text: "Take the Test",
        "id": "testButton"
    }};

    db.collection('content').findOne({_id: "/"}, {_id: 0, content:1}, (err, queryRes) => {
        //TODO render error page on database error
        if (err) throw err
        res.render("pages/index", {header: header, content: queryRes.content })
    });
});

//Personality test page
app.get("/test", (_, res) => {
    header = {
        login: true,
        secondButton: {
        class : "buttonBlue",
        onClick: "",
        text: "Save your Progress",
        id: "saveResultsHeaderButton"
    }}
    db.collection('content').findOne({_id: "/"}, {_id: 0, content:1}, (err, queryRes) => {
        //TODO render error page on database error
        if (err) throw err
        res.render("pages/app", {header: header, content: queryRes.content })
    });
})

//User profile page
app.get("/profile", (req, res) => {
    //TODO, check if user is logged in
    header = {
        login: false,
        secondButton: {
        class : "buttonSuccess",
        onClick: "location.href='/test'",
        text: "Take the Test",
        id: "testButton"
    }};

    profile = {
        email: req.session.email,
        pre: req.session
    }
    db.collection('content').findOne({_id: "/"}, {_id: 0, content:1}, (err, queryRes) => {
        //TODO render error page on database error
        if (err) throw err
        res.render("pages/profile", {header: header, content: queryRes.content, profile })
    });

})

app.post("/signup", async (req, res) => {
    user = {
        username: req.body.email,
        password: req.body.password,
        cards: req.body.cards
    }

    //Add user to database and redirect to profile page
    db.collection('users').save(user, (err, _) =>  {
        if(err) throw err;
        req.session.email = user.username
        req.session.loggedin = true;
        formResponse = {userCreated: true}
        res.json(formResponse)
    })

})

//Login handler
app.post("/postlogin", (req, res) => {
    var email = req.body.email
    var password = req.body.password

    //Find user in database
    db.collection('users').findOne({"username":email}, (err, result) => {
        //TODO render error page on database error
        if (err) throw err;

        formResponse = {
            badPassword: false,
            badusername: false,
            loggedin: false
        };

        //No result due to username/email not found in db
        if(!result){
            formResponse.badusername = true;
            res.json(formResponse)
            return
        }

        //Successful login
        if(result.password === password) { 
            req.session.loggedin = true;
            req.session.email = email;
            formResponse.loggedin = true;
            res.json(formResponse) 
            return;
        } else {
            //Password incorrect
            formResponse.badPassword = true;
            res.json(formResponse)
        }
    });
})


