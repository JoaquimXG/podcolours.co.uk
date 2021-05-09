export {
    addCarouselHandlers,
    resizeCarousel,
};

//A group of modular functions for providing
//funcionality to any size responsive carousel

var carouselItemWidth;
//Prepares carousel click handlers
function addCarouselHandlers(carouselId) {
    var carousel = $(`#${carouselId}`);
    //Set each item in the carousel to match the size of 
    //the carousels parent container
    carouselItemWidth = $(carousel).parent().width();

    resizeCarousel(carouselId)

    //Add on onclick handler for each carousel button
    //each button will move the carousel to the left 
    //the width of one item * its own index
    $(".carousel__btn").each(function(i) {
        $(this).on("click", function() {
            carousel.css('transform',  `translateX(${i*-carouselItemWidth}px)`);
            $(".carousel__btn--wide").removeClass("carousel__btn--wide")
            $(this).addClass('carousel__btn--wide')
            clearInterval(scrollInterval)
            carouselAutoScroll()
        })
    });

    carouselAutoScroll();
}

//Adjusts the size of the carousel
//and items within it so that only one item is shown at a time
function resizeCarousel(carouselId) {
    var carousel = $(`#${carouselId}`);
    var items = $(".carousel__slider__item")

    carouselItemWidth = $(carousel).parent().width();
    $(".carousel__slider__item").outerWidth(carouselItemWidth)
    $(carousel).width(items.length * carouselItemWidth)
}

//Scrolls the carousel automatically every 5 seconds
//The scrollInterval is cleared when a carousel button is clicked
//to ensure no double scrolls occur when a user clicks
var scrollInterval;
function carouselAutoScroll() {
    scrollInterval = setInterval(function() {
        var currentIndex = $(".carousel__btn--wide").index()
        var buttons = $(".carousel__btn")
        $(buttons[(currentIndex + 1) % buttons.length]).click()
    }, 5000)
}
