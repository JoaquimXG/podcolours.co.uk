import { wordList, resultsText, colourGenreLists } from "./appGlobals.js";

//A record of all the cards that the user has decided to keep during the test
//This Object is also stored in localStorage in the event the browser is closed
var storedCards = {
    red: [],
    green: [],
    yellow: [],
    blue: []
};

$(function() {
    $("#omdbButton").click(callMovieApi);

    displayCards();

    $(".cardDropzone").each(function() {
        $(this).droppable({
            classes: {
                "ui-droppable-hover": "cardDropzoneHover"
            },
            drop: handleCardDrop
        });
    });
});

//This function is run every time a card is dropped into either the discard or keep box
//retrieves the id and color of the card and adds
//it to the global storedCards object
function handleCardDrop(_, ui) {
    var card = $(ui.draggable);
    var id = card.attr("id");
    var color = card.attr("data-color");

    if ($(this).attr("id") === "greenDropzone") {
        storedCards[color].push(id);
        localStorage.setItem("storedCards", JSON.stringify(storedCards));
    }
    card.remove();

    var cards = $(".card");
    if (cards.length === 0) {
        if (wordList.length === 0) {
            calculateResult();
            return;
        }
        displayCards();
    }
}

//counts up the results and displays the appropriate modal
function calculateResult() {
    var max = 0;
    var result = "";
    Object.keys(storedCards).forEach(color => {
        if (storedCards[color].length > max) {
            max = color.length;
            result = color;
        }
    });

    //TODO There is a potential case of users discarding every card
    //A result will not be shown at this point,
    //We should have a message telling users that they must keep at least 1 card
    //We can run a check for if (max ==== 0) then they haven't kept any cards
    localStorage.setItem("resultColor", result);
    displayResultsModal(result);
}

//Will add 20 random cards from the deck to the application screen
function displayCards() {
    var newWords = [];
    for (var i = 0; i < 1; i++) {
        var randomCardIndex = Math.floor(Math.random() * wordList.length);
        var randomCard = wordList.splice(randomCardIndex, 1)[0];
        newWords.push(randomCard);
    }
    var appBackground = $("#appPrimaryContainer");

    newWords.forEach(word => {
        var $newCard = $("<div />")
            .addClass("card")
            .text(word[0])
            .attr("id", word[0])
            .attr("data-color", word[1])
            .mousedown(function() {
                $(this).addClass("cardFocused");
            })
            .mouseup(function() {
                $(this).removeClass("cardFocused");
            })
            .mouseout(function() {
                $(this).removeClass("cardFocused");
            })
            .draggable();
        appBackground.append($newCard);
    });
}

//Adjusts all css and text for the appropriate results modal
function displayResultsModal(color) {
    $("#modalTitle").text(resultsText.default);
    $("#modalTitle").append(resultsText[color].color);
    $("#modalTitle").append(resultsText[color].title);
    $("#modalBlurb").text(resultsText[color].blurb);
    $("#appModalContainer").css("visibility", "visible");
    $("#appModal").css("opacity", "1");
    removeModalCloseHandlers();
}

//Calls the OMDB movie API searching for movies with "in the" contained in the title
//this is only because you can't search for all movies and this seems to give a reasonable sample
//Loops through the 10 results and checks if any match a genre for the current color
//If a genre matches, the loop is broken and the movie is displayed on screen
function callMovieApi() {
    function recursiveLoop() {
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
            recursiveLoop();
        });
    }

    var color = localStorage.getItem("resultColor");
    $("body").addClass("loading");
    recursiveLoop();
}

//Checks a movie from a given url for matches agains the current colours genres
const checkForMatchingGenres = (colorGenres, url) =>
    new Promise((resolve, reject) => {
        $.getJSON(url, function(data) {
            var movieGenres = data.Genre.replace(/ /g, "").split(",");
            colorGenres.forEach(colorGenre => {
                movieGenres.forEach(movieGenre => {
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
const displayMovieModal = movieData => {
    console.log(movieData);
    $("#modalTitle").text("Your results suggests you would like ");
    $("#modalTitle").append($("<br/>"));
    var movieTitle = $("<a>")
        .text(movieData.Title)
        .attr("href", `https://www.imdb.com/title/${movieData.imdbID}/`);
    $("#modalTitle").append(movieTitle);
    $("#modalBlurb").text(movieData.Plot);
    var movieButton = $("<button>")
        .text("More Info")
        .addClass("buttonBaseline buttonBlue noBorder colCenter");
    $("#modalButtonContainer").html(movieButton);
};

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
function removeModalCloseHandlers(){
    $("#closeAppModal").off();
    $("#closeAppModal").css("visibility", "hidden");
    $("#appModalContainer").off();
}

function handleModalClose() {
    $("#appModal").css("opacity", "0");
    $("#appModalContainer").css("visibility", "hidden");
}
