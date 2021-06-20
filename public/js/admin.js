$(function () {
    $("tr td").click(handleRowClick);
    $("#admin__search").on("input", handleSearchInput);
});

var searchInputTimer;
function handleSearchInput() {
    clearTimeout(searchInputTimer);

    searchInputTimer = setTimeout(function () {
        filterTable();
    }, 200);
}

function filterTable() {
    var value = $("#admin__search").val().toLowerCase();
    var rows = $("tr").slice(1);
    rows.show()

    var rowsToHide = rows.filter((_, row) => {
        return row.children[0].textContent.toLowerCase().search(value) < 0;
    })

    rowsToHide.hide()
}

function handleRowClick(e) {
    var row = $(e.target.parentElement);
    var username = row.find("[data-id='username']").text();
    var link = `/adminUserResults/${username}`;

    if (e.ctrlKey) {
        window.open(link);
    } else {
        window.location = link;
    }
}
