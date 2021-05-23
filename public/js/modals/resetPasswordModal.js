import {setupModal} from './generalModalHandlers.js'

function setupResetPasswordModal(id, openModalButtonId, cb) {
    function setup() {
        $("#resetButton").click(e => {
            e.preventDefault();
            {console.log("TODO Create function to reset password")}
        } );
    }
    cb.setup = setup;
    setupModal(id, openModalButtonId, cb)
}

export default setupResetPasswordModal;
