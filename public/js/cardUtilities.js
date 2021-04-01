import { wordList } from "./appGlobals.js";

//A record of all the cards that the user has decided to keep during the test
//This Object is also stored in localStorage in the event the browser is closed
var cards = {
    kept: [],
    discarded: [],
    undecided: [],
};

const CARDWIDTH = 180;
const CARDHEIGHT = 127;
const CARDTRANSTIME = 400;
//TODO Set these to the correct values, 20 and 60 respectively
const NUMTOKEEP = 2;
const NUMTODISCARD = 2;

function loadProgress(){
    cards = JSON.parse(localStorage.getItem("storedCards"));
    updateCounters();
}

//TODO Write documentation
async function moveCard(card, oldKey, newKey, cards){
    var id = card.attr("id");
    var color = card.attr("data-color");

    cards[oldKey] = cards[oldKey].filter(function(checkCard) {
        return checkCard.id != id
    })

    cards[newKey].push({id: id, color: color})
    localStorage.setItem("storedCards", JSON.stringify(cards));

    updateCounters();
}

//TODO Write documentation
function updateCounters() {
    var numKept = cards.kept.length
    var numDiscarded = cards.discarded.length
    $("#keepCounter").text(`${numKept}/${NUMTOKEEP}`)
    $("#discardCounter").text(`${numDiscarded}/${NUMTODISCARD}`)
    if (numKept == NUMTOKEEP && numDiscarded == NUMTODISCARD){
        $("#completeTest").prop("disabled", false);
    }
    else {
        $("#completeTest").prop("disabled", true);
    }
}

//TODO Write documentation
function shrinkCard(card) {
    card.attr("isShrunk", "true")
    var pos = card.position();
    card.addClass("cardTrans")
        .css({
            left: 0.5 * CARDWIDTH + pos.left,
            top: 0.5 * CARDHEIGHT + pos.top
        })
        .removeClass("bigCard") 

    setTimeout((card) => card.removeClass("cardTrans"), CARDTRANSTIME, $(card));
}

//Displays a random card in the center of the screen
function displayCard() {
    var randomCardIndex = Math.floor(Math.random() * wordList.length);
    var randomCard = wordList.splice(randomCardIndex, 1)[0];

    var appBackground = $("#appPrimaryContainer");
    var containerWidth = $("#appPrimaryContainer").outerWidth();
    var containerHeight = $("#appPrimaryContainer").outerHeight();

    var $newCard = $("<div />")
        .addClass("bigCard card")
        .text(randomCard.word)
        .attr("id", randomCard.word)
        .attr("data-color", randomCard.color)
        .attr("dropId", "undecided")
        .css({
            position: "absolute",
            left: 0.5 * (containerWidth - CARDWIDTH*2),
            top: 0.5 * (containerHeight - CARDHEIGHT*2),
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
}

//TODO rewrite documentation
function handleUndecided(_, ui) {
    var card = $(ui.draggable);
    var oldDropZoneId = card.attr('dropId');
    card.attr("dropId", 'undecided');

    if (oldDropZoneId === 'undecided') {
        return;
    }
    moveCard($(card), oldDropZoneId, "undecided", cards)
}

//TODO rewrite documentation
async function handleCardDrop(_, ui) {
    var card = $(ui.draggable);
    var oldDropZoneId = card.attr('dropId')
    var newDropZoneId = $(this).attr('dropId')

    //If card has not been dropped into any dropzones yet
    //it will be big, and should be shrunk
    if (card.attr('isShrunk') !== 'true'){
        shrinkCard($(card))
        displayCard();
    }

    //If the card has been moved to a different dropzone 
    //it should be counted for the new dropzone
    if (oldDropZoneId === newDropZoneId) {
        return;
    }
    card.attr('dropId', newDropZoneId); 
    await moveCard($(card), oldDropZoneId, newDropZoneId, cards)

    updateCounters()
}

export {
    moveCard,
    shrinkCard,
    displayCard,
    handleUndecided,
    handleCardDrop,
    loadProgress
}
