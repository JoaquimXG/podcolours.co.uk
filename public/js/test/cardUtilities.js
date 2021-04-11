import checkIsAuthenticated from "../checkIsAuthenticated.js";
import toastBuilder from '../toast.js'

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

//Initiates a new test with new state
function newTestState() {
    //Contains the current state of each card
    //wether it is "kept", "discarded", "undecided"
    //or the next card to be handled
    var state = {
        _id: "local",
        test: {
            ts: Date.now(),
            cards: {
                kept: [],
                discarded: [],
                undecided: [],
                next: false,
                complete: true
            },
            complete: false,
            result: null,
            timeComplete: null
        }
    }

    return state;
}

//Loads previous test state and displays all previously 
//handles cards
async function initTest(isAuth, wordList) {
    var state;
    if (isAuth) {
        state = await loadServerProgress()
    }
    else {
        state = loadLocalProgress()
    }

    if (state === null)  {
        state = newTestState()
        //Display the first card
        displayRandomCard(wordList, state);
    }
    else {
        wordList = updateWordList(state, wordList);
        await displayAllCards(state);
        redistributeCards(state);
    }

    updateCounters(state, NUMTOKEEP, NUMTODISCARD);

    return {state, wordList};
}

function loadLocalProgress() {
    var state = JSON.parse(localStorage.getItem("test-local"))
    return state;
}

//Performs ajax get for serverside card data
async function loadServerProgress() {
    var state = false;
    await $.get("/test/getState", (data) => {
        if (data.success) {
            //User is logged in
            if (data.test.complete == true) {
                //If test is already complete, redirect user back to their profile page
                window.location.href = "/profile"
            } 
            state = {
                _id: data._id,
                test: data.test
            }
        } else {
            //TODO Handle case where user is not signed in
            //They shold be signed in already
            //notify user that session has been lost and redirect to /?loginModal=1
        }
    });

    if (state === false) {
        //No valid cards were found on the server, null will be handled by starting a new test
        return null;
    }

    CATEGORIES.forEach((category) => {
        if (state.test.cards[category] == undefined) {
            //Mongo won't store empty arrays, server data needs to have empty arrays inserted
            state.test.cards[category] = [];
        }
    });

    //Return server cards data to be loaded into the page
    //TODO we shouldn't need this here
    //localStorage.setItem("storedCards", JSON.stringify(serverCards));
    return state;
}

//Runs everytime a card is moved to a different dropzone
//Ensures the cards record object has been updated to reflect
//the change and saves the state either to localStorage or the server
//depending on whether the user is signed in or not
function moveCard(card, oldKey, newKey, state) {
    //Get word and color from the current card
    var id = card.attr("id");
    var color = card.attr("data-color");

    //Remove card from its old category, if it was already handled
    state.test.cards[oldKey] = state.test.cards[oldKey].filter(function (checkCard) {
        return checkCard.id != id;
    });

    //Add card to its new category and update the test counters
    state.test.cards[newKey].push({ id: id, color: color });
    updateCounters(state, NUMTOKEEP, NUMTODISCARD);

    //State has been updated, so update timestamp
    state.test.ts = Date.now();

    if (window.auth) {
        //Save most recent state to server
        saveStateToServer(false, false);
    }
    else {
        //Store newly updated categories in localStorage
        localStorage.setItem("test-local", JSON.stringify(state));

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
function updateWordList(state, wordList) {
    //Create an array containing all of the cards which have been handled so far 
    //in all categories
    var cards = state.test.cards;
    var allCards = cards.kept.concat(cards.discarded).concat(cards.undecided);
    //Add "next" card to array if there is one to add
    if (cards.next != false) {
        allCards.push(cards.next);
    }
    //Create array containing only the words for each card
    allCards = allCards.map((card) => card.id);

    //Remove all card in allCards from wordlist
    var updatedWordList = wordList.filter((card) => {
        return allCards.indexOf(card.id) < 0;
    });

    //Have to return wordList as the referene value was changed
    return updatedWordList;
}

//Adds each card which needs to be loaded into the DOM
//ready to be position in the appropriate divs
async function displayAllCards(state) {
    //Loop through each card in each category
    //and add it to the dom
    CATEGORIES.forEach((category) => {
        state.test.cards[category].forEach((card) => {
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
    var nextCard = state.test.cards.next;
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
function redistributeCards(state) {
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
        if (state.test.cards === null) {
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
            state.test.cards[category.name].forEach((card) => {
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
function updateCounters(state, numToKeep, numToDiscard) {
    //Get the number of cards which have been kept and discarded
    var numKept = state.test.cards.kept.length;
    var numDiscarded = state.test.cards.discarded.length;

    //Update the html
    $("#keepCounter").text(`${numKept}/${numToKeep}`);
    $("#discardCounter").text(`${numDiscarded}/${numToDiscard}`);

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
//TODO check if wordlist is mutated outside this function
async function displayRandomCard(wordList, state) {
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

    state.test.cards.next = { id: id, color: color };
}

//Runs everytime a card is dropped into the "undecided" dropzone
//Will update the cards record and save state if required
function handleUndecided(_, ui, state) {
    var card = $(ui.draggable);
    var oldDropZoneId = card.attr("dropId");
    var newDropZoneId = $(_.target).attr("dropId");

    if (oldDropZoneId === "undecided") {
        return;
    }

    card.attr("dropId", newDropZoneId);
    moveCard($(card), oldDropZoneId, newDropZoneId, state);
}

//Runs everytime a card is dropped in either the "kept"
//or "discarded" dropzone, will update the cards record
//state and shrink the card if required
async function handleCardDrop(_, ui, state, wordList) {
    var card = $(ui.draggable);
    var oldDropZoneId = card.attr("dropId");
    var newDropZoneId = $(_.target).attr("dropId");

    //If card has not been dropped into any dropzones yet
    //it will be big, and should be shrunk
    if (card.attr("isShrunk") !== "true") {
        shrinkCard($(card));
        //Have to wait for this function to complete before updating
        //the cards array and updating the counter
        if (wordList.length > 0) {
            await displayRandomCard(wordList, state);
        } else {
            state.test.cards.next = false;
            //TODO find all instances of this value being checked
            //The first I can think of is for redirecting users away from this page
            //The plan is to use cards.result instead as a marker of whether
            //the user has actually pressed finish
            state.test.cards.complete = true;
        }
    }

    //If the card has been moved to a different dropzone
    //it should be counted for the new dropzone
    if (oldDropZoneId === newDropZoneId) {
        return;
    }
    card.attr("dropId", newDropZoneId);
    moveCard($(card), oldDropZoneId, newDropZoneId, state);
}

export {
    moveCard,
    shrinkCard,
    displayRandomCard,
    handleUndecided,
    handleCardDrop,
    initTest,
    redistributeCards,
    saveStateToServer,
};
