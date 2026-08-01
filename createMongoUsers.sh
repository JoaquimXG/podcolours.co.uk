source .env
#mongosh admin --port $MONGOPORT -u $MONGOUSER -p $MONGOPASSWORD --authenticationDatabase $AUTHSOURCE <<EOF
mongosh admin --port $MONGOPORT <<EOF
use admin;
db.createUser({user: "$MONGOUSER", pwd: "$MONGOPASSWORD", roles: [
    {
        role: "readWrite", db: "$MONGODATABASE"
    },{
        role: "dbAdmin", db: "$MONGODATABASE"
    }, {
        role: "root", db: "admin"
    }
]})
EOF
