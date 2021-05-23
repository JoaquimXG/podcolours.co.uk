import setupResetPasswordModal from './modals/resetPasswordModal.js';
import {openModal} from './modals/generalModalHandlers.js';

$(document).ready(function() {
    var id = "resetPasswordModal";

    setupResetPasswordModal(id, "_", {close: () => false});
    $(`#${id}Close`).hide();
    $(`#${id}Container`).css("background", "none")
    $(`#${id}`).css("box-shadow", "rgba(0, 0, 0, 0.35) 0px 2px 8px")
    openModal(id)
});
