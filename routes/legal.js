module.exports = (req, res, next) => {

    res.locals.header = {
        login: true,
        testButton: {
            class: "btn--success",
            onClick: "location.href='/test'",
            text: "Take the Test",
            id: "testButton",
        },
    };

    if (req.user) {
        res.locals.header.login = false;
        res.locals.header.profile = true;
    }

    req.db
        .collection("content")
        .findOne({ _id: "/" }, { projection: { _id: 0, content: 1 } })
        .then((queryRes) => {
            res.render("pages/legal", {
                header: res.locals.header,
                content: queryRes.content,
            });
        })
        .catch(next);
};
