const log = require('../logs/logger')

//Handles wildcard route
module.exports = (_, res) => {
    res.status(404)
    var error = {
        title: "Oh no, we seem to be lost...",
        text: "404: Page not Found",
        img: "/img/logo.png",
    };
    res.render("pages/error", { error: error });
    log.warn("404: Page not found", {route: "404", action: "failure", status: 404})
}
