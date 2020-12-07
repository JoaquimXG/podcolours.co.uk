export {swapModal, addModalCloseHandlers, removeModalCloseHandlers, handleModalClose, removeModalBackHandlers}

function swapModal(newModal){
    //Remove currently displayed modal
    $("#modalFormContainer > div").appendTo("#modalHolding");

    //Display new modal
    $(newModal)
        .appendTo("#modalFormContainer")
        .css("display", "block");

    $("#appModalContainer").css("visibility", "visible");
    $("#appModal").css("opacity", "1");
}

//Adds all of the required click handlers to allow modals to close
//also displays the cross
function addModalCloseHandlers() {
    //Add click event for close button in the app modal to close the modal
    $("#closeAppModal").click(function() {
        handleModalClose();
    });

    //For the area around the modal
    $("#appModalContainer").click(function() {
        handleModalClose();
    });
    //Stop click events on the app modal from propogating to is parent and closing the modal
    $("#appModal").click(function(e) {
        e.stopPropagation();
    });
}

//Removes the click handlers required to be able to close a modal
//Hides the close button
function removeModalCloseHandlers() {
    $("#closeAppModal")
        .off()
        .css("visibility", "hidden");
    $("#appModalContainer").off();
}

function handleModalClose() {
    $("#appModal")
        .css("opacity", "0")
    $("#appModalContainer").css("visibility", "hidden");
}

function removeModalBackHandlers() {
    $("#backAppModal")
        .off()
        .css("visibility", "hidden");
}
