export { 
    addLoginModalHandlers
};

function addLoginModalHandlers() {
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

    $("#loginButton").click(e => {handleLogin(e)});

}


function handleLogin(e) {
    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();

    e.preventDefault()

    if(email != "" && password != ""){
        $.post({
            type: "POST",
            url: "/postlogin",
            data: {email:email, password:password},
            dataType: "json"
        })
            .done(data => {
                //Successful login
                if (data.loggedin === true) {
                    window.location.href = "/profile"
                }
                //Wrong username
                else if (data.badusername === true){
                    console.log("Username incorrect")
                }
                //Wrong password
                else {
                    console.log("Password incorrect")
                }
            })
            //TODO Handle server failure
            .fail((request, status, err) => {
              alert(`Server Error Please try again`)  
            })

    }
    //TODO email or password is empty, notify user
}


