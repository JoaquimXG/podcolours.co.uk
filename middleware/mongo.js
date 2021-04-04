var MongoClient = require('mongodb').MongoClient;

module.exports = (mongoUrl) => {
    var connection;

    return function expressMongoDb(req, res, next) {
        if (!connection) {
            connection = MongoClient.connect(mongoUrl);
        }
        connection
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
