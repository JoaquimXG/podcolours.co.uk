export default async function checkIsAuthenticated(callback) {
    var isAuthenticated = false;
    await $.get("/isauthenticated", data => {
        if (data.isAuthenticated) {
            isAuthenticated = true;
        }
        if (callback != undefined) {
            callback(isAuthenticated)
        }
    })
    return isAuthenticated;
}
