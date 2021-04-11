import {saveStateToServer} from './stateManagement.js'
import {displayRandomCard} from './displayCards.js'
import {config} from './appGlobals.js'

// -------------- Real time test application functions ------------------

//Runs everytime a card is moved to a different dropzone
//Updates state and saves the changes to storage or server
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
    updateCounters(state, config.NUMTOKEEP, config.NUMTODISCARD);

    //State has been updated, so update timestamp
    state.test.ts = Date.now();

    if (window.isAuth) {
        //Save most recent state to server
        saveStateToServer(false, false, state);
    }
    else {
        //Store newly updated categories in localStorage
        localStorage.setItem("test-local", JSON.stringify(state));

    }
}

//Updates counters for kept and discarded cards to reflect state
function updateCounters(state, numToKeep, numToDiscard) {
    //Get the number of cards which have been kept and discarded
    var numKept = state.test.cards.kept.length;
    var numDiscarded = state.test.cards.discarded.length;

    //Update the DOM
    $("#keepCounter").text(`${numKept}/${numToKeep}`);
    $("#discardCounter").text(`${numDiscarded}/${numToDiscard}`);

    //If the correct numbers have been reached, allow the user to complete the test
    if (numKept == config.NUMTOKEEP && numDiscarded == config.NUMTODISCARD) {
        $("#completeTest").prop("disabled", false);
    } else {
        $("#completeTest").prop("disabled", true);
    }
}

//Shrinks a given card by a factor of 2
function shrinkCard(card) {
    //Ensures cards aren't shrunk again 
    card.attr("isShrunk", "true");
    var pos = card.position();

    //Shrinks card around its center
    card.addClass("cardTrans")
        .css({
            left: 0.5 * config.CARDWIDTH + pos.left,
            top: 0.5 * config.CARDHEIGHT + pos.top,
        })
        .removeClass("bigCard");

    //Remove the transition class when no longer required
    setTimeout((card) => card.removeClass("cardTrans"), config.CARDTRANSTIME, $(card));
}


//Moves a card from its current category into the undecided category
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

//Moves a card from the "next" category into the category it was dropped into
async function handleCardDrop(_, ui, state, wordList) {
    var card = $(ui.draggable);
    var oldDropZoneId = card.attr("dropId");
    var newDropZoneId = $(_.target).attr("dropId");

    //Shrink card if it hasn't been already
    if (card.attr("isShrunk") !== "true") {
        shrinkCard($(card));
        if (wordList.length > 0) {
            //Display next card if any more to display
            await displayRandomCard(wordList, state);
        } else {
            //Adjust variables to indicate test is complete
            state.test.cards.next = false;
            state.test.cards.complete = true;
        }
    }

    //If card has not changed dropzone, do nothing
    if (oldDropZoneId === newDropZoneId) {
        return;
    }
    card.attr("dropId", newDropZoneId);
    moveCard($(card), oldDropZoneId, newDropZoneId, state);
}

export {
    handleUndecided,
    handleCardDrop,
    updateCounters
};
