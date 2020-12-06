import { wordList, resultsText, colourGenreLists } from "./appGlobals.js";

var storedCards = {
    red: [],
    green: [],
    yellow: [],
    blue: []
};

$(function() {
    //Add click event for close button in the app modal to close the modal
    $("#closeAppModal").click(function() {
        $("#appModal").css("opacity", "0");
        $("#appModalContainer").css("visibility", "hidden");
    });

    //Add click event for outside of the app modal to close the modal
    //A side effect of this is that clicking on the modal itself will
    //cause the modal to close as it is a child of appModalContainer
    //This is resolved below
    $("#appModalContainer").click(function() {
        $("#appModal").css("opacity", "0");
        $("#appModalContainer").css("visibility", "hidden");
    });
    //Stop click events on the app modal from propogating to is parent and closing the modal
    $("#appModal").click(function(e) {
        e.stopPropagation();
    });

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

function handleCardDrop(_, ui) {
    var card = $(ui.draggable);
    var id = card.attr("id");
    var color = card.attr("data-color");
    console.log({ id, color });

    if ($(this).attr("id") === "greenDropzone") {
        storedCards[color].push(id);
        localStorage.setItem("storedCards", JSON.stringify(storedCards));
    }
    card.remove();

    var cards = $(".card");
    if (cards.length === 0) {
        if (wordList.length === 0){
            console.log("games over")
            showResult()
            return
        }
        console.log("No more cards");
        displayCards();
    }
}

//counts up the results and displays the appropriate modal
function showResult(){
    var max = 0;
    var result = ""
    Object.keys(storedCards).forEach(color => {
        if (storedCards[color].length > max){
            max = color.length
            result = color;
        }
    } );
    localStorage.setItem("resultColor", result);
    displayResultsModal(result);
}

//Will add 20 random cards from the deck to the application screen
function displayCards() {
    var newWords = [];
    for (var i = 0; i < 20; i++) {
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

function displayResultsModal(color) {
    $("#modalTitle").text(resultsText.default);
    $("#modalTitle").append(resultsText[color].color);
    $("#modalTitle").append(resultsText[color].title);
    $("#modalBlurb").text(resultsText[color].blurb);
    $("#appModalContainer").css("visibility", "visible");
    $("#appModal").css("opacity", "1");
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
