import validateForm from './validateForm.js'

//Add event handlers for handling editting user values
$(function() {
    $("#profileSaveButton").hide()
    $("#profileEditButton").click(handleEdit)
    $("#profileSaveButton").click(handleSave)
    $(".profileInput").hide()
})

//Handle edit button clicked
//Setup form for editing
function handleEdit(e) {
    e.preventDefault()

    $("#profileEditButton").hide()
    $("#profileSaveButton").show()
    $(".profileFieldText").hide()
    $(".profileInput").show()
}

//Handle save button clicked
//Validate form fields and send data to server
function handleSave(e) {
    e.preventDefault()

    //Array for fields in form to be validated
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
    
    //If form was not valid, don't send data
    if (!data.isValid) {
        return;
    }

    //Post data to server
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

    //Return form to default
    $("#profileSaveButton").hide()
    $("#profileEditButton").show()
    $(".profileInput").hide()
    $(".profileFieldText").show()
}
