const log = require('../logs/logger')

//Error handler, utilised to handle all express error paths
module.exports = (err, req, res, next) =>{
    var text = err
    res.status(500)
    var error = {
        title: "Oh no, we are having trouble with your request. ",
        text: text,
        img: "/img/logo.png"
    }
    log.error(`500: ${text}`, {status: 500})
    res.render("pages/error", {error: error});
}
