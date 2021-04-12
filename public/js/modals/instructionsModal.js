import { setupModal, closeModal } from './generalModalHandlers.js'

//Setups up additional click handlers required for instructions modal
function setupInstructionsModal(id, openModalButtonId) {
    const setup2 = () => {
        $("#testStartButton").click(() => closeModal(id));
    }

    setupModal(id, openModalButtonId, {setup: setup2})
}

export default setupInstructionsModal;
