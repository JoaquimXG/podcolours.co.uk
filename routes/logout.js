module.exports = (req, res) => {
    if (req.session.loggedin) {
        req.session.loggedin = false;
        res.json({success: true})
    }
    else {
        res.json({success: false})
    }
}
