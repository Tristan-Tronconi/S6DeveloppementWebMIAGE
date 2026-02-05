class Grid {
    constructor(size, prc_mines) {
        this.size = size;
        this.prc_mines = prc_mines;
        const mineCount = Math.floor((size * size * prc_mines) / 100);
        this.revealedCount = 0;
        this.flagCount = 0;
        this.cells = this.createEmptyGrid();
        // améliorable :
        this.allowedErrors = 0;
        this.greenHints = 0;
    }

    createEmptyGrid() {
        const grid = [];
        for (let y = 0; y < this.size; y++) {
            const row = [];
            for (let x = 0; x < this.size; x++) {
                row.push({
                    x,
                    y,
                    mine: false,
                    number: 0,
                    revealed: false,
                    flagged: false
                });
            }
            grid.push(row);
        }
        return grid;
    }
}