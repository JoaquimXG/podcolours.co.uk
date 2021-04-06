//Sets loggedin value to false if the user was loggedin
module.exports = (req, res) => {
    if (req.session.loggedin) {
        req.session.loggedin = false;
        res.json({success: true})
    }
    else {
        res.json({success: false})
    }
}
