module.exports = (res) => {
    var error = {
        title: "Password Reset Token Expired",
        text: "Please request a new reset token before resetting your password.",
        img: "/img/logo.png",
    };
    res.render("pages/error", { error: error });
}
