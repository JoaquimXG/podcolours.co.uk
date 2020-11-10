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
    "Supportive",
];

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
