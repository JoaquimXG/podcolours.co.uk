//Counts the number of each colour that has been kept
//to dispay to the user.
function countKeptCards(cards) {
    if (!cards.next) {
        return {red: 0, blue: 0, yellow: 0, green: 0}
    }
    var colors = ["red", "blue", "green", "yellow"];
    var colorCounts = {}
    colors.forEach((color) => {
        var count = cards.kept.filter((card)=> card.color == color).length
        colorCounts[color] = count;
    })
    return colorCounts;
}

module.exports = (req, res, next) => {
    //Redirect user to homepage if they are not signed in
    //Homepage is setup to open loginModal automatically with this param
    if (!req.session.loggedin) {
        res.redirect("/?loginModal=1");
        return;
    }

    header = {
        login: false,
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
        req.db.collection("users").findOne({ username: req.session.email })
    );

    //Wait for both promises to resolve without error
    Promise.all(queryPromiseArray)
        .then((resultsArray) => {
            content = resultsArray[0].content;
            profile = resultsArray[1];
            cards = profile.cards;

            //Don't display button to continue test in header if
            //the user has already completed the test
            var colorCounts;
            if (profile.testState.complete === true) {
                header.testButton = false;
                colorCounts = cards.colorCounts;
            } else {
                colorCounts = countKeptCards(cards);
            }
            profile.cardCountString = `Red: ${colorCounts.red}, \
Blue: ${colorCounts.blue}, \
Green: ${colorCounts.green}, \
Yellow: ${colorCounts.yellow}`;

            res.render("pages/profile", {
                header: header,
                content: content,
                profile: profile,
            });
        })
        .catch((err) => {
            console.log(`Error getting profile from db ${err}`);
            next(err);
        });
}
