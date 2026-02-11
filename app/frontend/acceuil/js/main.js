/* popup logic */


/* todo ajouter mdp oublié et pas encore de compte */

let popupaccount = document.getElementById("popup-account");
let popuplogin = document.getElementById("popup-login");
let popupsignup = document.getElementById("popup-signup");
let popupaccountConnected = document.getElementById("popup-accountConnected");

function togglePopup(e) {
    if (e.classList.contains("popupVisible")) {
        e.classList.remove("popupVisible");
    } else {
        e.classList.add("popupVisible");
    }  
}

document.getElementById("account-btn").addEventListener("click", function() {
    if (getCookie("userConnected") === "true") {
        togglePopup(popupaccountConnected);
        popupaccount.classList.remove("popupVisible");
        popuplogin.classList.remove("popupVisible");
        popupsignup.classList.remove("popupVisible");
    } else {
        togglePopup(popupaccount);
        popuplogin.classList.remove("popupVisible");
        popupsignup.classList.remove("popupVisible");
        popupaccountConnected.classList.remove("popupVisible");
    }
    
});

if (getCookie("userConnected") === "true") {
    document.querySelector(".accountName").textContent = localStorage.getItem("currentUser");
} else {
    document.querySelector(".accountName").textContent = "";
}

document.getElementById("loginButton").addEventListener("click", function() {
    togglePopup(popuplogin);
    togglePopup(popupaccount);
});

document.getElementById("signupButton").addEventListener("click", function() {
    togglePopup(popupsignup);
    togglePopup(popupaccount);
});

for (let e of document.getElementsByClassName("popup")) {//ajout des composants commun aux popup
    let close = document.createElement("div");
    close.className = "close";
    close.innerHTML = "x";
    e.appendChild(close);
}

for (let btn of document.getElementsByClassName("close")) {
    btn.addEventListener("click", function() {
        btn.parentElement.classList.remove("popupVisible");
    });
}

/* connexion logic */

function connectUser(username) {
    setCurrentUser(username);
    popupsignup.classList.remove("popupVisible");
    setCookie("userConnected", username, { path: "/", maxAge: 15 * 60 * 1000 });
    popupaccount.classList.add("connected");
    popupaccount.getElementsByTagName("h1")[0].textContent = "Bonjour," + document.querySelector(".accountName").textContent + " vous êtes connecté !";
    setTimeout(() => { 
        logout();
    }, (15 * 60 * 1000) );
}


/* ---------- SIGNUP ---------- */


document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value;
    if (!username || !password) return;
    const users = getUsers();
    if (users.find(u => u.username === username)) {
        e.target.querySelector(".erreur").textContent = "Utilisateur déjà existant";
        
        return;
    }
    const passwordHash = await hashPassword(password);
    users.push({ username, passwordHash });
    saveUsers(users);
    connectUser(username);
    togglePopup(popupsignup);
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
    if (!user) {
        alert("Identifiants incorrects");
        return;
    }
    connectUser(username);
    togglePopup(popuplogin);
});

loadCurrentUser();

/* ---------- LOGOUT ---------- */

function logout() {
    localStorage.removeItem("currentUser");
    document.querySelector(".accountName").textContent = "";
    setCookie("userConnected", "false", { path: "/", maxAge: 0 });
    popupaccount.classList.remove("connected");
}

document.getElementById("logoutForm").addEventListener("submit", function (e) {
    e.preventDefault();
    logout();
    togglePopup(popupaccountConnected);
});