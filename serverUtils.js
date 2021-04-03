module.exports = {
    errorHandler,
    countKeptCards
}
//Error handler
function errorHandler(err, _, res, _) {
    var text = err
    res.status(500)
    var error = {
        title: "Oh no, we are having trouble with your request. ",
        text: text,
        img: "/img/logo.png"
    }
    res.render("pages/error", {error: error});
}

//Counts the number of each colour that has been kept
//to dispay to the user.
function countKeptCards(cards) {
    if (!cards.next) {
        return {red: 0, blue: 0, yellow: 0, green: 0}
    }
    var colors = ["red", "blue", "green", "yellow"];
    var colorCounts = {}
    colors.forEach((color) => {
        var count = cards.kept.filter((card)=> card.color == color).length
        colorCounts[color] = count;
    })
    return colorCounts;
}
