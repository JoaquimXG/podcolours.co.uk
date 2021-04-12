import checkIsAuthenticated from "../utilities/checkIsAuthenticated.js";
import { wordList as fullWordList, resultsText } from "./appGlobals.js";

//A collection of functions to manage displaying and closing modals
import {
    swapModal,
    removeModalBackHandlers,
    addModalCloseHandlers,
    handleModalClose,
} from "../modals/modalHelpers.js";

import { addLoginModalHandlers } from "../modals/loginModal.js";
import { addSignUpModalHandlers } from "../modals/signUpModal.js";
import  callMovieApi  from '../modals/movieModal.js'

//Dropzone Handler functions
import {
    handleUndecided,
    handleCardDrop,
} from "./cardDropHandlers.js";

//Functions for handling all JQuery UI events for cards
import {
    initTest,
    redistributeCards,
    saveStateToServer,
} from "./stateManagement.js";

//On first load, display instructions, display a card
//and add event handlers for dropzones and modals
$(async function () {
    displayInstructionModal();

    window.isAuth = await checkIsAuthenticated()

    //Initialise the test state
    var {state, wordList} = await initTest(window.isAuth, fullWordList);

    //Adjust header button action depending on if user is authenticated or not
    saveResultsButtonHandlers(isAuth, state)

    //Add handlers for login
    addLoginModalHandlers();

    //Add initial test app dropzone handlers for JQuery UI 
    $(".cardDropzone").each(function () {
        $(this).droppable({
            classes: {
                "ui-droppable-hover": "cardDropzoneHover",
            },
            drop: (_, ui) => handleCardDrop(_, ui, state, wordList),
            greedy: true,
        });
    });
    $("#undecidedDropZone").droppable({ drop: (_, ui) => handleUndecided(_, ui, state) });

    $("#omdbButton").click(() => callMovieApi(state, displayResultsModal));
    $("#completeTest").click((_) => calculateResult(state));

    //Handler for screen resizing
    window.onresize = (_) => redistributeCards(state);
});

//Handlers for save your progress button
function saveResultsButtonHandlers(isAuthenticated, state) {
    //If user is authenticated, the button to save results
    //the end of the test should save their results without prompting to sign in
    if (isAuthenticated) {
        addSignUpModalHandlers("saveResultsHeaderButton",
            isAuthenticated,
            (passedState) => saveStateToServer(false, true, passedState),
            state
        );
        return;
    }

    //If user is not logged in they should be prompted to sign up
    addSignUpModalHandlers("saveResultsHeaderButton", false, null, state);
    $("#saveResultsHeaderButton").click(function () {
        swapModal("#signUpModalSection");
        addModalCloseHandlers();
    });
}

//Counts the number of cards of each colour which were kept
//calculates the users test result, displayes the results modal
//and saves the results to localStorage
function calculateResult(state) {
    var max = 0;
    var result = "";
    var colors = ["red", "blue", "green", "yellow"];

    //Loop throug each color and count how many cards of each
    //color have been kept. Calculating the highest count at the same time
    var colorCounts = {};
    colors.forEach((color) => {
        var count = state.test.cards.kept.filter((card) => card.color == color).length;
        colorCounts[color] = count;
        if (count > max) {
            max = count;
            result = color;
        }
    });
    //Add the result to the cards variable
    state.test.cards.colorCounts = colorCounts;

    //Display the users results
    generateResultsModal(result);
    displayResultsModal(state);

    state.test.complete = true;
    state.test.result = result;
    state.test.ts = Date.now();
    state.test.timeComplete = Date.now();

    if (window.isAuth) {
        saveStateToServer(false, false, state);
    } 
    else {
        //Store the updated cards data in localStorage
        localStorage.setItem("test-local", JSON.stringify(state));
    }
}

// ---------- Modal Handlers ------------

//Handles showing the instructions modal
function displayInstructionModal() {
    swapModal("#instructModalSection");
    addModalCloseHandlers();
    $("#testStartButton").click(handleModalClose);
}

//Generates the required html for results modal
function generateResultsModal(color) {
    $("#resultColor").empty()
    $("#resultColor").append(resultsText[color].color);
    $("#resultTitle").text(resultsText[color].title);
    $("#resultsBlurb").text(resultsText[color].blurb);
}

//Adjusts all css and text for the appropriate results modal
function displayResultsModal(state) {
    swapModal("#resultsModalSection");
    //Removing unneccessary dangling click handlers and icons
    removeModalBackHandlers();

    //If user is signed in save state to server rather than asking to sign up
    if (window.isAuth == true) {
        $("#saveResultsButton").click(() => saveStateToServer(true, false, state));
        return;
    }

    //If user not signed in, add handler to prompt user sign up
    $("#saveResultsButton").click(function () {
        swapModal("#signUpModalSection");
        $("#backAppModal")
            .css("visibility", "visible")
            .click(function () {
                displayResultsModal(state);
            });
    });
}
