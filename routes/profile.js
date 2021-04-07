//Handles get requests for profile page
module.exports = (req, res, next) => {
    //Redirect user to homepage if they are not signed in
    //Homepage is setup to open loginModal automatically with this param
    if (!req.session.loggedin) {
        res.redirect("/?loginModal=1");
        return;
    }

    res.locals.header = {
        logout: true,
        testButton: {
            class: "buttonSuccess",
            onClick: "location.href='/test'",
            text: "Continue",
            id: "testButton",
        },
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
        req.db.collection("users").findOne({ email: req.session.email })
    );

    //Wait for both promises to resolve without error
    //then render profile page including page and user content
    //Otherwise render 500 error page
    Promise.all(queryPromiseArray)
        .then((resultsArray) => {
            res.render("pages/profile", parseProfileResultsArray(req, res, resultsArray))
        })
        .catch((err) => {
            console.log(`Error getting profile from db ${err}`);
            next(err);
        });
}

//Counts the number of each colour that has been kept
//to dispay to the user. LEGACY - Not currently used
function countKeptCards(cards) {
    var colors = ["red", "blue", "green", "yellow"];
    var colorCounts = {}
    try {
        colors.forEach((color) => {
            var count = cards.kept.filter((card)=> card.color == color).length
            colorCounts[color] = count;
        })
        return colorCounts;
    } catch {
        return {red: 0, blue: 0, yellow: 0, green: 0}
    }
}

//Parses results of page and user content queries
function parseProfileResultsArray(req, res, resultsArray){
    var content = resultsArray[0].content;
    var profile = resultsArray[1];

    //Don't display button to continue test in header if
    //the user has already completed the test
    if (profile.testState.complete === true) {
        header.testButton = false;
    } 

     return {
        header: header,
        content: content,
        profile: profile,
    }
}

