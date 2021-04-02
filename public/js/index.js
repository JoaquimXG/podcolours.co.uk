import {addLoginModalHandlers, openLoginModal} from './loginModal.js'
import {addCarouselHandlers, resizeCarousel} from './carousel.js'
import checkGetParam from './checkGetParam.js'

var carouselId = "carouselSlider"

$(document).ready(function() {
    addLoginModalHandlers();
    addCarouselHandlers(carouselId)
    autoOpenModal();
    window.onresize = handleWindowResize;
});

function autoOpenModal() {
    var loginModal = checkGetParam('loginModal');

    if (loginModal === '1') {
        openLoginModal()
    }
}

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
