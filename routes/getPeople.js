const log = require('../logs/logger')

//Handler for genearting random person from a list of
//people of a given personality type
module.exports=(req, res, next)=> {
    //Takes a colour in request from frontend
    var testResult = req.body.result

    //Find array of people in database with matching colour
    log.debug("Searching for famous people with result", testResult)
    req.db.collection("people").findOne({_id: testResult}, (err, result) => {
        if (err) next(err)
        log.debug("error: ", err, "result: ", result)

        if (result) {
            //Selects random famous person from the array pulled from database
            var person = result.people[Math.floor(Math.random() * result.people.length)];
            res.send(JSON.stringify({success: true, person: person}))
            log.info(`Famous person (${person}) generated for ${testResult}`,
                {route: "/test/getPeople", action: "failure"})
        }
        else {
            log.warn(`No famous people found for ${testResult}`,
                {route: "/test/getPeople", action: "failure"})
            next("No famous people found")
        }
    })
}
