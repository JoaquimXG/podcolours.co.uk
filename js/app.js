const wordList = [
    "Achiever",
    "Assertive",
    "Candid",
    "Competitive",
    "Decisive",
    "Direct",
    "Dislikes Detail",
    "Driving",
    "Easily bored",
    "Fast paced",
    "Focussed",
    "Forceful",
    "Gets results",
    "Impatient",
    "Impulsive",
    "Independent",
    "Inquisitive",
    "Self-Starter",
    "Strong Willed",
    "Takes Charge",
    "Accommodating",
    "Agreeable",
    "Calm",
    "Caring",
    "Considerate",
    "Deliberate",
    "Dependable",
    "Dislike change",
    "Good Listener",
    "Harmonious",
    "Helpful",
    "Kind",
    "Level Headed",
    "Loyal",
    "Methodical",
    "Patient",
    "Possessive",
    "Stubborn",
    "Supportive"
];

const resultsText = {
    red: {
        color: "<span style='color:red;'>Red </span>",
        title: "The Fast Paced Achiever",
        blurb: "Reds are very action oriented and always in motion. They will approach others in a direct, authorita-tive manner and have a preference for big picture thinking.  When communicating with a red you should ensure that you are clear, specific and brief.  Ask questions to help them think through the de-tails and define their big picture ideas."
    },
    blue: {
        color: "<span style='color:blue;'>Blue </span>",
        title: "The Prepared Planner",
        blurb: "People with a preference for Blue are usually very detail oriented and careful, blues ask hard ques-tions to ensure the job is done right.  They may tend toward perfectionism and like to work within clearly defined processes and procedures. To communicate with your blues, organiseyour thoughts and stick to business. "
    },
    green: {
        color: "<span style='color:green;'>Green </span>",
        title: "The Level Headed Helper",
        blurb: "People with a preference for green tend to be intensely loyal and patient, theyare steady workers and make terrific friends. They prefer democratic relations and they are very accommodating when dealing with others.  Maximize their contribution by creating an environment where they feel safe and valued so you can hear their insightful feedback. To communicate with greens be gentle, friendly, and curi-ous."
    },
    yellow : {
        color: "<span style='color:yellow;'>Yellow </span>",
        title: "The Animated Optimist",
        blurb: "People with a preference for yellow tend to be personable and trusting with a positive demeanor.  They usually approach others in a collaborative and democratic manner and have a genuine desire to help.  Yellows’dislike details and prefer looking at the bigger picture.  When communicating with a yellow you should be warm and friendly, but make sure you follow with specifics in writing.  "
    }
};

const colourGenreList = {
    red: ["Thriller", "Horror"],
    blue: ["Comedy", "Documentary"],
    yellow: ["Action", "Drama"],
    green: ["Romance", "Mystery"]
}

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
        $(this).draggable();
        $(this).append(wordList.pop());
    });
});

function displayResultsModal(color){
        $("#modalTitle").append(resultsText[color].color);
        $("#modalTitle").append(resultsText[color].title);
        $("#modalBlurb").text(resultsText[color].blurb);
        $("#loginModalContainer").css("visibility", "visible");
        $("#loginModal").css("opacity", "1");
}

$(document).ready(function() {
    //Add click event for login button in the header to open the login modal
    $("#temporaryRed").click(function() {
        displayResultsModal('red');
    });
    $("#temporaryBlue").click(function() {
        displayResultsModal('blue');
    });
    $("#temporaryGreen").click(function() {
        displayResultsModal('green');
    });
    $("#temporaryYellow").click(function() {
        displayResultsModal('yellow');
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
    $("#omdbButton").click(function() {
        console.log("test");
        var url = "https://www.omdbapi.com/?apikey=d9aa0252&s=in the";

        $.getJSON(url, function(data){
            console.log(data);
            for (var i=0; i<data.Search.length; i++) {
                var id = data.Search[i].imdbID;
                var urlTwo = `https://www.omdbapi.com/?apikey=d9aa0252&i=${id}`;
                //console.log(urlTwo);
                var title = findGenre(colourGenreList.red, urlTwo)    
                
            };

        });

    })
});

function findGenre (genres, url) {
    var title = ""
    $.getJSON(url, function(data){
        var genreArray = (data.Genre).replace(/ /g,"").split(",")
        //console.log(genreArray)
        genres.forEach(genre =>{
            genreArray.forEach(genreToFind =>{
                if (genre == genreToFind){
                    console.log("success")
                    title = data.Title;
                }
            })
        })
        if (title === ""){
            //TODO
        } else {
            console.log(title)
        }
    })
}
