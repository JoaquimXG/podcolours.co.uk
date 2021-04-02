export default async function checkIsAuthenticated(callback) {
    var isAuthenticated = false;
    await $.get("/isauthenticated", data => {
        if (data.isAuthenticated) {
            isAuthenticated = true;
        }
        callback(isAuthenticated)
    })
    return isAuthenticated;
}
