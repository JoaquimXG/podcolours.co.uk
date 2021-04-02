import { resultsText } from "./appGlobals.js";

//Functions for handling all JQuery UI events for cards
import {
    displayRandomCard,
    handleUndecided,
    handleCardDrop,
    loadProgress, 
    redistributeCards
} from './cardUtilities.js'

//A collection of functions to manage displaying and closing modals
import {
    swapModal,
    removeModalCloseHandlers,
    removeModalBackHandlers,
    addModalCloseHandlers,
    handleModalClose,
} from "./modalHelpers.js";

import { addLoginModalHandlers } from "./loginModal.js";
import { addSignUpModalHandlers } from "./signUpModal.js";

//TODO REMOVE
//Backend should check if user is
//logged in and resume if they have a test in progress
var SHOULDLOAD = true;

//On first load, display instructions, display a card
//and add event handlers for dropzones and modals
$(async function () {
    //TODO uncomment this line, it was just annoying me 
    //displayInstructionModal();

    addLoginModalHandlers();
    addSignUpModalHandlers("saveResultsHeaderButton");

    $("#omdbButton").click(callMovieApi);
    $("#saveResultsHeaderButton").click(function () {
        swapModal("#signUpModalSection");
        addModalCloseHandlers();
    });

    $("#completeTest").click(calculateResult);

    if (SHOULDLOAD) {
        await loadProgress();
    }

    //TODO, when loading progres, the card being displayed should be the "next card"
    //displayRandomCard();

    $(".cardDropzone").each(function () {
        $(this).droppable({
            classes: {
                "ui-droppable-hover": "cardDropzoneHover",
            },
            drop: handleCardDrop,
            greedy: true
        });
    });
    $("#appPrimaryContainer").droppable({drop: handleUndecided})

    window.onresize = redistributeCards;
});

//TODO write documentation
function calculateResult() {
    var max = 0;
    var result = "";
    var cards = JSON.parse(localStorage.getItem("storedCards"));
    var colors = ["red", "blue", "green", "yellow"];

    var colorCounts = {}
    colors.forEach((color) => {
        var count = cards.kept.filter((card)=> card.color == color).length
        colorCounts[color] = count;
        if (count > max) {
            max = count;
            result = color;
        }
    })
    cards.colorCounts = colorCounts;
    
    generateResultsModal(result);
    displayResultsModal();
    localStorage.setItem("resultColor", result);
    localStorage.setItem("storedCards", JSON.stringify(cards));
}


// ---------- Modal Handlers ------------

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

    $("#saveResultsButton").click(function () {
        swapModal("#signUpModalSection");
        $("#backAppModal")
            .css("visibility", "visible")
            .click(function () {
                displayResultsModal();
            });
    });

    //Removing unneccessary dangling click handlers and icons
    removeModalCloseHandlers();
    removeModalBackHandlers();
}

// ----------- Movie API -------------------------

//Calls the OMDB movie API searching for movies with "in the" contained in the title
//this is only because you can't search for all movies and this seems to give a reasonable sample
//Loops through the 10 results and checks if any match a genre for the current color
//If a genre matches, the loop is broken and the movie is displayed on screen
function callMovieApi() {
    function test10Movies() {
        var yearAfter1980 = Math.round(Math.random() * 40);

        var url = `https://www.omdbapi.com/?apikey=d9aa0252&s=in the&y=${1980 +
            yearAfter1980}`;
        $.getJSON(url, async function(data) {
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
    green: ["Romance", "Mystery"]
};
