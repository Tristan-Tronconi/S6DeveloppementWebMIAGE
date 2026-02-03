const game = document.getElementById("game");
const startBtn = document.getElementById("start");

let size, mineCount;
let grid = [];
let revealedCount = 0;
let flagCount = 0;
let mineElem = document.getElementById("mineCount");
let tailleElem = document.getElementById("size");
let minePercentElem = document.getElementById("minePercent");

startBtn.onclick = () => startGame();

function startGame() {
    game.innerHTML = "";
    grid = [];
    revealedCount = 0;
    flagCount = 0;
    updateMineCount();
    game.style.gridTemplateColumns = `repeat(${size}, 32px)`;
    createGrid();
    placeMines();
    calculateNumbers();
    renderGrid();
}

function createGrid() {
    for (let y = 0; y < size; y++) {
        grid[y] = [];
        for (let x = 0; x < size; x++) {
            grid[y][x] = {
                mine: false,
                number: 0,
                revealed: false,
                flagged: false,
                x, y
            };
        }
    }
}

function placeMines() {
    let placed = 0;
    while (placed < mineCount) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        if (!grid[y][x].mine) {
        grid[y][x].mine = true;
        placed++;
        }
    }
}

function calculateNumbers() {
    forEachCell(cell => {
        if (cell.mine) return;
        cell.number = getNeighbors(cell).filter(n => n.mine).length;
    });
}

function renderGrid() {
    do {
        forEachCell(cell => {
        const div = document.createElement("div");
        div.className = "cell";

        div.oncontextmenu = e => {
            e.preventDefault();
            handleClick(cell, div, false);
        };

        div.onclick = () => handleClick(cell, div, true);

        cell.div = div;
        game.appendChild(div);
        });
    } while (!canGenerateZero());
    let xi= -1 ;
    let yi= -1 ;
    do {
        xi = Math.floor(Math.random() * size);
        yi = Math.floor(Math.random() * size);
        if (grid[yi][xi].number === 0 && !grid[yi][xi].mine) { 
            grid[yi][xi].div.classList.add("zero");
            break;
        }

    } while (1);
}

function canGenerateZero() {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
        if (grid[y][x].number === 0 && !grid[y][x].mine) {
            return true;
        }
        }
    }
    return false;
}

function handleClick(cell, div, leftClick) {
    if (!cell.revealed) handlePrimaryAction(cell, div, leftClick);
    else handleSecondaryAction(cell, div, leftClick);
}

function handlePrimaryAction(cell, div, leftClick) {
    const mode = document.getElementById("mode").value;
    if (leftClick) {
        if (mode === "mine" || cell.div.classList.contains("zero")) {
        revealCell(cell);
        } else {
        toggleFlag(cell);
        }
    } else {
        if (mode === "flag" || cell.div.classList.contains("zero")) {
        revealCell(cell);
        } else {
        toggleFlag(cell);
        }
    }
}

function handleSecondaryAction(cell, div, leftClick) {
    const mode = document.getElementById("mode").value;
    const neighbors = getNeighbors(cell);

    let flagsAround = 0;
    let hiddenAround = 0;

    for (const c of neighbors) {
        if (c.flagged) flagsAround++;
        else if (!c.revealed) hiddenAround++;
    }

    const canAutoFlag = cell.number - flagsAround - hiddenAround === 0;
    const canAutoReveal = flagsAround >= cell.number;

    const wantFlag =
        (leftClick && mode === "flag") ||
        (!leftClick && mode === "mine");

    const wantReveal =
        (leftClick && mode === "mine") ||
        (!leftClick && mode === "flag");

    if (wantFlag && canAutoFlag) {
        neighbors.forEach(c => {
        if (!c.revealed && !c.flagged) {
            toggleFlag(c);
        }
        });
    }

    if (wantReveal && canAutoReveal) {
        neighbors.forEach(c => {
        if (!c.revealed && !c.flagged) {
            revealCell(c);
        }
        });
    }
}


//todo ajouter fonctionnalités incrémentales comme erreurs possibles, chronomètre, score, niveaux, sauvegarde,indicateur mines restantes
function revealCell(cell) {
    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;
    revealedCount++;

    cell.div.classList.add("revealed");
    cell.div.classList.remove("zero");

    if (cell.mine) {
        cell.div.textContent = "💣";
        cell.div.classList.add("exploded");
        handleLoss();
        return;
    }

    if (cell.number === 0) {
        getNeighbors(cell).forEach(revealCell);
    } else {
        cell.div.textContent = cell.number;
    }
    if (isWon())   handleWin();
}

function isWon() {
    let nb = 0;
    forEachCell(cell => {
        if (cell.mine && !cell.flagged) nb++;
    });
    return nb === 0 && flagCount === mineCount;
}

function handleWin() {
    alert("🎉 You win!");
}

function handleLoss() {
  //alert("💥 BOOM !");
}

function toggleFlag(cell) {
    if (cell.revealed) return;

    if (cell.flagged) {
        cell.flagged = false;
        cell.div.textContent = "";
        flagCount--;
    } else {
        cell.flagged = true;
        cell.div.textContent = "🚩";
        flagCount++;
    }
}

function getNeighbors(cell) {
    const neighbors = [];
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = cell.x + dx;
        const ny = cell.y + dy;
        if (nx >= 0 && ny >= 0 && nx < size && ny < size) {
            neighbors.push(grid[ny][nx]);
        }
        }
    }
    return neighbors;
}

function forEachCell(fn) {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
        fn(grid[y][x]);
        }
    }
}

tailleElem.addEventListener("change", (e) => {
    let val = parseInt(e.target.value);
    if (val < 5) val = 5;
    if (val > 30) val = 30;
    e.target.value = val;
    updateMineCount();
});

minePercentElem.addEventListener("change", (e) => {
    let val = parseInt(e.target.value);
    if (val < 5) val = 5;
    if (val > 95) val = 95;
    e.target.value = val;
    updateMineCount();
});

function updateMineCount() {
    size = parseInt(tailleElem.value);
    let percent = parseInt(minePercentElem.value);
    mineCount = Math.floor(size * size * percent / 100);
    console.log(size + " * " + size + " * " + percent + " / 100 = " + mineCount);
    mineElem.textContent = mineCount;
}

startGame()
