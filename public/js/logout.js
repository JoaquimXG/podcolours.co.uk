$(function() {
    var logoutButton = $("#headerLogoutButton")

    //Button is not on page 
    if (!logoutButton.length) {
        return;
    }

    logoutButton.click(logoutUser)
})

//Logs out user and returns to homepage
function logoutUser() {
    $.get("/logout", (data) => {
        if (data.success) {
            window.location.href = "/"
        }
    })
        .always(() => window.location.href = "/");
}
