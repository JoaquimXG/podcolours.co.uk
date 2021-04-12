import setupLoginModal from './modals/loginModal.js'
import {openModal} from './modals/generalModalHandlers.js'
import {addCarouselHandlers, resizeCarousel} from './components/carousel.js'
import checkGetParam from './utilities/checkGetParam.js'

//Selector for carousel on homepage
var carouselId = "carouselSlider"

//Adding modal, carousel and window resize handlers
$(document).ready(function() {
    setupLoginModal("loginModal", "headerLoginButton");
    addCarouselHandlers(carouselId)
    autoOpenModal();
    window.onresize = handleWindowResize;
});

//If loginModal GET param is present, prompt user to login
function autoOpenModal() {
    var loginModal = checkGetParam('loginModal');

    if (loginModal === '1') {
        openModal("loginModal")
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
