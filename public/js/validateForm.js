export default function validateForm(form) {
    form.fields.forEach((field) => {
        var el = $(field.selector)
        el.on("input", function() {
            $(this).removeClass("formFieldError")
        })

        field.val = el.val()
        if (field.val === "") {
            el.addClass("formFieldError")
            form.ready = false;
            return;
        }
        if (field.re) {
            if (field.reString.test(field.val) === false) {
                el.addClass("formFieldError")
                form.ready = false;
                return;
            }
        }
    })
    return form;
}
