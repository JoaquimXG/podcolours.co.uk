const log = require("../logs/logger");

module.exports = (req, res, next) => {
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
        next("Error 403: Access Denied")
        return;
    }

    res.locals.header = {
        logout: true,
        testButton: false,
    };

    //Add two query promises to array to be resolved in parallel
    queryPromiseArray = [];
    //Query for page content
    queryPromiseArray.push(
        req.db
            .collection("content")
            .findOne({ _id: "/" }, { _id: 0, content: 1 })
    );
    //Query for user content
    queryPromiseArray.push(
        req.db.collection("users").findOne({ email: email })
    );

    //Wait for both promises to resolve without error
    //then render admin results page including page and user content
    //Otherwise render 500 error page
    Promise.all(queryPromiseArray)
        .then((resultsArray) => {
            res.render(
                "pages/adminUserResults",
                parseResultsArray(req, res, resultsArray)
            );
        })
        .catch((err) => {
            next(err);
        });
};

//Parses results of Promises from Database queries ready for input
//to admin results page
function parseResultsArray(_, res, resultsArray) {
    var content = resultsArray[0].content;
    var profile = resultsArray[1];
    console.log(profile.test.cards.kept)

    return {
        header: res.locals.header,
        content: content,
        profile: profile,
    };
}
