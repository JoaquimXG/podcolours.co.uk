import toastBuilder from '../components/toast.js';
import requestUserSignIn from '../utilities/requestUserSignIn.js'
import validateForm from '../utilities/validateForm.js'
import {setupModal} from './generalModalHandlers.js'

function setupSignUpModal(id, openModalButtonId, state) {
    function setup() {
        $("#signUpButton").click(e => {handleSignUp(e, state)});

    }
    setupModal(id, openModalButtonId, {setup: setup})
}

//Parses user sign up form data and gathers current test data
//Validates values and posts data to server
function handleSignUp(e, state) {
    e.preventDefault()

    const toast = toastBuilder({
        target: "body",
        topOffset: 100,
        defaultText: "Email address taken",
        classes: "toastError"
    })

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
        {
            selector: "#signUpConfirmPassword",
            id: "confirmPassword",
        },
    ]

    var data = validateForm(fields)
    
    //If form was not valid, don't send data
    if (!data.isValid) {
        return;
    }

    if (data.confirmPassword != data.password) {
        $("#signUpConfirmPassword").addClass("form-field__input--error")
        toast("Passwords do not match")
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
                toast()
                $("#signUpEmail").addClass("form-field__input--error")
            }
        })
        .fail(() => {
            requestUserSignIn()
        })
}

//TODO remove, deprecated
function removeCloseModalIcon() {
    $("#closeSignUpModal").remove()
}

export default setupSignUpModal;
