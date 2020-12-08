export {
    swapModal,
    addModalCloseHandlers,
    removeModalCloseHandlers,
    handleModalClose,
    removeModalBackHandlers,
    addHandlersForLoginModal
};

function swapModal(newModal) {
    //Remove currently displayed modal
    $("#modalSectionContainer > div").appendTo("#modalHolding");

    //Display new modal
    $(newModal)
        .appendTo("#modalSectionContainer")
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
    $("#appModal").css("opacity", "0");
    $("#appModalContainer").css("visibility", "hidden");
}

function removeModalBackHandlers() {
    $("#backAppModal")
        .off()
        .css("visibility", "hidden");
}

function addHandlersForLoginModal() {
    //Add click event for login button in the header to open the login modal
    $("#headerLoginButton").click(function() {
        $("#loginModalContainer").css("visibility", "visible");
        $("#loginModal").css("opacity", "1");
    });

    //Add click event for close button in the login modal to close the modal
    $("#closeLoginModal").click(function() {
        $("#loginModal").css("opacity", "0");
        $("#loginModalContainer").css("visibility", "hidden");
    });

    //Add click event for outside of the login modal to close the modal
    //A side effect of this is that clicking on the modal itself will
    //cause the modal to close as it is a child of loginModalContainer
    //This is resolved below
    $("#loginModalContainer").click(function() {
        $("#loginModal").css("opacity", "0");
        $("#loginModalContainer").css("visibility", "hidden");
    });
    //Stop click events on the login modal from propogating to is parent and closing the modal
    $("#loginModal").click(function(e) {
        e.stopPropagation();
    });
}
