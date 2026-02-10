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
    const user = localStorage.getItem("currentUser");
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