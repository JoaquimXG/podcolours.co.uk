const log = require('../logs/logger')
const bcrypt = require('bcrypt')

//Parses POST request with user sign up information 
const parseSignUpRequest = async (req, res, next) => {
    //Test state
    var test = JSON.parse(req.body.test)

    //Hash password before storing
    var hash = await bcrypt.hash(req.body.password, 10)

    //Emails stored as lowercase to simplify searching
    res.locals.user = {
        name: req.body.name,
        university: req.body.university,
        department: req.body.department,
        email: req.body.email.toLowerCase(),
        hash: hash,
        test: test,
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
        log.warn(`Bad User Sign-up - Email Taken: ${res.locals.user.email}`)
        res.json(formResponse);
        return;
    }

    //Add user to database and redirect to profile page
    req.db.collection("users").insertOne(res.locals.user, (err, result) => {
        if (err) next(err);
        var newUserId = result.ops[0]._id;
        var newUserEmail = result.ops[0].email;
        req.login({_id: newUserId, email: newUserEmail}, (err) => {
            if (err) {
                next(err)
                return
            }
            log.info(`Successful User Sign-up - User: ${newUserEmail}`)
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
