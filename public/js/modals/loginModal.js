import requestUserSignIn from '../utilities/requestUserSignIn.js'
import {setupModal} from './generalModalHandlers.js'

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

export { 
    setupLoginModal
};
