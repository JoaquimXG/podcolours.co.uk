import {setupModal } from './generalModalHandlers.js'

function setupRandomPersonModal(id, openModalButtonId) {
    setupModal(id, openModalButtonId)
}

//POSTs test result to server to request
//a random person with the same personality type
async function requestRandomPerson(result, cb) {
    $.ajax({
        url: "test/getpeople",
        type: "POST",
        data: {result: result},
        success: (data) => {
            $("#randomPersonTitle")
                .text(data.person)
                .addClass(result);
            cb()
        },
    })
}

export { setupRandomPersonModal, requestRandomPerson }
