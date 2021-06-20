const log = require("../logs/logger");

module.exports = (req, res, next) => {
    //Redirect user to homepage if they are not signed in
    if (!req.user) {
        res.redirect("/?loginModal=1");
        log.warn("Access Denied - User not logged in", {
            route: "admin",
            action: "failure",
        });
        return;
    }

    if (!req.user.isAdmin) {
        log.warn("Access Denied - User not admin", {
            route: "admin",
            action: "failure",
        });
        next("Error 403: Access Denied")
        return;
    }

    //Add two query promises to array to be resolved in parallel
    queryPromiseArray = [];
    //Query for page content
    queryPromiseArray.push(
        req.db
            .collection("content")
            .findOne({ _id: "/" }, { _id: 0, content: 1 })
    );

    queryPromiseArray.push(
        req.db
            .collection("users")
        .find({}, {name: 1, email: 1, test: {result: 1, timeComplete: 1}})
    )

    //Wait for both promises to resolve without error
    //then render profile page including page and user content
    //Otherwise render 500 error page
    Promise.all(queryPromiseArray)
        .then(async (resultsArray) => {
            res.render(
                "pages/admin",
                await parseAdminResultsArray(resultsArray)
            );
        })
        .catch((err) => {
            next(err);
        });
};

async function parseAdminResultsArray(resultsArray) {
    var content = resultsArray[0].content;
    var users = await resultsArray[1].toArray()
    
    var header = {
        logout: true,
        testButton: false
    };

    return {
        content: content,
        header: header,
        users: users
    }
}
