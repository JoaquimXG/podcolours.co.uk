import { resultsText } from "./appGlobals.js";
import checkIsAuthenticated from "../checkIsAuthenticated.js";
import { wordList as fullWordList } from "./appGlobals.js";

//Functions for handling all JQuery UI events for cards
import {
    handleUndecided,
    handleCardDrop,
    initTest,
    redistributeCards,
    saveStateToServer,
} from "./cardUtilities.js";

//A collection of functions to manage displaying and closing modals
import {
    swapModal,
    removeModalCloseHandlers,
    removeModalBackHandlers,
    addModalCloseHandlers,
    handleModalClose,
} from "../modalHelpers.js";

import { addLoginModalHandlers } from "../loginModal.js";
import { addSignUpModalHandlers } from "../signUpModal.js";


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

    $("#omdbButton").click(() => callMovieApi(state));
    $("#completeTest").click((_) => calculateResult(state));

    //Handler for screen resizing
    window.onresize = (_) => redistributeCards(state);
});

//Handlers for save your progress button
function saveResultsButtonHandlers(isAuthenticated, state) {
    console.log("here", state)
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
    $("#resultColor").append(resultsText[color].color);
    $("#resultTitle").append(resultsText[color].title);
    $("#resultsBlurb").text(resultsText[color].blurb);
}

//Adjusts all css and text for the appropriate results modal
function displayResultsModal(state) {
    swapModal("#resultsModalSection");
    //Removing unneccessary dangling click handlers and icons
    removeModalCloseHandlers();
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

// ----------- Movie API -------------------------

//Calls the OMDB movie API searching for movies with "in the" contained in the title
//this is only because you can't search for all movies and this seems to give a reasonable sample
//Loops through the 10 results and checks if any match a genre for the current color
//If a genre matches, the loop is broken and the movie is displayed on screen
function callMovieApi(state) {
    function test10Movies() {
        var yearAfter1980 = Math.round(Math.random() * 40);

        var url = `https://www.omdbapi.com/?apikey=d9aa0252&s=in the&y=${
            1980 + yearAfter1980
        }`;
        $.getJSON(url, async function (data) {
            for (var i = 0; i < data.Search.length; i++) {
                var id = data.Search[i].imdbID;
                var urlTwo = `https://www.omdbapi.com/?apikey=d9aa0252&i=${id}`;

                try {
                    var movieData = await checkForMatchingGenres(
                        colourGenreLists[color],
                        urlTwo
                    );
                    displayMovieModal(movieData, state);
                    $("body").removeClass("loading");
                    return;
                } catch (e) {
                    continue;
                }
            }
            test10Movies();
        });
    }

    var color = localStorage.getItem("resultColor");
    $("body").addClass("loading");
    test10Movies();
}

//Checks a movie from a given url for matches agains the current colours genres
const checkForMatchingGenres = (colorGenres, url) =>
    new Promise((resolve, reject) => {
        $.getJSON(url, function (data) {
            var movieGenres = data.Genre.replace(/ /g, "").split(",");
            colorGenres.forEach((colorGenre) => {
                movieGenres.forEach((movieGenre) => {
                    if (colorGenre === movieGenre) {
                        resolve(data);
                    }
                });
            });
            reject("Genre does not match");
        });
    });

//Displays the movie modal screen
//editing modal title, blurb and buttons to suit
const displayMovieModal = (movieData, state) => {
    //Generate dynamic html from movie data
    var imdbUrl = `https://www.imdb.com/title/${movieData.imdbID}/`;
    var movieTitle = $("<a>")
        .text(movieData.Title)
        .attr("href", imdbUrl)
        .attr("target", "_blank");
    $("#movieTitle").html(movieTitle);
    $("#moviePlot").text(movieData.Plot);
    $("#backAppModal")
        .css("visibility", "visible")
        .click(function () {
            displayResultsModal(state);
        });
    $("#moreMovieInfoButton").click(function () {
        window.open(imdbUrl, "_blank");
    });

    swapModal("#movieModalSection");
};

const colourGenreLists = {
    red: ["Thriller", "Horror"],
    blue: ["Comedy", "Documentary"],
    yellow: ["Action", "Drama"],
    green: ["Romance", "Mystery"],
};
