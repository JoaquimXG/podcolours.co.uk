module.exports = (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;

    //Find user in database
    req.db.collection("users").findOne({ username: email }, (err, result) => {
        if (err) next(err);

        formResponse = {
            badPassword: false,
            badusername: false,
            loggedin: false,
        };

        //No result due to username/email not found in db
        if (!result) {
            formResponse.badusername = true;
            res.json(formResponse);
            return;
        }

        //Successful login
        if (result.password === password) {
            try {
                req.session.loggedin = true;
                req.session.email = email;
                formResponse.loggedin = true;
                res.send(formResponse);
            } catch (err) {
                next(err);
            }
        } else {
            //Password incorrect
            formResponse.badPassword = true;
            res.json(formResponse);
        }
    });
}
