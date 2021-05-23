import {setupModal} from './generalModalHandlers.js'
import validateForm from '../utilities/validateForm.js';
import checkGetParam from '../utilities/checkGetParam.js';
import toastBuilder from '../components/toast.js'

function setupResetPasswordModal(id, openModalButtonId, cb) {
    function setup() {
        $("#resetButton").click(performReset);
    }
    cb.setup = setup;
    setupModal(id, openModalButtonId, cb)
}

function performReset(e) {
    e.preventDefault();
    var email = checkGetParam("email");
    var token = checkGetParam("token");

    const toastError = toastBuilder({
        target: "#resetPasswordModalContainer",
        defaultText: "Passwords do not match",
        classes: "toastError" 
    })

    var fields = [
        {
            selector: "#resetPassword",
            id: "password",
            canBeEmpty: false
        },
        {
            selector: "#resetPasswordConfirm",
            id: "passwordConfirm",
            canBeEmpty: false
        },
    ]

    var data = validateForm(fields)
    
    //If form was not valid, don't send data
    if (!data.isValid) {
        return;
    }

    if (data.password !== data.passwordConfirm) {
        toastError();
        $("#resetPasswordConfirm").addClass("form-field__input--error")
        return;
    }

    $.post({
        url: "/passwordreset/complete",
        data: {password:data.password, email: email, token: token},
    })
        .done(() => {
            window.location.href = "/?loginModal=1"
        })
        .fail(() => {
            window.location.href = "/passwordreset/reset/badTokem?email=none"
        })
}

export default setupResetPasswordModal;
