//Checks if user is logged in to edit header buttons
//Pulls content from the database to display on the page
module.exports = (req, res, next) => {
    res.locals.header = {
        login: true,
        testButton: {
            class: "buttonSuccess",
            onClick: "location.href='/test'",
            text: "Take the Test",
            id: "testButton",
        },
    };

    if (req.user) {
        res.locals.header.login = false;
        res.locals.header.profile = true;
    }

    req.db.collection("content").findOne(
        { _id: "/" },
        { _id: 0, content: 1 },
        (err, queryRes) => {
            if (err) next(err);
            try {
                res.render("pages/index", {
                    header: res.locals.header,
                    content: queryRes.content,
                });
            }
            catch (err){
                next(err)
            }
        }
    );
} 
