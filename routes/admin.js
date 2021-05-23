const log = require("../logs/logger");

module.exports = (req, res, next) => {
    //TODO check if user is logged in and is an admin

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
        .find({}, {name: 1, email: 1, test: {cards: {kept: 1, discarded: 1}, complete: 1, result: 1}})
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
    
    users.forEach(user => console.log(user))

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
