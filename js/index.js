//Insert contents of header tag from header.html file,
//allows for reuse of header across pages
$(document).ready(function() {
    $("#header").load("common/header.html");
});

$('#headerLoginButton').click(function(){
    console.log("test");
    if ($("#loginModalContainer").css("visibility") == "hidden"){
        $("#loginModalContainer").css("visibility", "visible");
    }
    else{
        $("#loginModalContainer").css("visibility", "hidden");
    }
});
