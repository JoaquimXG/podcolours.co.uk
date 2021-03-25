const express = require("express");
const app = express();

//Express extensions
app.use(express.static("public"));
app.set("view engine", "ejs");
//Future usage for login system

//Routes
//Home Page
app.get("/", (_, res) => {
    header = {"secondButton": {
        "class" : "buttonSuccess",
        "onClick": "location.href='/test'",
        "text": "Take the Test",
        "id": "testButton"
    }}
    res.render("pages/index", {header: header})
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

app.listen(8080);
