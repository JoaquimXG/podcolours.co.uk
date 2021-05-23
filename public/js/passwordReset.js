import setupResetPasswordModal from './modals/resetPasswordModal.js';
import {openModal} from './modals/generalModalHandlers.js';

$(document).ready(function() {
    var id = "resetPasswordModal";

    //Passed close callback returns false to disallow modal from closing
    setupResetPasswordModal(id, "_", {close: () => false});
    $(`#${id}Close`).hide();

    //Remove background and add shadow
    $(`#${id}Container`).css("background", "none")
    $(`#${id}`).css("box-shadow", "rgba(0, 0, 0, 0.35) 0px 2px 8px")

    //Launch page with modal open
    openModal(id)
});
