require("dotenv").config();
const log = require("../logs/logger");

//This site is published as a read-only public archive of previous work.
//Archive mode strips out everything that stores or processes personal data -
//sessions, cookies, logins, sign-ups and password resets - while leaving the
//frontend looking exactly as it did.
//
//It is ON unless explicitly switched off, so a deployment that forgets to set
//the variable stays safe. Set ARCHIVEMODE=false to restore the full site.
const isArchiveMode = process.env.ARCHIVEMODE !== "false";

//Stands in for a route that has been switched off.
//GET requests are passed along so they fall through to the normal 404 page -
//a visitor following an old link should see the site's own "page not found"
//rather than a lump of JSON. Anything else is a form post from the frontend,
//which gets a response in the shape that page's javascript already expects,
//plus an "archived" flag it can use to explain itself to the user.
function archiveDisabled(responseBody) {
    return (req, res, next) => {
        if (req.method === "GET") {
            return next();
        }
        log.info(`Blocked ${req.method} ${req.originalUrl} - archive mode`, {
            route: "archiveMode",
            action: "blocked",
        });
        res.json({ ...responseBody, archived: true });
    };
}

module.exports = {
    isArchiveMode,
    archiveDisabled,
};
