//Parses user update POST request
//Similar in structure to the parseSignUpRequest
//Variables are sent as json objects and are therefore 
//automatically parsed
const parseUpdateUserRequest = (req, res, next) => {
    if (!req.session.loggedin) {
        formResponse = {
            userUpdated: false,
            errorCode: 2,
            error: "User not logged in",
        };
        res.json(formResponse);
        return;
    }

    //Emails converted to lowercase before checking 
    //if user exists
    res.locals.user = {
        name: req.body.name,
        university: req.body.university,
        department: req.body.department,
        email: req.body.email.toLowerCase(),
    };

    //If a password was passed it should be included in the update
    //otherwise pass
    if (!req.body.password === "false") {
        res.locals.user.password = req.body.password;
    }
    next();
}

//Updates values for the user if the new email is not taken
const updateUserIndex = (req, res, next) => {
    //If user is updating their email address
    //check if the new one is already taken
    if (res.locals.user.email != req.session.email) {
        if (res.locals.userExists) {
            formResponse = {
                userUpdated: false,
                errorCode: 1,
                error: "Email taken",
            };
            res.json(formResponse);
            return;
        }
    }

    //Object to update values in database
    var updateObj = {$set: res.locals.user}

    //Update user
    req.db.collection("users").update({email: req.session.email}, updateObj, (err, _) => {
        if (err) next(err)
        req.session.email = res.locals.user.email
        res.json({userUpdated: true});
    });
}

module.exports = {
    parseUpdateUserRequest,
    updateUserIndex
}
