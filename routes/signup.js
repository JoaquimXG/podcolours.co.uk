const parseSignUpRequest = (req, res, next) => {
    var lastUpdate = JSON.parse(req.body.lastUpdate);
    var testState = JSON.parse(req.body.testState);
    var cards;

    try {
        cards = JSON.parse(req.body.cards);
    } catch {
        cards = false;
    }

    res.locals.user = {
        username: req.body.email,
        password: req.body.password,
        cards: cards,
        testState: testState ? testState : { complete: false, result: null },
        lastUpdate: lastUpdate === "NaN" ? Date.now() : lastUpdate,
    };
    next();
}

const checkIfUserExists = (req, res, next) => {
    req.db
        .collection("users")
        .findOne({ username: req.body.email })
        .then((result) => {
            console.log("Result, User found:", result);
            res.locals.userExists = result === null ? false : true;
            next();
        })
        .catch((err) => next(err));
} 

const signUpIndex = (req, res, next) => {
    //Username is taken
    if (res.locals.userExists) {
        formResponse = {
            userCreated: false,
            errorCode: 1,
            error: "Username taken",
        };
        res.json(formResponse);
        return;
    }
    //Add user to database and redirect to profile page
    req.db.collection("users").save(res.locals.user, (err, _) => {
        if (err) next(err);
        try {
            req.session.email = res.locals.user.username;
            req.session.loggedin = true;
            formResponse = { userCreated: true };
            res.json(formResponse);
        } catch (err) {
            next(err);
        }
    });
}

module.exports = {
    signUpIndex,
    parseSignUpRequest,
    checkIfUserExists
}
