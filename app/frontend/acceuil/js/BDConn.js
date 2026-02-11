
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function setCurrentUser(username) {
    localStorage.setItem("currentUser", username);
    document.querySelector(".accountName").textContent = username;
}

function loadCurrentUser() {
    const user = getCookie("userConnected") === "true" ? localStorage.getItem("currentUser") : null;
    if (user) {
        document.querySelector(".accountName").textContent = user;
    }
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

function setConnected(username) {
    localStorage.setItem("currentUser", username);
}

function setDisconnected() {
    popupaccount.setAttribute("data-logged-in", "false");
    popupaccount.classList.remove("connected");
    popupaccount.getElementsByTagName("h1")[0].textContent = "Bonjour, vous n'êtes pas connecté !";
}

function setCookie(name, value, options = {}) {
    let cookie = name + "=true";
    if (options.maxAge) {
        cookie += "; max-age=" + Math.floor(options.maxAge / 1000);
    }
    if (options.path) {
        cookie += "; path=" + options.path;
    }
    document.cookie = cookie;
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let c of cookies) {
        const [key, value] = c.split("=");
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}