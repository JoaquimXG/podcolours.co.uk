$(document).ready(function() {
    //Add click event for login button in the header to open the login modal
    $("#headerLoginButton").click(function() {
        $("#loginModalContainer").css("visibility", "visible");
        $("#loginModal").css("opacity", "1");
    });

    //Add click event for close button in the login modal to close the modal
    $("#closeLoginModal").click(function() {
        $("#loginModal").css("opacity", "0");
        $("#loginModalContainer").css("visibility", "hidden");
    });

    //Add click event for outside of the login modal to close the modal
    //A side effect of this is that clicking on the modal itself will
    //cause the modal to close as it is a child of loginModalContainer
    //This is resolved below
    $("#loginModalContainer").click(function() {
        $("#loginModal").css("opacity", "0");
        $("#loginModalContainer").css("visibility", "hidden");
    });
    //Stop click events on the login modal from propogating to is parent and closing the modal
    $("#loginModal").click(function(e) {
        e.stopPropagation();
    });

    //This can be used to change to the app.html page without having to reload the page
    //I am not sure exactly how to make it so that all of the related, css and js files load correctly
    //This would be ideal in the final app but I am commenting it out for now in
    //TODO
//    $(".takeTheTest").each(function() {
//        $(this).click(function(e) {
//            e.preventDefault();
//            var href = "/app.html";
//            jQuery.get(href, function(data) {
//                //alert(data);
//                $('body').html(data)
//                window.history.pushState({href: href}, '', href);
//            });
//        });
//    }); 
    

});
