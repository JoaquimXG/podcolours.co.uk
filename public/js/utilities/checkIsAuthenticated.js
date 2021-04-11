//Performs a get request to /isauthenticated and returns 
//a boolean value, true if user is authenticated, false otherwise 
//Takes a callback which will be passed the resulting boolean 
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
