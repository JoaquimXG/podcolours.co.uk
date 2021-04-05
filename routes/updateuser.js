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

    res.locals.user = {
        name: req.body.name,
        university: req.body.university,
        department: req.body.department,
        email: req.body.email.toLowerCase(),
    };

    if (req.body.password === "false") {
    } else {
        res.locals.user.password = req.body.password;
    }
    next();
}

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

    var updateObj = {$set: res.locals.user}

    req.db.collection("users").update({email: req.session.email}, updateObj, (err, _) => {
        if (err) next(err)
        req.session.email = res.locals.user.email
        console.log(req.session)
        res.json({userUpdated: true});
    });
}

module.exports = {
    parseUpdateUserRequest,
    updateUserIndex
}
