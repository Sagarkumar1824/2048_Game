let board;
let score = 0;
const rows = 4;
const columns = 4;

window.onload = () => {
    initGame();
};

function initGame() {
    board = Array.from({ length: rows }, () => Array(columns).fill(0));
    const boardContainer = document.getElementById("board");

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            boardContainer.appendChild(tile);
        }
    }

    document.getElementById("h3").innerText = "Game Started";
    spawnTile();
    spawnTile();
    renderBoard();
}

function spawnTile() {
    if (!hasEmptyTile()) return;

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] === 0) {
            board[r][c] = 2;
            found = true;
        }
    }
}

function hasEmptyTile() {
    return board.some(row => row.includes(0));
}

function renderBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const tile = document.getElementById(`${r}-${c}`);
            updateTile(tile, board[r][c]);
        }
    }
    document.getElementById("score").innerText = score;
}

function updateTile(tile, num) {
    tile.innerText = num > 0 ? num : "";
    tile.className = "tile";
    if (num > 0) {
        tile.classList.add(num <= 4096 ? `x${num}` : "x8192");
    }
}

document.addEventListener("keyup", e => {
    switch (e.code) {
        case "ArrowLeft":
            slideAll("left");
            break;
        case "ArrowRight":
            slideAll("right");
            break;
        case "ArrowUp":
            slideAll("up");
            break;
        case "ArrowDown":
            slideAll("down");
            break;
    }
});

function slideAll(direction) {
    let moved = false;

    if (direction === "left" || direction === "right") {
        for (let r = 0; r < rows; r++) {
            let row = [...board[r]];
            if (direction === "right") row.reverse();

            const newRow = slide(row);
            if (direction === "right") newRow.reverse();

            board[r] = newRow;
            moved ||= JSON.stringify(board[r]) !== JSON.stringify(row);
        }
    } else {
        for (let c = 0; c < columns; c++) {
            let col = board.map(row => row[c]);
            if (direction === "down") col.reverse();

            const newCol = slide(col);
            if (direction === "down") newCol.reverse();

            for (let r = 0; r < rows; r++) {
                if (board[r][c] !== newCol[r]) moved = true;
                board[r][c] = newCol[r];
            }
        }
    }

    if (moved) {
        spawnTile();
        renderBoard();
    }
}

function slide(row) {
    row = row.filter(num => num !== 0);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    row = row.filter(num => num !== 0);
    while (row.length < columns) row.push(0);
    return row;
}
