$(document).ready(function() {
    $("#headerLoginButton").click(function() {
        $("#loginModalContainer").css("visibility", "visible");
    });

    $("#closeLoginModal").click(function() {
        $("#loginModalContainer").css("visibility", "hidden");
    });

    $('#loginModalContainer').click(function() {
        $("#loginModalContainer").css("visibility", "hidden");
    })

    $('#loginModal').click(function(e){
        e.stopPropagation();
    })
});
