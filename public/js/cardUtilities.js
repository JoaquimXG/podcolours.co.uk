import { wordList, setWordList } from "./appGlobals.js";

//Contains the current state of each card
//wether it is "kept", "discarded", "undecided" 
//or the next card to be handled
var cards = {
    kept: [],
    discarded: [],
    undecided: [],
    next: {}
}

const CARDWIDTH = 180;
const CARDHEIGHT = 127;
const CARDTRANSTIME = 400;
//TODO Set these to the correct values, 20 and 60 respectively
const NUMTOKEEP = 20;
const NUMTODISCARD = 60;

//Loads previous test state from localstorage
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
        updateWordList();
        await displayAllCards();
        redistributeCards();
    }

    updateCounters();
}

//When loading a previous test, removes all words from the 
//wordList which have already been shown 
function updateWordList() {
    var allCards = cards.kept.concat(cards.discarded).concat(cards.undecided)
    allCards.push(cards.next)
    allCards = allCards.map(card => card.id)

    var temp = wordList.filter((card) => {
        return allCards.indexOf(card.id) < 0
    })
    setWordList(temp)
}

//Adds each card which needs to be loaded into the DOM
//ready to be position in the appropriate divs
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
    if (nextCard === false){
        return;
    }
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

var resizeTimer;
//Moves all cards into their appropriate positions
//Big card is centered and all other cards are moved into their dropzones
//This function is run when first loading saved progress
//and on every viewport resize
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

//Runs everytime a card is moved to a different dropzone
//Ensures the cards record object has been updated to reflect
//the change and updates the localStorage
//TODO ajax to post data back to be saved to database
function moveCard(card, oldKey, newKey, cards){
    var id = card.attr("id");
    var color = card.attr("data-color");

    cards[oldKey] = cards[oldKey].filter(function(checkCard) {
        return checkCard.id != id
    })

    cards[newKey].push({id: id, color: color})
    updateCounters();

    localStorage.setItem("storedCards", JSON.stringify(cards));
    localStorage.setItem("lastTestUpdate", Date.now())
}

//Ensures counters for kept and discarded sections
//display the appropriate value
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

//Scales cards by half when they are first dropped into a dropzone
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

//Adds a specific new card to the DOM
//takes an array of attributes and string of classes
//to be added to the new card
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

//Displays a random big card in the center of the screen
async function displayRandomCard() {
    var randomCardIndex = Math.floor(Math.random() * wordList.length);
    var randomCard = wordList.splice(randomCardIndex, 1)[0];

    var id = randomCard.id
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

//Runs everytime a card is dropped into the "undecided" dropzone
//Will update the cards record and save state if required
function handleUndecided(_, ui) {
    var card = $(ui.draggable);
    var oldDropZoneId = card.attr('dropId');
    var newDropZoneId = $(this).attr('dropId')

    if (oldDropZoneId === 'undecided') {
        return;
    }
    card.attr("dropId", newDropZoneId);
    moveCard($(card), oldDropZoneId, newDropZoneId, cards)
}

//Runs everytime a card is dropped in either the "kept"
//or "discarded" dropzone, will update the cards record
//state and shrink the card if required
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
        if (wordList.length > 0){
            await displayRandomCard();
        }
        else {
            cards.next = false
        }
    }

    //If the card has been moved to a different dropzone 
    //it should be counted for the new dropzone
    if (oldDropZoneId === newDropZoneId) {
        return;
    }
    card.attr('dropId', newDropZoneId); 
    moveCard($(card), oldDropZoneId, newDropZoneId, cards)
}

//Sends the current state of the test to be saved by the server
function saveStateToServer(redirect) {
    var cards = JSON.parse(localStorage.getItem('storedCards'));
    var testSate = JSON.parse(localStorage.getItem("testState"))
    var lastUpdate = Date.parse(localStorage.getItem("lastTestUpdate"))

    //Handle fields being empty
    $.post({
        type: "POST",
        url: "/test/saveState",
        data: {
            cards: cards,
            testState: testSate,
            lastUpdate: lastUpdate
        },
        dataType: "json"
    })
        .done(data => {
            //Redirect to profile page if user created 
            if (data.success === true) {
                if (redirect){
                    window.location.href = "/profile"
                }
            }
            else {
                console.log(data.error)
            }
        })
        //TODO Handle server failure
        .fail(() => {
            alert(`Server Error Please try again`)  
        })
}


export {
    moveCard,
    shrinkCard,
    displayRandomCard,
    handleUndecided,
    handleCardDrop,
    loadProgress,
    redistributeCards,
    saveStateToServer
}
