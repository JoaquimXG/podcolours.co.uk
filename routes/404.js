//Handles wildcard route
module.exports = (_, res) => {
    var error = {
        title: "Oh no, we seem to be lost...",
        text: "404: Page not Found",
        img: "/img/logo.png",
    };
    res.render("pages/error", { error: error });
}
