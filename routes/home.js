module.exports = (req, res, next) => {
    header = {
        login: true,
        testButton: {
            class: "buttonSuccess",
            onClick: "location.href='/test'",
            text: "Take the Test",
            id: "testButton",
        },
    };
    if (req.session.loggedin) {
        header.login = false;
        header.profile = true;
    }

    req.db.collection("content").findOne(
        { _id: "/" },
        { _id: 0, content: 1 },
        (err, queryRes) => {
            if (err) next(err);
            try {
                res.render("pages/index", {
                    header: header,
                    content: queryRes.content,
                });
            }
            catch (err){
                next(err)
            }
        }
    );
} 
