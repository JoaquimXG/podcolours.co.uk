//Modular script to be used alongside a logout button
//On any page it is required
$(function() {
    var logoutButton = $("#headerLogoutButton")

    //Button is not on page 
    if (!logoutButton.length) {
        return;
    }

    logoutButton.click(logoutUser)
})

//Performs a get request to logout user and
//redirects to the homepage
function logoutUser() {
    $.get("/logout", (data) => {
        if (data.success) {
            window.location.href = "/"
        }
    })
        .always(() => window.location.href = "/");
}
