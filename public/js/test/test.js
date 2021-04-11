import { resultsText } from "./appGlobals.js";
import checkIsAuthenticated from "../checkIsAuthenticated.js";
import { wordList } from "./appGlobals.js";

//Functions for handling all JQuery UI events for cards
import {
    displayRandomCard,
    handleUndecided,
    handleCardDrop,
    loadProgress,
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
    window.auth = await checkIsAuthenticated(saveResultsButtonHandlers);

    displayInstructionModal();

    if (window.auth == true) {
        //If user is signed in, their previous progress is loaded
        await loadProgress();
    } else {
        //Otherwise a new test is initiated

        //Init test state
        var state = {
            _id: "local",
            ts: Date.now(),
            test: {
                cards: {
                    kept: [],
                    discarded: [],
                    undecided: [],
                    next: {}
                },
                complete: false,
                result: null
            }
        }

        //Display first card
        displayRandomCard(wordList, state);
        localStorage.setItem(`test-${state._id}`, JSON.stringify(state))
    }

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

    $("#omdbButton").click(callMovieApi);
    $("#completeTest").click(calculateResult);

    //Handler for screen resizing
    window.onresize = redistributeCards;
});

//Handlers for save your progress button
function saveResultsButtonHandlers(isAuthenticated) {
    //If user is authenticated, the button to save results
    //the end of the test should save their results without prompting to sign in
    if (isAuthenticated) {
        addSignUpModalHandlers("saveResultsHeaderButton", isAuthenticated, () =>
            saveStateToServer(false, true)
        );
        return;
    }

    //If user is not logged in they should be prompted to sign up
    addSignUpModalHandlers("saveResultsHeaderButton");
    $("#saveResultsHeaderButton").click(function () {
        swapModal("#signUpModalSection");
        addModalCloseHandlers();
    });
}

//Counts the number of cards of each colour which were kept
//calculates the users test result, displayes the results modal
//and saves the results to localStorage
function calculateResult() {
    var max = 0;
    var result = "";
    var cards = JSON.parse(localStorage.getItem("storedCards"));
    var colors = ["red", "blue", "green", "yellow"];

    //Loop throug each color and count how many cards of each
    //color have been kept. Calculating the highest count at the same time
    var colorCounts = {};
    colors.forEach((color) => {
        var count = cards.kept.filter((card) => card.color == color).length;
        colorCounts[color] = count;
        if (count > max) {
            max = count;
            result = color;
        }
    });
    //Add the result to the cards variable
    cards.colorCounts = colorCounts;

    //Display the users results
    generateResultsModal(result);
    displayResultsModal();

    //Store the updated cards data in localStorage
    localStorage.setItem(
        "testState",
        JSON.stringify({ complete: true, result: result, time: Date.now()})
    );
    localStorage.setItem("storedCards", JSON.stringify(cards));
    localStorage.setItem("lastTestUpdate", JSON.stringify(Date.now()));

    //Update server with new results
    saveStateToServer(false, false);
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
function displayResultsModal() {
    swapModal("#resultsModalSection");
    //Removing unneccessary dangling click handlers and icons
    removeModalCloseHandlers();
    removeModalBackHandlers();

    //If user is signed in save state to server rather than asking to sign up
    if (window.auth == true) {
        $("#saveResultsButton").click(() => saveStateToServer(true, false));
        return;
    }

    //If user not signed in, add handler to prompt user sign up
    $("#saveResultsButton").click(function () {
        swapModal("#signUpModalSection");
        $("#backAppModal")
            .css("visibility", "visible")
            .click(function () {
                displayResultsModal();
            });
    });
}

// ----------- Movie API -------------------------

//Calls the OMDB movie API searching for movies with "in the" contained in the title
//this is only because you can't search for all movies and this seems to give a reasonable sample
//Loops through the 10 results and checks if any match a genre for the current color
//If a genre matches, the loop is broken and the movie is displayed on screen
function callMovieApi() {
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
                    displayMovieModal(movieData);
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
const displayMovieModal = (movieData) => {
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
            displayResultsModal();
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
