const log = require('../logs/logger')

module.exports = (req, res, next) => {
    log.info({
        req: {
            headers: {
                cookie: req.cookies,
                sessionId: req.sessionID
            },
            method: req.method,
            sessionId: req.sessionId,
            originalUrl: req.originalUrl,
            query: req.query,
            user: req.user

        }
    })
    next()
}
