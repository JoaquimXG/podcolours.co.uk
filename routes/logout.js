//Sets loggedin value to false if the user was loggedin
module.exports = (req, res) => {
    if (req.user) {
        req.logout()
        res.json({success: true})
    }
    else {
        res.json({success: false})
    }
}
