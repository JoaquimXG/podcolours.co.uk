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

    var fields = [
        {
            selector: "#profileNameInput",
            id: "name"
        },
        {
            selector: "#profileUniversityInput",
            id: "university"
        },
        {
            selector: "#profileDepartmentInput",
            id: "department"
        },
        {
            selector: "#profileEmailInput",
            id: "email",
            re: true,
            reString: /^\S+@\S+\.\S+$/
        },
        {
            selector: "#profilePasswordInput",
            id: "password",
            canBeEmpty: true
        },
    ]

    var data = validateForm(fields)
    
    if (!data.isValid) {
        return;
    }

    $.post({
        type: "POST",
        url: "/updateuser",
        data: data,
        dataType: "json"
    })
        .done(data => {
            //Redirect to profile page if user created 
            if (data.userUpdated === true) {
                window.location.href = "/profile"
            }
            //TODO show red toast notification for user existing already
            else if(data.errorCode === 1) {
                $("#signUpModalTitle")
                    .text("Sorry, this email is taken")
                $("#signUpEmail").addClass("formFieldError")
            }
        })
        //TODO Handle server failure
        .fail(() => {
            alert(`Server Error Please try again`)  
        })

    $("#profileSaveButton").hide()
    $("#profileEditButton").show()
    $(".profileInput").hide()
    $(".profileFieldText").show()
}
