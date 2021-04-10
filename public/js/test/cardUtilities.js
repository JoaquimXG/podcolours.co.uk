import { wordList, setWordList } from "./appGlobals.js";
import checkIsAuthenticated from "../checkIsAuthenticated.js";
import toastBuilder from '../toast.js'

//Contains the current state of each card
//wether it is "kept", "discarded", "undecided"
//or the next card to be handled
var cards = {
    kept: [],
    discarded: [],
    undecided: [],
    next: {},
};

//GLOBAL Constants 
//Card height and width for css
const CARDWIDTH = 180;
const CARDHEIGHT = 127;
//CSS transition time length
const CARDTRANSTIME = 400;
//Number of cards user should keep before test can end
const NUMTOKEEP = 20;
//Number of cards to discard before test can end
const NUMTODISCARD = 60;
//Possible categories to store cards in 
const CATEGORIES = ["kept", "discarded", "undecided"];

// ------- Load and Save Progress Functions ------------

//Loads previous test state and displays all previously 
//handles cards
async function loadProgress() {
    cards = await getServerSavedState();
    if (cards === null) {
        cards = {
            kept: [],
            discarded: [],
            undecided: [],
            next: {},
        };
        displayRandomCard();
    } else {
        updateWordList();
        await displayAllCards();
        redistributeCards();
    }

    updateCounters();
}

//Performs ajax get for serverside card data
async function getServerSavedState() {
    var serverCards;

    await $.get("/test/getState", (data) => {
        if (data.success) {
            //User is logged in
            if (data.testState.complete == true) {
                //If test is already complete, redirect user back to their profile page
                window.location.href = "/profile"
            } 
            //Load in cards data from the server
            serverCards = data.cards;
        } else {
            //TODO Handle case where user is not signed in
            //They shold be signed in already
        }
    });

    if (serverCards != false) {
        //valid card data was pulled from server
        CATEGORIES.forEach((category) => {
            if (serverCards[category] == undefined) {
                //Mongo won't store empty arrays, server data needs to have empty arrays inserted
                serverCards[category] = [];
            }
        });

        //Return server cards data to be loaded into the page
        localStorage.setItem("storedCards", JSON.stringify(serverCards));
        return serverCards;
    }
    //No valid cards were found on the server, null will be handled by starting a new test
    return null;
}

//Runs everytime a card is moved to a different dropzone
//Ensures the cards record object has been updated to reflect
//the change and updates the localStorage
function moveCard(card, oldKey, newKey, cards) {
    //Get word and color from the current card
    var id = card.attr("id");
    var color = card.attr("data-color");

    //Remove card from its old category, if it was already handled
    cards[oldKey] = cards[oldKey].filter(function (checkCard) {
        return checkCard.id != id;
    });

    //Add card to its new category and update the test counters
    cards[newKey].push({ id: id, color: color });
    updateCounters();

    //Store newly updated categories in localStorage
    localStorage.setItem("storedCards", JSON.stringify(cards));
    localStorage.setItem("lastTestUpdate", JSON.stringify(Date.now()));

    //Save most recent state if user is logged in
    if (window.auth) {
        saveStateToServer(false, false);
    }
}

//Sends the current state of the test to be saved by the server
async function saveStateToServer(redirect, shouldToast) {
    //Create function for generating toast notification
    const toast = toastBuilder({
        target: "#appPrimaryContainer",
        topOffset: 100
    })

    //Retrieve current test cards state
    var cards = localStorage.getItem("storedCards");
    var testSate = localStorage.getItem("testState");
    var lastUpdate = localStorage.getItem("lastTestUpdate");

    //If there are no local changes to send to the server
    //pass on sending any data
    if (cards === null) {
        if (shouldToast) {
            //If user should be notified, display toast notification
            toast();
        }
        return;
    }

    //Only post data if user is signed in
    window.auth = await checkIsAuthenticated();
    if (window.auth == true) {
        $.post({
            type: "POST",
            url: "/test/saveState",
            data: {
                cards: cards,
                testState: testSate,
                lastUpdate: lastUpdate,
            },
            dataType: "json",
        })
            .done((data) => {
                if (data.success === true) {
                    //Redirect user to profile page if required
                    if (redirect) {
                        window.location.href = "/profile";
                        return;
                    }
                    //Provide notification of successful state saved if required
                    if (shouldToast) {
                        toast()
                    }
                } else {
                    //TODO handle this error case
                    console.log(data.error);
                }
            })
            //TODO Handle server failure
            .fail(() => {
                alert(`Server Error Please try again`);
            });
    } else {
        //TODO Potentially redirect to homepage and prompt user to login?
        //The only time I have seen this happen is when refreshing the server
        //and the session is lost. Otherwise I think that as long as the user is still on the page
        //they shouldn't ever not be signed in.
        //This needs to be tested and if there are cases where this can happen then mitigation
        //should be implemented
        console.log("User not signed in ");
    }
}

