//Sets up click handlers for opening and closing a modal
//Takes an object of callbacks 
//{
//  setup: function
//  open: function
//  close: function
//}
//
//callbacks are called at each stage of the modals lifecycle
//if they are passed
function setupModal(id, openModalButtonId, cb) {
    var cb = cb || {};

    //If user is logged in the button won't exist
    if (!$(`#${openModalButtonId}`).length) {
        return
    }
    //Add click event for login button in the header to open the login modal
    $(`#${openModalButtonId}`).click(() => openModal(id, cb.open));

    const internalClose = () => closeModal(id, cb.close);
    //Add click event for close button in the login modal to close the modal
    $(`#${getModalCloseId(id)}`).click(internalClose);

    //Add click event for outside of the login modal to close the modal
    $(`#${getModalContainerId(id)}`).click(internalClose);

    //Stop click events on the login modal from propogating to is parent and closing the modal
    $(`#${id}`).click((e) => e.stopPropagation());

    //Remove error class from fields when edited
    $(".formField").on("input", function() {
        $(this).removeClass("formFieldError")
    })

    if (cb.setup){
        cb.setup()
    }
}

function openModal(id, cb) {
    $(`#${getModalContainerId(id)}`).addClass("modalContainerShown");
    $(`#${id}`).addClass("modalShown");

    if (cb) {
        cb()
    }
}

function closeModal(id, cb) {
    $(`#${id}`).removeClass("modalShown");
    $(`#${getModalContainerId(id)}`).removeClass("modalContainerShown");
    $(".formField").removeClass("formFieldError")

    if (cb) {
        cb()
    }
}

function getModalContainerId(modalId) {
    return `${modalId}Container`
}

function getModalCloseId(modalId){
    return `${modalId}Close`
}

export {
    setupModal,
    openModal,
    closeModal
}
