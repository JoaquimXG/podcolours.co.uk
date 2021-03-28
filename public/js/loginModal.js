export { 
    addLoginModalHandlers
};

function addLoginModalHandlers() {
    function hideModal() {
        $("#loginModal").css("opacity", "0");
        $("#loginModalContainer").css("visibility", "hidden");
        $(".formField").removeClass("formFieldError")
    }

    //Add click event for login button in the header to open the login modal
    $("#headerLoginButton").click(function() {
        $("#loginModalContainer").css("visibility", "visible");
        $("#loginModal").css("opacity", "1");
    });

    //Add click event for close button in the login modal to close the modal
    $("#closeLoginModal").click(function() {
        hideModal();
    });

    //Add click event for outside of the login modal to close the modal
    //A side effect of this is that clicking on the modal itself will
    //cause the modal to close as it is a child of loginModalContainer
    //This is resolved below
    $("#loginModalContainer").click(function() {
        hideModal();
    });
    //Stop click events on the login modal from propogating to is parent and closing the modal
    $("#loginModal").click(function(e) {
        e.stopPropagation();
    });

    //Handle login form submit
    $("#loginButton").click(e => {handleLogin(e)});

    //Remove error class from fields when the
    //user has begun to edit them again
    $(".formField").on("input", function() {
        $(this).removeClass("formFieldError")
    })
}


function handleLogin(e) {
    e.preventDefault()
    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();

    //Handle fields being empty
    if (email === "" && password === ""){
        $("#loginEmail").addClass("formFieldError")
        $("#loginPassword").addClass("formFieldError")
    } else if (email === ""){
        $("#loginEmail").addClass("formFieldError")
    } else if (password === ""){
        $("#loginPassword").addClass("formFieldError")
    } else {
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
                    $("#loginEmail").addClass("formFieldError")
                }
                //Wrong password
                else {
                    $("#loginPassword").addClass("formFieldError")
                }
            })
            //TODO Handle server failure
            .fail(() => {
                alert(`Server Error Please try again`)  
            })
    }
}


