export default function validateForm(fields) {
    var returnForm = {}
    returnForm.isValid = true;
    fields.forEach((field) => {
        var el = $(field.selector)
        el.on("input", function() {
            $(this).removeClass("formFieldError")
        })

        var val = el.val()
        if (val === "") {
            el.addClass("formFieldError")
            returnForm.isValid = false;
            return;
        }
        else if (field.re) {
            if (field.reString.test(val) === false) {
                el.addClass("formFieldError")
                returnForm.isValid = false;
                return;
            }
            else {
                returnForm[field.id] = val;
            }
        }
        else {
            returnForm[field.id] = val;
        }
    })
    return returnForm;
}
