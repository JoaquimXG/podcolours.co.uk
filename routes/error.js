//Error handler
module.exports = (err, req, res, next) =>{
    var text = err
    res.status(500)
    var error = {
        title: "Oh no, we are having trouble with your request. ",
        text: text,
        img: "/img/logo.png"
    }
    res.render("pages/error", {error: error});
}
