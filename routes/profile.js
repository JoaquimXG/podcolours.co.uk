module.exports = (req, res, next) => {
    //Redirect user to homepage if they are not signed in
    //Homepage is setup to open loginModal automatically with this param
    if (!req.session.loggedin) {
        res.redirect("/?loginModal=1");
        return;
    }

    header = {
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
    queryPromiseArray.push(
        req.db
            .collection("content")
            .findOne({ _id: "/" }, { _id: 0, content: 1 })
    );
    queryPromiseArray.push(
        req.db.collection("users").findOne({ email: req.session.email })
    );

    //Wait for both promises to resolve without error
    Promise.all(queryPromiseArray)
        .then((resultsArray) => parseProfileResultsArray(req, res, resultsArray))
        .catch((err) => {
            console.log(`Error getting profile from db ${err}`);
            next(err);
        });
}

//Counts the number of each colour that has been kept
//to dispay to the user.
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


function parseProfileResultsArray(req, res, resultsArray){
    content = resultsArray[0].content;
    profile = resultsArray[1];
    cards = profile.cards;

    //Don't display button to continue test in header if
    //the user has already completed the test
    if (profile.testState.complete === true) {
        header.testButton = false;
    } 

    res.render("pages/profile", {
        header: header,
        content: content,
        profile: profile,
    });
}

