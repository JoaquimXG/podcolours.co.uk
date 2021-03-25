const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const app = express();

//Express extensions
app.use(express.static("public"));
app.set("view engine", "ejs");

var db;
mongoUrl = "mongodb://localhost:27017/podcolours"
MongoClient.connect(mongoUrl, (err, database) => {
  if (err) throw err;
  db = database;
  app.listen(8080);
  console.log('listening on 8080');
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
    res.render("pages/app")
})
