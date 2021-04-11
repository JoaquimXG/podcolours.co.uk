export default () => {
    const toast = toastBuilder({
        target: "body",
        defaultText: "Session lost, please sign in"
    })
    setTimeout(() => window.location.href = "/?loginModal=1", 1000)
    toast();
}
