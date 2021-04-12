const log = require('../logs/logger')

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
    if (req.user) {
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
    if (!req.user){
        res.json({success: false,
            error: "user not authenticated"})
        log.warn("Test save failed - User not authenticated", 
            {route: "test/saveState", action: "failure"})
        return;
    }

    //Object for database update
    var updateObj = {$set: {
        test: JSON.parse(req.body.test),
    }}

    //Update user test state information
    req.db.collection("users").update({email: req.user.email}, updateObj, (err, _) => {
        if (err) next(err)
        res.json({success: true});
        log.info(`Test save success - User: ${req.user.email}`, 
            {route: "test/saveState", action: "success"})
    });
}

//Parses get requests for test state information
//Used for loading progress of users who are mid-test
const testGetState = (req, res, next) => {
    //Return an error if the user is not logged in
    if (!req.user){
        res.json({success: false,
            error: "user not authenticated"})
        log.warn("Test load failed - User not authenticated", 
            {route: "test/getState", action: "failure"})
        return;
    }
    //Otherwise find the users teststate info and send to frontend
    req.db.collection("users").findOne({email: req.user.email}, (err, result) => {
        if (err) next(err)
        try {
            res.json({
                success: true,
                test: result.test,
                _id: result._id
            });
            log.info(`Test load success - User: ${req.user.email}`, 
                {route: "test/getState", action: "success"})
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

