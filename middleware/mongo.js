var MongoClient = require('mongodb').MongoClient;

module.exports = (mongoUrl) => {
    var link;

    return function expressMongoDb(req, _, next) {
        if (!link) {
            link = MongoClient.connect(mongoUrl);
        }
        link
            .then((db) => {
                req.db = db;
                next();
            })
            .catch((err) => {
                connection = undefined;
                next(err);
            });
    };
};
