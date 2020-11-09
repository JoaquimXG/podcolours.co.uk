$(document).ready(function() {
    $("#headerLoginButton").click(function() {
        $("#loginModalContainer").css("visibility", "visible");
        $("#loginModal").css("opacity", "1");
    });

    $("#closeLoginModal").click(function() {
        $("#loginModal").css("opacity", "0");
        $("#loginModalContainer").css("visibility", "hidden");
    });

    $('#loginModalContainer').click(function() {
        $("#loginModal").css("opacity", "0");
        $("#loginModalContainer").css("visibility", "hidden");
    })

    $('#loginModal').click(function(e){
        e.stopPropagation();
    })
});