//When loading a previous test, removes all words from the
//wordList which have already been shown
function updateWordList() {
    //Create an array containing all of the cards which have been handled so far 
    //in all categories
    var allCards = cards.kept.concat(cards.discarded).concat(cards.undecided);
    //Add "next" card to array if there is one to add
    if (cards.next != false) {
        allCards.push(cards.next);
    }
    //Create array containing only the words for each card
    allCards = allCards.map((card) => card.id);

    //Remove all card in allCards from wordlist
    var temp = wordList.filter((card) => {
        return allCards.indexOf(card.id) < 0;
    });

    //Update changes to wordList
    setWordList(temp);
}

//Adds each card which needs to be loaded into the DOM
//ready to be position in the appropriate divs
async function displayAllCards() {
    //Loop through each card in each category
    //and add it to the dom
    CATEGORIES.forEach((category) => {
        cards[category].forEach((card) => {
            displayCard(
                [
                    { name: "id", value: card.id },
                    { name: "data-color", value: card.color },
                    { name: "dropId", value: category },
                    { name: "isShrunk", value: "true" },
                ],
                "card"
            );
        });
    });

    //Display the "next" card as a big card if it exists
    var nextCard = cards.next;
    if (nextCard == false) {
        return;
    }
    displayCard(
        [
            { name: "id", value: nextCard.id },
            { name: "data-color", value: nextCard.color },
            { name: "dropId", value: "undecided" },
            { name: "isShrunk", value: "false" },
        ],
        "bigCard card"
    );
}

var resizeTimer;
//Moves all cards into their appropriate positions
//Big card is centered and all other cards are moved into their dropzones
//This function is run when first loading saved progress
//and on every viewport resize
function redistributeCards() {
    clearTimeout(resizeTimer);

    //Initiates 100ms after most recent window resize
    resizeTimer = setTimeout(function () {
        //Get area where cards can be placed
        var containerHeight = $("#appPrimaryContainer").outerHeight();
        var containerWidth = $("#appPrimaryContainer").outerWidth();
        var headerHeight = $("#header").outerHeight();

        //Fix size of application page as size of header changes
        $("#appPrimaryContainer").css({
            height: `calc(100vh - ${headerHeight}px)`,
        });
        //Relocate "next" card into center of screen
        $(".bigCard").css({
            left: 0.5 * (containerWidth - CARDWIDTH * 2),
            top: 0.5 * (containerHeight - CARDHEIGHT * 2),
        });

        //If no cards to move then pass 
        if (cards === null) {
            return;
        }

        //Loop through each category and create an array of
        //container objects containing required values to locate each card
        var containers = CATEGORIES.map((category) => {
            var container = $(`div[dropId="${category}"]`);
            return {
                name: category,
                container: container,
                height: container.outerHeight() - CARDHEIGHT,
                width: container.outerWidth() - CARDWIDTH,
            };
        });

        //loop through each container and relocate each card into 
        //the appropriate container
        containers.forEach((category) => {
            cards[category.name].forEach((card) => {
                var card = $(`[id="${card.id}"]`);
                card.position({
                    my: `left top`,
                    of: category.container,
                    at: `left+${Math.round(
                        category.width * Math.random()
                    )} top+${Math.round(category.height * Math.random())}`,
                });
            });
        });
    }, 100);
}

// -------------- Real time test application functions ------------------

//Ensures counters for kept and discarded sections
//display the appropriate value
function updateCounters() {
    //Get the number of cards which have been kept and discarded
    var numKept = cards.kept.length;
    var numDiscarded = cards.discarded.length;

    //Update the html
    $("#keepCounter").text(`${numKept}/${NUMTOKEEP}`);
    $("#discardCounter").text(`${numDiscarded}/${NUMTODISCARD}`);

    //If the correct numbers have been reached, allow the user to complete the test
    if (numKept == NUMTOKEEP && numDiscarded == NUMTODISCARD) {
        $("#completeTest").prop("disabled", false);
    } else {
        $("#completeTest").prop("disabled", true);
    }
}

