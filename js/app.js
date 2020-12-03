import { wordList, resultsText, colourGenreLists } from './appGlobals.js';

$(function() {
    $(".card").each(function() {
        $(this).mousedown(function() {
            $(this).addClass("cardFocused");
        });
        $(this).mouseup(function() {
            $(this).removeClass("cardFocused");
        });
        $(this).mouseout(function() {
            $(this).removeClass("cardFocused");
        });
        $(this).append(wordList.pop());
    });
    $(".cardContainer").each(function(){
        $(this).draggable();
    })
});

$(function() {
    //Add click event for login button in the header to open the login modal
    $("#temporaryRed").click(function() {
        localStorage.setItem("resultColor","red");
        displayResultsModal("red");
    });
    $("#temporaryBlue").click(function() {
        localStorage.setItem("resultColor","blue");
        displayResultsModal("blue");
    });
    $("#temporaryGreen").click(function() {
        localStorage.setItem("resultColor","green");
        displayResultsModal("green");
    });
    $("#temporaryYellow").click(function() {
        localStorage.setItem("resultColor","yellow");
        displayResultsModal("yellow");
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

    $("#omdbButton").click(callMovieApi);
});

function displayResultsModal(color) {
    $("#modalTitle").text(resultsText.default);
    $("#modalTitle").append(resultsText[color].color);
    $("#modalTitle").append(resultsText[color].title);
    $("#modalBlurb").text(resultsText[color].blurb);
    $("#loginModalContainer").css("visibility", "visible");
    $("#loginModal").css("opacity", "1");
}

//Calls the OMDB movie API searching for movies with "in the" contained in the title
//this is only because you can't search for all movies and this seems to give a reasonable sample
//Loops through the 10 results and checks if any match a genre for the current color
//If a genre matches, the loop is broken and the movie is displayed on screen
function callMovieApi() {
    var color = localStorage.getItem("resultColor");

    var url = "https://www.omdbapi.com/?apikey=d9aa0252&s=in the";
    $.getJSON(url, async function(data) {

        for (var i = 0; i < data.Search.length; i++) {
            var id = data.Search[i].imdbID;
            var urlTwo = `https://www.omdbapi.com/?apikey=d9aa0252&i=${id}`;

            try {
                var movieData = await checkForMatchingGenres(colourGenreLists[color], urlTwo);
                console.log(movieData.Title);
                displayMovieModal(movieData)
                break
            } catch (e) {
                console.log("Error:", e);
            }
        }
    });
}

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

const displayMovieModal = (movieData) => {
    console.log(movieData)
    $("#modalTitle").text("Your results suggest you would like: ");
    $("#modalTitle").append(movieData.Title);
    $("#modalBlurb").text(movieData.Plot);
}
