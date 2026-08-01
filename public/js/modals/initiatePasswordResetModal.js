import {setupModal} from './generalModalHandlers.js'
import toastBuilder from '../components/toast.js'
    
function setupInitiatePasswordResetModal(id, openModalButtonId) {
    function setup() {
        $("#initiateResetButton").click(e => {initiatePasswordReset(e)});
    }
    setupModal(id, openModalButtonId, {setup: setup})
}

function initiatePasswordReset(e) {
    e.preventDefault()

    const toast = toastBuilder({
        target: "#initiatePasswordResetModalContainer",
        defaultText: "A password reset email has been sent"
    })

    const toastError = toastBuilder({
        target: "#initiatePasswordResetModalContainer",
        defaultText: "A server error has occured",
        classes: "toastError" 
    })

    var email = $("#initiateResetEmail").val();
    if (email === ""){
        $("#initiateResetEmail").addClass("form-field__input--error")
        return;
    }

    $.post({
        url: "/passwordreset/initiate",
        data: {email:email},
    })
        .done((data) => {
            //Server is running as a public archive and sends no email, so
            //don't claim that one is on its way
            if (data && data.archived === true) {
                toastError("Password reset is disabled on this archived demo");
                return;
            }
            toast();
            setTimeout(() => {
                window.location.href = "/"
            }, 2500)
        })
        .fail(() => {
            toastError();
        })
}

export default setupInitiatePasswordResetModal;
