export { 
    addLoginModalHandlers,
    openLoginModal,
    closeLoginModal
};

//Handler for displaying the login modal
function openLoginModal() {
        $("#loginModalContainer").css("visibility", "visible");
        $("#loginModal").css("opacity", "1");
}

//Handler for hiding the login modal
function closeLoginModal() {
    $("#loginModal").css("opacity", "0");
    $("#loginModalContainer").css("visibility", "hidden");
    $(".formField").removeClass("formFieldError")
}

function addLoginModalHandlers() {

    //If user is logged in the button won't exist
    if (!$("#headerLoginButton").click(openLoginModal).length) {
        return
    }

    //Add click event for login button in the header to open the login modal
    $("#headerLoginButton").click(openLoginModal);

    //Add click event for close button in the login modal to close the modal
    $("#closeLoginModal").click(function() {
        closeLoginModal();
    });

    //Add click event for outside of the login modal to close the modal
    //A side effect of this is that clicking on the modal itself will
    //cause the modal to close as it is a child of loginModalContainer
    //This is resolved below
    $("#loginModalContainer").click(function() {
        closeLoginModal();
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

//validates login form values and posts data to server if values not empty
function handleLogin(e) {
    e.preventDefault()
    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();

    //If both fields are empty don't send the form
    //and add css error class
    if (email === "" && password === ""){
        $("#loginEmail").addClass("formFieldError")
        $("#loginPassword").addClass("formFieldError")
        return;
    }

    //If only password is empty, add error class for password
    //Still send email data in order to check if email is valid
    if (password === ""){
        $("#loginPassword").addClass("formFieldError")
    } 
    $.post({
        type: "POST",
        url: "/postlogin",
        data: {email:email, password:password},
        dataType: "json"
    })
        .done(data => {
            //Successful login redirect to profile
            if (data.loggedin === true) {
                window.location.href = "/profile"
            }
            //Wrong email, notify user
            else if (data.bademail === true){
                $("#loginEmail").addClass("formFieldError")
            }
            //Wrong password notify user
            else {
                $("#loginPassword").addClass("formFieldError")
            }
        })
        //TODO Handle server failure
        .fail(() => {
            alert(`Server Error Please try again`)  
        })
}
