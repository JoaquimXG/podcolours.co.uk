import {addLoginModalHandlers} from './loginModal.js'
import {addCarouselHandlers, resizeCarousel} from './carousel.js'

var carouselId = "carouselSlider"

$(document).ready(function() {
    addLoginModalHandlers();
    addCarouselHandlers(carouselId)
    window.onresize = handleWindowResize;
});

//Perform actions required on window resize
//Timeout ensures that function runs only once on 
//each resize
var resizeTimer;
function handleWindowResize() {
    clearTimeout(resizeTimer)

    resizeTimer = setTimeout(function() {
        //Resize carousel as parent container size may have changed
        resizeCarousel(carouselId)
    }, 150)
}
