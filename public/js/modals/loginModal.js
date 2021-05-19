import requestUserSignIn from '../utilities/requestUserSignIn.js'
import {setupModal, swapModal} from './generalModalHandlers.js'

//Setups up additional click handlers required for login modal
function setupLoginModal(id, openModalButtonId) {
    function setup() {
        //Handle login form submit
        $("#loginButton").click(e => {handleLogin(e)});

        if(localStorage.getItem("isEmailRemembered") !== null){
            $("#loginRememberMe").prop("checked", true);
            var store = localStorage.getItem("isEmailRemembered")
            var email = $("#loginEmail")
            email.val(store);
        }

        $("#initiateResetPassword").click(() => {
            $("#initiatePasswordResetModalClose").hide()
            swapModal('loginModal', 'initiatePasswordResetModal', true)
        });
    }
    setupModal(id, openModalButtonId, {setup: setup})
}


//validates login form values and posts data to server if values not empty
function handleLogin(e) {
    e.preventDefault()
    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();
    var isRemembered = $("#loginRememberMe").is(":checked");

    handleRemembered(isRemembered, email);

    //If both fields are empty don't send the form
    //and add css error class
    if (email === "" && password === ""){
        $("#loginEmail").addClass("form-field__input--error")
        $("#loginPassword").addClass("form-field__input--error")
        return;
    }

    //If only password is empty, add error class for password
    //Still send email data in order to check if email is valid
    if (password === ""){
        $("#loginPassword").addClass("form-field__input--error")
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
                $("#loginEmail").addClass("form-field__input--error")
            }
            //Wrong password notify user
            else {
                $("#loginPassword").addClass("form-field__input--error")
            }
        })
        .fail(() => {
            requestUserSignIn()
        })
}

function handleRemembered(isChecked, email){
    if(isChecked){
        localStorage.setItem("isEmailRemembered", email)
        return
    }
    else{
        localStorage.removeItem("isEmailRemembered", email)
    }
}

export default setupLoginModal;
