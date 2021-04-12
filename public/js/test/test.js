import checkIsAuthenticated from "../utilities/checkIsAuthenticated.js";
import { wordList as fullWordList } from "./appGlobals.js";

//A collection of functions to manage displaying and closing modals
import {
    swapModal,
} from "../modals/modalHelpers.js";

import  callMovieApi  from '../modals/movieModal.js'

//Generalised modal handlers
import { openModal } from '../modals/generalModalHandlers.js'
import setupLoginModal from "../modals/loginModal.js";
import setupInstructionsModal from '../modals/instructionsModal.js'
import setupSignUpModal from '../modals/signUpModal.js'
import setupResultsModal from '../modals/resultsModal.js'

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

const INSTRUCTIONMODALID = 'instructionsModal'
const LOGINMODALID = 'loginModal'
const SIGNUPMODALID = 'signUpModal'
const RESULTSMODALID = 'resultsModal'

//On first load, display instructions, display a card
//and add event handlers for dropzones and modals
$(async function () {
    setupInstructionsModal(INSTRUCTIONMODALID)
    openModal(INSTRUCTIONMODALID)
    setupLoginModal(LOGINMODALID, 'headerLoginButton');

    //TODO remove close handlers and replace with generics
    //addModalCloseHandlers();

    window.isAuth = await checkIsAuthenticated()

    //Initialise the test state
    var {state, wordList} = await initTest(window.isAuth, fullWordList);

    //Adjust header button action depending on if user is authenticated or not
    saveResultsButtonHandlers(window.isAuth, state)


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

    var isResultsGenerated = false;
    $("#completeTest").click((_) => {
        if (!isResultsGenerated) {
            setupResultsModal(RESULTSMODALID, null, state)
            isResultsGenerated = true;
        }
        openModal(RESULTSMODALID)
    });

    //Handler for screen resizing
    window.onresize = (_) => redistributeCards(state);
});

//Handlers for save your progress button
function saveResultsButtonHandlers(isAuthenticated, state) {
    //If user is authenticated, the button to save results
    //the end of the test should save their results without prompting to sign in
    if (isAuthenticated) {
        $("#saveResultsHeaderButton").click(() => saveStateToServer(false, true, state))
    } else {
        setupSignUpModal(SIGNUPMODALID, "saveResultsHeaderButton", state)
    }
}