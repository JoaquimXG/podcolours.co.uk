import checkIsAuthenticated from "../checkIsAuthenticated.js";
import toastBuilder from '../toast.js'
import requestUserSignIn from '../requestUserSignIn.js'


import {displayRandomCard, displayCard} from './displayCards.js'
import {updateCounters} from './droppableHandlers.js'
import {config} from './appGlobals.js'


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
                complete: false
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

    updateCounters(state, config.NUMTOKEEP, config.NUMTODISCARD);

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
            requestUserSignIn();
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

    return state;
}

//Sends the current state of the test to be saved by the server
async function saveStateToServer(redirect, shouldToast, state) {
    //Create function for generating toast notification
    const toast = toastBuilder({
        target: "#appPrimaryContainer",
        topOffset: 100
    })

    //Only post data if user is signed in
    window.isAuth = await checkIsAuthenticated();
    if (window.isAuth == true) {
        $.post({
            type: "POST",
            url: "/test/saveState",
            data: {
                test: JSON.stringify(state.test),
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
                    requestUserSignIn()
                }
            })
            .fail(() => {
                requestUserSignIn()
            });
    } else {
        requestUserSignIn();
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
            left: 0.5 * (containerWidth - config.CARDWIDTH * 2),
            top: 0.5 * (containerHeight - config.CARDHEIGHT * 2),
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
                height: container.outerHeight() - config.CARDHEIGHT,
                width: container.outerWidth() - config.CARDWIDTH,
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

export {
    initTest,
    redistributeCards,
    saveStateToServer,
};
