source .env
#mongo admin --port $MONGOPORT -u $MONGOUSER -p $MONGOPASSWORD --authenticationDatabase $AUTHSOURCE <<EOF
mongo admin --port $MONGOPORT <<EOF
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
