//Parses POST request with user sign up information 
const parseSignUpRequest = (req, res, next) => {
    //Values are sent as strings as they are pulled from localstorage
    //so they require parsing before database ingestion
    var lastUpdate = JSON.parse(req.body.lastUpdate);
    var testState = JSON.parse(req.body.testState);

    //Value for cards may be "" which won't be parsed by JSON.parse
    //if cards are empty, false should be stored
    var cards;
    try {
        cards = JSON.parse(req.body.cards);
    } catch {
        cards = false;
    }

    //Emails stored as lowercase to simplify searching
    res.locals.user = {
        name: req.body.name,
        university: req.body.university,
        department: req.body.department,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        cards: cards,
        testState: testState ? testState : { complete: false, result: null },
        lastUpdate: lastUpdate === "NaN" ? Date.now() : lastUpdate,
    };
    next();
}

//Utility function to check if a given username stored in res.locals.user.email
//already exists in the database
//This is used both during user signup and when updating email addresses
const checkIfUserExists = (req, res, next) => {
    req.db
        .collection("users")
        .findOne({ email: res.locals.user.email})
        .then((result) => {
            console.log("Result, User found:", result);
            res.locals.userExists = result === null ? false : true;
            next();
        })
        .catch((err) => next(err));
} 

//Adds user to the database if they don't already exist
//otherwise returns an error
const signUpIndex = (req, res, next) => {
    //Email is taken
    if (res.locals.userExists) {
        var formResponse = {
            userCreated: false,
            errorCode: 1,
            error: "Email taken",
        };
        res.json(formResponse);
        return;
    }

    //Add user to database and redirect to profile page
    req.db.collection("users").insertOne(res.locals.user, (err, result) => {
        var insertedId = result.ops[0]._id;
        if (err) next(err);
        req.login({_id: insertedId}, (err) => {
            if (err) {
                next(err)
                return
            }
            var formResponse = { userCreated: true };
            res.json(formResponse);
            return;
        })
    });
}

module.exports = {
    signUpIndex,
    parseSignUpRequest,
    checkIfUserExists
}
