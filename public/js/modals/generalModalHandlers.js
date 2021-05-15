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
    if ($(`#${openModalButtonId}`).length !== 0) {
        //Add click event for login button in the header to open the login modal
        $(`#${openModalButtonId}`).click(() => openModal(id, cb.open));
    }

    const internalClose = () => closeModal(id, cb.close);
    //Add click event for close button in the login modal to close the modal
    $(`#${getModalCloseId(id)}`).click(internalClose);

    //Add click event for outside of the login modal to close the modal
    $(`#${getModalContainerId(id)}`).click(internalClose);

    //Stop click events on the login modal from propogating to is parent and closing the modal
    $(`#${id}`).click((e) => e.stopPropagation());

    //Remove error class from fields when edited
    $(".formField").on("input", function() {
        $(this).removeClass("form-field__input--error")
    })

    if (cb.setup){
        cb.setup()
    }
}

//Adds css classes to show a modal
function openModal(id, cb) {
    $(`#${getModalContainerId(id)}`).addClass("modal__container--shown");
    $(`#${id}`).addClass("modal--shown");

    if (cb) {
        cb()
    }
}

//Adds css classes to hide a modal
function closeModal(id, cb) {
    $(`#${id}`).removeClass("modal--shown");
    $(`#${getModalContainerId(id)}`).removeClass("modal__container--shown");
    $(".formField").removeClass("form-field__input--error")

    if (cb) {
        cb()
    }
}

//two modals without them fading in and out
//Swaps two modals and if necessary adds click handlers for back buttons
//to go back to last modal
function swapModal(currentId, newId, showBack) {
    removeTransition(currentId)
    removeTransition(newId)

    openModal(newId)
    closeModal(currentId)

    if (showBack) {
        showModalBack(newId)
        addModalBackHandler(newId, () => {
            swapModal(newId, currentId, false)
            //closeModal(newId)
            //openModal(currentId)
            hideModalBack(newId)
        })
    }
    setTimeout(() => {
        addTransition(currentId)
        addTransition(newId)
    }, 250)
}

function removeTransition(id) {
    $(`#${id}`).addClass('modal--no-transition')
    $(`#${getModalContainerId(id)}`).addClass('modal--no-transition')
}

function addTransition(id) {
    $(`#${id}`).removeClass('modal--no-transition')
    $(`#${getModalContainerId(id)}`).removeClass('modal--no-transition')
}

function addModalBackHandler(modalId, handler) {
    $(`#${getModalBackId(modalId)}`).click(handler)
}

function showModalBack(modalId) {
    $(`#${getModalBackId(modalId)}`).css('visibility', 'visible')
}

function hideModalBack(modalId) {
    $(`#${getModalBackId(modalId)}`).css('visibility', 'hidden')
}

function getModalContainerId(modalId) {
    return `${modalId}Container`
}

function getModalCloseId(modalId){
    return `${modalId}Close`
}

function getModalBackId(modalId) {
    return `${modalId}Back`
}

export {
    setupModal,
    openModal,
    closeModal,
    showModalBack,
    hideModalBack,
    addModalBackHandler,
    swapModal
}
