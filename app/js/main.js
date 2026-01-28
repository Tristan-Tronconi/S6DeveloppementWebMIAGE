/* popup logic */

let popupaccount = document.getElementById("popup-account");
let popuplogin = document.getElementById("popup-login");
let popupsignup = document.getElementById("popup-signup");



function togglePopup(e) {
    if (e.classList.contains("popupVisible")) {
        e.classList.remove("popupVisible");
    } else {
        e.classList.add("popupVisible");
    }  
}

document.getElementById("account-btn").addEventListener("click", function() {
    if (popupaccount.getAttribute("data-logged-in") !== "true") {
        togglePopup(popupaccount);
        popuplogin.classList.remove("popupVisible");
        popupsignup.classList.remove("popupVisible");
    }
    
});

document.getElementById("loginButton").addEventListener("click", function() {
    togglePopup(popuplogin);
    togglePopup(popupaccount);
});

document.getElementById("signupButton").addEventListener("click", function() {
    togglePopup(popupsignup);
    togglePopup(popupaccount);
});

for (let btn of document.getElementsByClassName("close")) {
    btn.addEventListener("click", function() {
        btn.parentElement.classList.remove("popupVisible");
    });
}

/* todo ajouter mdp oublié et pas encore de compte */
/* todo ajouter le refus de connexion */
/* todo ajouter la deconnexion */

/* connexion logic */

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


function logout() {
    localStorage.removeItem("currentUser");
    document.querySelector(".accountName").textContent = "";
    popupaccount.setAttribute("data-logged-in", "false");
    popupaccount.classList.remove("connected");
}

function connectUser(username) {
    setCurrentUser(username);
    popupsignup.classList.remove("popupVisible");
    popupaccount.setAttribute("data-logged-in", "true");
    popupaccount.classList.add("connected");
    setTimeout(() => { 
        logout();
    }, 30000);
}


/* ---------- SIGNUP ---------- */

document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value;
    if (!username || !password) return;
    const users = getUsers();
    if (users.find(u => u.username === username)) { /* todo ajouter le refus d'inscription sans alert */
        alert("Utilisateur déjà existant");
        return;
    }
    const passwordHash = await hashPassword(password);
    users.push({ username, passwordHash });
    saveUsers(users);
    connectUser(username);
});


/* ---------- LOGIN ---------- */

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const users = getUsers();
    const passwordHash = await hashPassword(password);
    const user = users.find(
        u => u.username === username && u.passwordHash === passwordHash
    );
    if (!user) { /* todo ajouter le refus de connexion sans alert */
        alert("Identifiants incorrects");
        return;
    }
    connectUser(username);
});

loadCurrentUser();