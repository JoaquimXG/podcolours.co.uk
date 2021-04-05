import validateForm from './validateForm.js'

$(function() {
    $("#profileSaveButton").hide()
    $("#profileEditButton").click(handleEdit)
    $("#profileSaveButton").click(handleSave)
    $(".profileInput").hide()

})

function handleEdit(e) {
    e.preventDefault()
    console.log("Editing values")

    $("#profileEditButton").hide()
    $("#profileSaveButton").show()
    $(".profileFieldText").hide()
    $(".profileInput").show()
}

function handleSave(e) {
    e.preventDefault()
    console.log("Saving Changes")

    var form = {
        ready: true,
        fields : [
            {
                selector: "#profileNameInput"
            },
            {
                selector: "#profileUniversityInput"
            },
            {
                selector: "#profileDepartmentInput"
            },
            {
                selector: "#profileEmailInput",
                re: true,
                reString: /^\S+@\S+\.\S+$/
            },
            {
                selector: "#profilePasswordInput"
            },
        ]
    }

    form = validateForm(form)
    
    if (!form.ready) {
        return;
    }

    $("#profileSaveButton").hide()
    $("#profileEditButton").show()
    $(".profileInput").hide()
    $(".profileFieldText").show()
}
