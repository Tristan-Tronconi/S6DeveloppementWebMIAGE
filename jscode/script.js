    document.getElementById('btn').addEventListener('click', function() {
        console.log('Button was clicked');
        document.getElementById('result').textContent = 'Button was clicked';
    });


document.getElementById('btnColor').addEventListener('click', function() {
    let div = document.getElementById('div');
    div.style.backgroundColor = "rgb(" + 
        Math.floor(Math.random() * 256) + "," + 
        Math.floor(Math.random() * 256) + "," + 
        Math.floor(Math.random() * 256) + ")";
});

document.addEventListener('mousemove', function(event) {
    document.getElementById('pousepos').textContent =   "X: " + Math.floor(event.clientX) + 
                                                        " Y: " + Math.floor(event.clientY);
});

document.addEventListener('scroll', function(event) {
    console.log("scrolling");
    pourcentscroll = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    pourcentscroll = Math.min(Math.max(pourcentscroll, 0), 1);
    document.querySelector('nav div').style.width = pourcentscroll * window.innerWidth + "px";
    document.querySelector('.navText').textContent = Math.floor(pourcentscroll * 100) + "%";
});


document.getElementById("formBase").addEventListener('submit', function(event) {
    event.preventDefault();
    let text1 = document.getElementById("inputText").value;
    let text2 = document.getElementById("inputText2").value;
    if (text1 === "" || text2 === "") {
        document.getElementById('resultatForm').innerHTML = "Veuillez remplir les deux champs.";
        return;
    }
    document.getElementById('resultatForm').innerHTML = "Vous avez entré : <br/>texte 1 : " + text1 + "<br/>texte 2 :  " + text2;
});