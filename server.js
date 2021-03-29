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
    //Redirect user to homepage if they are not signed in
    //TODO open login modal using a get/post parameter handled 
    //with some basic javascript on the index page

    //Counts the number of each colour that has been kept
    //to dispay to the user. 
    function countKeptCards(cards) {
        cardCounts = {};
        for (const color in cards) {
            cardCounts[color] = cards[color].filter(card => {
                return card.isKept === 'true';
            }).length
        }
        return cardCounts;
    }

    if (!req.session.loggedin ) {
        res.redirect("/")
    }

    header = {
        login: false,
        secondButton: {
        class : "buttonSuccess",
        onClick: "location.href='/test'",
        text: "Continue",
        id: "testButton"
    }};

    queryPromiseArray = [];
    queryPromiseArray.push(db.collection('content').findOne({_id: "/"}, {_id: 0, content:1}));
    queryPromiseArray.push(db.collection('users').findOne({username:req.session.email}))

    Promise.all(queryPromiseArray)
        .then((resultsArray) => {
            content = resultsArray[0].content;
            profile = resultsArray[1]

            cardCounts = countKeptCards(profile.cards)
            profile.cardCountString = `Red: ${cardCounts.red}, \
Blue: ${cardCounts.blue}, \
Green: ${cardCounts.green}, \
Yellow: ${cardCounts.yellow}`

            temp = JSON.parse(JSON.stringify(profile))
            profile.pre = temp
            res.render("pages/profile", {
                header: header,
                content: content,
                profile: profile })
        })
        //TODO When are errors generated here? How to handle them?
        .catch((err) => console.log(`Error getting profile from db ${err}`))
})

app.post("/signup", async (req, res) => {
    user = {
        username: req.body.email,
        password: req.body.password,
        cards: req.body.cards
    }

    //Add user to database and redirect to profile page
    //TODO, check if username is already taken and return an error if it has
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


