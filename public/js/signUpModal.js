export { 
    addSignUpModalHandlers
};

function addSignUpModalHandlers(activationId, isAuthenticated, authenticatedCallBack) {
    function hideModal() {
        $("#signUpModalSection").css("opacity", "0");
        $("#signUpModalContainer").css("visibility", "hidden");
        $(".formField").removeClass("formFieldError")
    }

    //Add click event for signUp button in the header to open the login modal
    if (isAuthenticated) {
        $(`#${activationId}`).click(authenticatedCallBack)
    } else {
        $(`#${activationId}`).click(function() {
            $("#signUpModalContainer").css("visibility", "visible");
            $("#signUpModalSection").css("opacity", "1");
        });
    }

    //Add click event for close button in the signUp modal to close the modal
    $("#closeSignUpModal").click(function() {
        hideModal();
    });

    //Add click event for outside of the signUp modal to close the modal
    //A side effect of this is that clicking on the modal itself will
    //cause the modal to close as it is a child of signUpModalContainer
    //This is resolved below
    $("#signUpModalContainer").click(function() {
        hideModal();
    });
    //Stop click events on the signUp modal from propogating to is parent and closing the modal
    $("#signUpModal").click(function(e) {
        e.stopPropagation();
    });

    //Handle signUp form submit
    $("#signUpButton").click(e => {handleSignUp(e)});

    //Remove error class from fields when the
    //user has begun to edit them again
    $(".formField").on("input", function() {
        $(this).removeClass("formFieldError")
    })
}

function handleSignUp(e) {
    e.preventDefault()
    var email = $("#signUpEmail").val();
    var password = $("#signUpPassword").val();
    var name = $("#signUpName").val();
    var department = $("#signUpDepartment").val();

    var cards = localStorage.getItem('storedCards');
    var testSate = localStorage.getItem("testState")
    var lastUpdate = localStorage.getItem("lastTestUpdate")

    //Handle fields being empty
    if (email === "" || password === ""){
        if (password === ""){
            $("#signUpPassword").addClass("formFieldError")
        } 
        if (email === ""){
            $("#signUpEmail").addClass("formFieldError")
        } 
    }
    else {
        $.post({
            type: "POST",
            url: "/signup",
            data: {
                name: name,
                email:email,
                password:password,
                department: department,
                cards: cards,
                testState: testSate,
                lastUpdate: lastUpdate
            },
            dataType: "json"
        })
            .done(data => {
                //Redirect to profile page if user created 
                if (data.userCreated === true) {
                    window.location.href = "/profile"
                }
                //User already exists
                else if(data.errorCode === 1) {
                    $("#signUpModalTitle")
                        .text("Sorry, this username is taken")
                    $("#signUpEmail").addClass("formFieldError")
                }
            })
            //TODO Handle server failure
            .fail(() => {
                alert(`Server Error Please try again`)  
            })
    }
}
