var MongoClient = require('mongodb').MongoClient;

//Custom middleware allows MongoDB client to be accessable
//in all routes in any file through the request object
module.exports = (mongoUrl, databaseName) => {
    var link;

    //Returns a function to be used as middleware for express
    return function expressMongoDb(req, _, next) {
        if (!link) {
            link = MongoClient.connect(mongoUrl);
        }
        link
            .then((db) => {
                req.db = db.db(databaseName);
                next();
            })
            .catch((err) => {
                connection = undefined;
                next(err);
            });
    };
};
