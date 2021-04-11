//Checks if a get parameter exists and returns its value
export default function checkGetParam(param) {
    var urlParams = new URLSearchParams(window.location.search)
    var value;

    if (urlParams.has(param)) {
        value = urlParams.get(param)
    }

    return value
}
