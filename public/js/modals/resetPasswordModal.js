import {setupModal} from './generalModalHandlers.js'

function setupResetPasswordModal(id, openModalButtonId) {
    function setup() {
        $("#resetButton").click(e => {console.log("TODO Create function to reset password")});
    }
    setupModal(id, openModalButtonId, {setup: setup})
}

export default setupResetPasswordModal;
