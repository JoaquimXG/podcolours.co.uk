const testIndex = (req, res, next) => {
    header = {
        login: true,
        testButton: {
            class: "buttonBlue",
            onClick: "this.blur()",
            text: "Save your Progress",
            id: "saveResultsHeaderButton",
        },
    };
    if (req.session.loggedin) {
        header.login = false;
        header.profile = true;
    }

    req.db.collection("content").findOne(
        { _id: "/" },
        { _id: 0, content: 1 },
        (err, queryRes) => {
            if (err) next(err);
            try {
                res.render("pages/test", {
                    header: header,
                    content: queryRes.content,
                });
            } catch (err) {
                next(err)
            }
        }
    );
}

const testSaveState = (req, res, next) => {
    if (!req.session.loggedin){
        res.json({success: false,
            error: "user not authenticated"})
        return;
    }

    var lastUpdate = JSON.parse(req.body.lastUpdate)
    var testState = JSON.parse(req.body.testState)

    var updateObj = {$set: {
        cards: JSON.parse(req.body.cards),
        testState: testState,
        lastUpdate: lastUpdate == "NaN" ? Date.now() : lastUpdate,
    }}

    req.db.collection("users").update({email: req.session.email}, updateObj, (err, _) => {
        if (err) next(err)
        res.json({success: true});
    });
}

const testGetState = (req, res, next) => {
    if (!req.session.loggedin){
        res.json({success: false,
            error: "user not authenticated"})
        return;
    }
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

