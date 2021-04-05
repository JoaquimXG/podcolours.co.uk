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

    $("#profileSaveButton").hide()
    $("#profileEditButton").show()
    $(".profileInput").hide()
    $(".profileFieldText").show()
}
