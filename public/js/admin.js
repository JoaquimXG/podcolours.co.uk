$(function() {
    $("tr td").click(handleRowClick)
} )

function handleRowClick(e) {
    var row = $(e.target.parentElement)
    var username = row.find("[data-id='username']").text()
    var link = `/admin/${username}`

    if (e.ctrlKey) {
        window.open(link)
    }
    else {
        window.location = link
    }
}
