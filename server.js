const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const app = express();

//Express extensions
mongoUrl = process.argv[2] ? process.argv[2] : "mongodb://localhost:27017/podcolours"
console.log(`=== Connection: ${mongoUrl} ===`)
app.use(express.static("public"));
app.set("view engine", "ejs");

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
    header = {"secondButton": {
        "class" : "buttonSuccess",
        "onClick": "location.href='/test'",
        "text": "Take the Test",
        "id": "testButton"
    }};

    content = db.collection('content').findOne({_id: "/"}, {_id: 0, content:1}, (err, queryRes) => {
        //TODO render error page on database error
        if (err) throw err
        res.render("pages/index", {header: header, content: queryRes.content })
    });
});

app.get("/test", (_, res) => {
    header = {"secondButton": {
        "class" : "buttonBlue",
        "onClick": "",
        "text": "Save your Results",
        "id": "saveResultsHeaderButton"
    }}
    content = db.collection('content').findOne({_id: "/"}, {_id: 0, content:1}, (err, queryRes) => {
        //TODO render error page on database error
        if (err) throw err
        res.render("pages/app", {header: header, content: queryRes.content })
    });
})
