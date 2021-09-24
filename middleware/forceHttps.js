require('dotenv').config();
const log = require('../logs/logger')


//Redirects all HTTP requsts to HTTPS if the HTTPS=true is set
//This will only work if 'trust proxy' is enabled for the app
//This should be done outside of this function
module.exports = (req, res, next) => {

    if (process.env.HTTPS == "true" && !req.secure) {
        log.warn("Insecure HTTP request made, redirecting to HTTPS")
        return res.redirect("https://" + req.headers.host + req.url);
    }

    next();
}
