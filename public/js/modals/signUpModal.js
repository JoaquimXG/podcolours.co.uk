import requestUserSignIn from '../utilities/requestUserSignIn.js'
import validateForm from '../utilities/validateForm.js'

//Modular function for adding all event handlers for sign up modal 
function addSignUpModalHandlers(activationId, isAuthenticated, authenticatedCallBack, state) {
    //Internal function which handles all events to hide the sign up modal
    function hideModal() {
        $("#signUpModalSection").css("opacity", "0");
        $("#signUpModalContainer").css("visibility", "hidden");
        $(".formField").removeClass("formFieldError")
    }

    //Add click event for signUp button in the header to open the login modal
    if (isAuthenticated) {
        $(`#${activationId}`).click(() => authenticatedCallBack(state))
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
    $("#signUpButton").click(e => {handleSignUp(e, state)});

    //Remove error class from fields when the
    //user has begun to edit them again
    $(".formField").on("input", function() {
        $(this).removeClass("formFieldError")
    })
}

function removeCloseModalIcon() {
    $("#closeSignUpModal").remove()
}

//Parses user sign up form data and gathers current test data
//Validates values and posts data to server
function handleSignUp(e, state) {
    e.preventDefault()

    //Array for fields in form to be validated
    var fields = [
        {
            selector: "#signUpName",
            id: "name"
        },
        {
            selector: "#signUpUniversity",
            id: "university"
        },
        {
            selector: "#signUpDepartment",
            id: "department"
        },
        {
            selector: "#signUpEmail",
            id: "email",
            re: true,
            reString: /^\S+@\S+\.\S+$/
        },
        {
            selector: "#signUpPassword",
            id: "password",
        },
    ]

    var data = validateForm(fields)
    
    //If form was not valid, don't send data
    if (!data.isValid) {
        return;
    }

    data.test = JSON.stringify(state.test)

    $.post({
        type: "POST",
        url: "/signup",
        data: data,
        dataType: "json"
    })
        .done(data => {
            //Redirect to profile page if user created 
            if (data.userCreated === true) {
                localStorage.removeItem("test-local")
                window.location.href = "/profile"
            }
            //If email is taken, notify user 
            else if(data.errorCode === 1) {
                $("#signUpModalTitle")
                    .text("Sorry, this email is taken")
                $("#signUpEmail").addClass("formFieldError")
            }
        })
        .fail(() => {
            requestUserSignIn()
        })
}

export { 
    addSignUpModalHandlers,
    removeCloseModalIcon
};
