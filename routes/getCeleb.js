module.exports=(req, res, next)=> {
    var colourResult = req.query.result
    console.log(colourResult)
    req.db.collection("celebs").findOne({_id:"celeb"}, (err, result) => {
        if (err) next(err)
        console.log(err, result)
        if (result) {
            res.send(JSON.stringify(result))
        }
    })
}