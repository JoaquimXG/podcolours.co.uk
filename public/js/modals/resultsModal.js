import { 
    setupModal,
    swapModal
} from './generalModalHandlers.js'
import {requestRandomPerson} from './randomPersonModal.js'

import { resultsText } from "../test/appGlobals.js";

import { saveStateToServer } from "../test/stateManagement.js";

//Prepares all click handlers for results modal
function setupResultsModal(id, openModalButtonId, state) {
    function setup() {
        calculateResult(state)
        generateResultsModal(state.test.result);

        //If user is signed in save state to server rather than asking to sign up
        if (window.isAuth == true) {
            $("#saveResultsButton").click(() => window.location.href = "/profile");
        } else {
            //If user not signed in, add handler to prompt user sign up
            $("#saveResultsButton").click(() => {
                swapModal('resultsModal', 'signUpModal', true)
            });
        }

        $("#randomPersonButton").click(() => {
            requestRandomPerson(state.test.result,
                () => swapModal('resultsModal', 'randomPersonModal', true)
            )
        });
        return
    }
    setupModal(id, openModalButtonId, {setup: setup})
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

//Generates the required html for results modal
function generateResultsModal(color) {
    $("#resultColor").empty()
    $("#resultColor").append(resultsText[color].color);
    $("#resultTitle").text(resultsText[color].title);
    $("#resultsBlurb").text(resultsText[color].blurb);
}

export default setupResultsModal;
