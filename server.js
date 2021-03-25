const express = require("express");
const app = express();

//Express extensions
app.use(express.static("public"));
app.set("view engine", "ejs");
//Future usage for login system

//Routes
//Home Page
app.get("/", (_, res) => {
    res.render("pages/index")
});

app.listen(8080);
