const log = require("../../logs/logger");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendPasswordResetEmail = require("./sendPasswordResetEmail");

//Sets loggedin value to false if the user was loggedin
module.exports = async (req, res) => {
    var user = await req.db
        .collection("users")
        .findOne({ email: req.body.email });

    if (user === null) {
        res.sendStatus(200);
        log.info(
            `Password Reset failed to initiate. User not found : ${req.body.email}`,
            { route: "passwordreset/initiate", action: "failure" }
        );
        return;
    }

    var token = crypto.randomBytes(20).toString("hex");
    var tokenHash = await bcrypt.hash(token, 2);

    //Object to update values in database
    var updateObj = {
        $set: {
            resetTokenHash: tokenHash,
            resetTokenExpires: Date.now() + 1000 * 60 * 30,
        },
    };

    req.db
        .collection("users")
        .update({ email: req.body.email }, updateObj, (err, _) => {
            if (err) next(err);
            sendPasswordResetEmail(req.body.email, token, user.name);
            res.sendStatus(200);
            log.info(`Password reset initiated for ${req.body.email}`, {
                route: "passwordreset/initiate",
                action: "success",
            });
        });
};
