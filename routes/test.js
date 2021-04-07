//Checks if user is logged in to edit header buttons
//Pulls content from the database to display on the page
const testIndex = (req, res, next) => {
    res.locals.header = {
        login: true,
        testButton: {
            class: "buttonBlue",
            onClick: "this.blur()",
            text: "Save your Progress",
            id: "saveResultsHeaderButton",
        },
    };
    if (req.session.loggedin) {
        res.locals.header.login = false;
        res.locals.header.profile = true;
    }

    req.db.collection("content").findOne(
        { _id: "/" },
        { _id: 0, content: 1 },
        (err, queryRes) => {
            if (err) next(err);
            try {
                res.render("pages/test", {
                    header: res.locals.header,
                    content: queryRes.content,
                });
            } catch (err) {
                next(err)
            }
        }
    );
}

//Handles POST requests with test data
const testSaveState = (req, res, next) => {
    //Notifies the frontend if the user is not logged in
    if (!req.session.loggedin){
        res.json({success: false,
            error: "user not authenticated"})
        return;
    }

    //Variables are stored in localstorage as strings
    //and not converted to JSON before being sent 
    var lastUpdate = JSON.parse(req.body.lastUpdate)
    var testState = JSON.parse(req.body.testState)

    //Object for database update
    var updateObj = {$set: {
        cards: JSON.parse(req.body.cards),
        testState: testState,
        lastUpdate: lastUpdate == "NaN" ? Date.now() : lastUpdate,
    }}

    //Update user test state information
    req.db.collection("users").update({email: req.session.email}, updateObj, (err, _) => {
        if (err) next(err)
        res.json({success: true});
    });
}

//Parses get requests for test state information
//Used for loading progress of users who are mid-test
const testGetState = (req, res, next) => {
    //Return an error if the user is not logged in
    if (!req.session.loggedin){
        res.json({success: false,
            error: "user not authenticated"})
        return;
    }
    //Otherwise find the users teststate info and send to frontend
    req.db.collection("users").findOne({email: req.session.email}, (err, result) => {
        if (err) next(err)
        try {
            res.json({
                success: true,
                cards: result.cards,
                lastUpdate: result.lastUpdate,
                testState: result.testState
            });
        } catch (err) {
            next(err)
        }
    });
}

module.exports = {
    testIndex,
    testSaveState,
    testGetState
}

