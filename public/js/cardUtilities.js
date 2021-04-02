import { wordList } from "./appGlobals.js";

//A record of all the cards that the user has decided to keep during the test
//This Object is also stored in localStorage in the event the browser is closed
var cards;

const CARDWIDTH = 180;
const CARDHEIGHT = 127;
const CARDTRANSTIME = 400;
//TODO Set these to the correct values, 20 and 60 respectively
const NUMTOKEEP = 2;
const NUMTODISCARD = 2;

async function displayAllCards() {
    var categories = ["kept", "discarded", "undecided"]
    categories.forEach(category => {
        cards[category].forEach(card => {
            displayCard([
                {name: "id", value: card.id},
                {name: "color", value: card.color},
                {name: "dropId", value: category},
                {name: "isShrunk", value: "true"}
            ], "card")
        })
    })
    var nextCard = cards.next
    displayCard(
        [
        {name: "id", value: nextCard.id},
        {name: "color", value: nextCard.color},
        {name: "dropId", value: "undecided"},
        {name: "isShrunk", value: "false"}
        ],
        "bigCard card"
    )
}

async function loadProgress(){
    cards = JSON.parse(localStorage.getItem("storedCards"));
    if (cards === null) {
        cards = {
            kept: [],
            discarded: [],
            undecided: [],
            next: {}
        }
        displayRandomCard();
    }
    else {
        await displayAllCards();
        redistributeCards();
    }

    updateCounters();
}

var resizeTimer;
//Redistributes cards on the screen, ensuring they remain in the appropriate sections
function redistributeCards() {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {
        var containerHeight = $("#appPrimaryContainer").outerHeight();
        var containerWidth = $("#appPrimaryContainer").outerWidth();
        var headerHeight = $("#header").outerHeight();

        //Fix size of application page as size of header changes
        $("#appPrimaryContainer").css({
            height: `calc(100vh - ${headerHeight}px)`,
        });
        //Relocate "next" card
        $(".bigCard").css({
            left: 0.5 * (containerWidth - CARDWIDTH*2),
            top: 0.5 * (containerHeight - CARDHEIGHT*2),
        })

        if (cards === null){
            return;
        }

        var categories = ["kept", "discarded", "undecided"]
        var containers = categories.map(category => {
            var container = $(`div[dropId="${category}"]`);
            return {
                name: category,
                container: container,
                height: container.outerHeight()-CARDHEIGHT,
                width: container.outerWidth()-CARDWIDTH
            }
        })

        containers.forEach(category => {
            cards[category.name].forEach(card => {
                var card = $(`[id="${card.id}"]`)
                card.position({
                    my: `left top`,
                    of: category.container,
                    at: `left+${Math.round(category.width*Math.random())} top+${Math.round(category.height*Math.random())}`
                })
            })
        })
    }, 100);
}

//TODO Write documentation
async function moveCard(card, oldKey, newKey, cards){
    var id = card.attr("id");
    var color = card.attr("data-color");

    cards[oldKey] = cards[oldKey].filter(function(checkCard) {
        return checkCard.id != id
    })

    cards[newKey].push({id: id, color: color})
    updateCounters();

    localStorage.setItem("storedCards", JSON.stringify(cards));
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

//TODO Write documentation
async function displayCard(attributes, classes){
    var id = attributes[0].value
    var appBackground = $("#appPrimaryContainer");

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

    attributes.forEach(attr => {
        $newCard.attr(attr.name, attr.value);
    })
    appBackground.append($newCard);
}

//Displays a random card in the center of the screen
async function displayRandomCard() {
    var randomCardIndex = Math.floor(Math.random() * wordList.length);
    var randomCard = wordList.splice(randomCardIndex, 1)[0];

    var id = randomCard.word
    var color = randomCard.color
    var dropId = "undecided"

    var appBackground = $("#appPrimaryContainer");
    var containerWidth = $("#appPrimaryContainer").outerWidth();
    var containerHeight = $("#appPrimaryContainer").outerHeight();


    var $newCard = $("<div />")
        .addClass("card bigCard")
        .text(id)
        .attr("id", id)
        .attr("data-color", color)
        .attr("dropId", dropId)
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

    cards.next = {id: id, color: color}
}

//TODO rewrite documentation
function handleUndecided(_, ui) {
    var card = $(ui.draggable);
    var oldDropZoneId = card.attr('dropId');
    var newDropZoneId = $(this).attr('dropId')
    card.attr("dropId", newDropZoneId);

    if (oldDropZoneId === 'undecided') {
        return;
    }
    moveCard($(card), oldDropZoneId, newDropZoneId, cards)
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
        //Have to wait for this function to complete before updating
        //the cards array and updating the counter
        await displayRandomCard();
    }

    //If the card has been moved to a different dropzone 
    //it should be counted for the new dropzone
    if (oldDropZoneId === newDropZoneId) {
        return;
    }
    card.attr('dropId', newDropZoneId); 
    moveCard($(card), oldDropZoneId, newDropZoneId, cards)
}

export {
    moveCard,
    shrinkCard,
    displayRandomCard,
    handleUndecided,
    handleCardDrop,
    loadProgress,
    redistributeCards,
}
