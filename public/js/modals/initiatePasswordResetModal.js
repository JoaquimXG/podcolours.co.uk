import {setupModal} from './generalModalHandlers.js'

function setupInitiatePasswordResetModal(id, openModalButtonId) {
    function setup() {
        $("#initiateResetButton").click(e => {console.log("TODO Create function to reset password")});
    }
    setupModal(id, openModalButtonId, {setup: setup})
}

export default setupInitiatePasswordResetModal;