//Scales cards by half when they are first dropped into a dropzone
function shrinkCard(card) {
    //Ensures cards aren't shrunk again 
    card.attr("isShrunk", "true");
    var pos = card.position();

    //Shrinks card around its center
    card.addClass("cardTrans")
        .css({
            left: 0.5 * CARDWIDTH + pos.left,
            top: 0.5 * CARDHEIGHT + pos.top,
        })
        .removeClass("bigCard");

    //Remove the transition class when no longer required
    setTimeout((card) => card.removeClass("cardTrans"), CARDTRANSTIME, $(card));
}

//Adds a specific new card to the DOM
//takes an array of attributes and string of classes
//to be added to the new card
async function displayCard(attributes, classes) {
    var id = attributes[0].value;
    var appBackground = $("#appPrimaryContainer");

    //Create card and add required css and JQuery UI handlers
    var $newCard = $("<div />")
        .addClass(classes)
        .text(id)
        .css({
            position: "absolute",
            left: 10,
            top: 10,
        })
        .mousedown(function () {
            $(this).addClass("cardFocused");
        })
        .mouseup(function () {
            $(this).removeClass("cardFocused");
        })
        .mouseout(function () {
            $(this).removeClass("cardFocused");
        })
        .draggable();

    attributes.forEach((attr) => {
        $newCard.attr(attr.name, attr.value);
    });
    appBackground.append($newCard);
}

//Displays a random big card in the center of the screen
async function displayRandomCard() {
    //Select a random card from the wordlist
    var randomCardIndex = Math.floor(Math.random() * wordList.length);
    var randomCard = wordList.splice(randomCardIndex, 1)[0];

    //Parse its required values
    var id = randomCard.id;
    var color = randomCard.color;
    var dropId = "undecided";

    //Get parameters of location to place the card
    var appBackground = $("#appPrimaryContainer");
    var containerWidth = $("#appPrimaryContainer").outerWidth();
    var containerHeight = $("#appPrimaryContainer").outerHeight();

    //Create card and add required css and JQuery UI handlers
    var $newCard = $("<div />")
        .addClass("card bigCard")
        .text(id)
        .attr("id", id)
        .attr("data-color", color)
        .attr("dropId", dropId)
        .css({
            position: "absolute",
            left: 0.5 * (containerWidth - CARDWIDTH * 2),
            top: 0.5 * (containerHeight - CARDHEIGHT * 2),
        })
        .mousedown(function () {
            $(this).addClass("cardFocused");
        })
        .mouseup(function () {
            $(this).removeClass("cardFocused");
        })
        .mouseout(function () {
            $(this).removeClass("cardFocused");
        })
        .draggable();
    appBackground.append($newCard);

    cards.next = { id: id, color: color };
}

//Runs everytime a card is dropped into the "undecided" dropzone
//Will update the cards record and save state if required
function handleUndecided(_, ui) {
    var card = $(ui.draggable);
    var oldDropZoneId = card.attr("dropId");
    var newDropZoneId = $(this).attr("dropId");

    if (oldDropZoneId === "undecided") {
        return;
    }
    card.attr("dropId", newDropZoneId);
    moveCard($(card), oldDropZoneId, newDropZoneId, cards);
}

//Runs everytime a card is dropped in either the "kept"
//or "discarded" dropzone, will update the cards record
//state and shrink the card if required
async function handleCardDrop(_, ui) {
    var card = $(ui.draggable);
    var oldDropZoneId = card.attr("dropId");
    var newDropZoneId = $(this).attr("dropId");

    //If card has not been dropped into any dropzones yet
    //it will be big, and should be shrunk
    if (card.attr("isShrunk") !== "true") {
        shrinkCard($(card));
        //Have to wait for this function to complete before updating
        //the cards array and updating the counter
        if (wordList.length > 0) {
            await displayRandomCard();
        } else {
            cards.next = false;
        }
    }

    //If the card has been moved to a different dropzone
    //it should be counted for the new dropzone
    if (oldDropZoneId === newDropZoneId) {
        return;
    }
    card.attr("dropId", newDropZoneId);
    moveCard($(card), oldDropZoneId, newDropZoneId, cards);
}

export {
    moveCard,
    shrinkCard,
    displayRandomCard,
    handleUndecided,
    handleCardDrop,
    loadProgress,
    redistributeCards,
    saveStateToServer,
};
