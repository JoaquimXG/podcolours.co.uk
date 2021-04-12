import {config} from './appGlobals.js'
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
            left: 0.5 * (containerWidth - config.CARDWIDTH * 2),
            top: 0.5 * (containerHeight - config.CARDHEIGHT * 2),
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

export {
    displayRandomCard,
    displayCard
}
