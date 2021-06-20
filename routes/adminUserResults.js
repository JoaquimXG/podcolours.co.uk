const log = require("../logs/logger");
const ejs = require("ejs");
var puppeteer = require('puppeteer');

module.exports = {
    adminUserResults,
    resultsAsPdfOrHtml,
};

function adminUserResults(req, res, next) {
    var email = req.params.email;

    //Redirect user to homepage if they are not signed in
    if (!req.user) {
        res.redirect("/?loginModal=1");
        log.warn("Access Denied - User not logged in", {
            route: "admin/:email",
            action: "failure",
        });
        return;
    }

    if (!req.user.isAdmin) {
        log.warn("Access Denied - User not admin", {
            route: "admin/:email",
            action: "failure",
        });
        next("Error 403: Access Denied");
        return;
    }

    res.locals.header = {
        logout: true,
        testButton: false,
    };

    //Add two query promises to array to be resolved in parallel
    res.locals.queryPromiseArray = [];
    //Query for page content
    res.locals.queryPromiseArray.push(
        req.db
            .collection("content")
            .findOne({ _id: "/" }, { _id: 0, content: 1 })
    );
    //Query for user content
    res.locals.queryPromiseArray.push(
        req.db.collection("users").findOne({ email: email })
    );

    next();
}

function resultsAsPdfOrHtml(req, res, next) {
    //Wait for both promises to resolve without error
    //then render admin results page including page and user content
    //Otherwise render 500 error page
    Promise.all(res.locals.queryPromiseArray)
        .then(async (resultsArray) => {
            var content = parseResultsArray(req, res, resultsArray);
            if (req.query.asPdf === "1") {
                await renderHtmlAndGeneratePdf(content, res);
                return;
            }
            res.render("pages/adminUserResults", content);
            return
        })
        .catch((err) => {
            next(err);
        });
}

async function renderHtmlAndGeneratePdf(content, res) {
    var html = await ejs.renderFile(
        __dirname + "/../views/pages/adminUserResults.ejs",
        content
    );

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(`${html}`, {waitUntil: 'networkidle0'});
    const pdf = await page.pdf({ format: 'A4' });

    await browser.close();
    res.contentType("application/pdf")
    res.send(pdf)
}

//Parses results of Promises from Database queries ready for input
//to admin results page
function parseResultsArray(_, res, resultsArray) {
    var content = resultsArray[0].content;
    var profile = resultsArray[1];

    return {
        header: res.locals.header,
        content: content,
        profile: profile,
    };
}
