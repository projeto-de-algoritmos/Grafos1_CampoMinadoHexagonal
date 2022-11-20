import * as timer from './modules/timer.js';

const difficulties = [
    { id: 'facil', boardWidth: 6, boardHeight: 5, bombs: 8 },
    { id: 'media', boardWidth: 10, boardHeight: 9, bombs: 17 },
    { id: 'dificil', boardWidth: 15, boardHeight: 13, bombs: 40 },
];

let board = [];

let bombsArray = [];
let bombsLeft;

let isGameOver = false;

window.onload = () => {
    window.addEventListener("contextmenu", e => e.preventDefault());
    startGame();
    listenToClickEvents();
}

function listenToClickEvents() {
    listenToDifficulty();
    listenToRestart();
}

function listenToDifficulty() {
    difficulties.forEach(difficulty => {
        const element$ = $(`#${difficulty.id}`)
        element$.click(() => {
            if (element$.hasClass("option-active")) return;
            const response = window.confirm("Alterar a dificuldade reinicia o jogo. Deseja prosseguir?")
            if (response) {
                window.localStorage.setItem("difficulty", difficulty.id);
                startGame();
            }
        });
    });
}

function listenToRestart() {
    const element$ = $("#restart");
    element$.click(() => {
        const response = window.confirm("Todo seu progresso será perdido. Deseja reiniciar?")
        if (response) startGame()
    });
}

function startGame() {
    $(".title").text("Campo Minado");
    isGameRunning = false;
    isGameOver = false;
    timer.clear();
    const difficulty = loadDifficulty();
    generateBoard(difficulty);
    drawBoard(difficulty);
}

function loadDifficulty() {
    const targetDifficulty = window.localStorage.getItem("difficulty");
    let difficulty = difficulties[0];

    difficulties.forEach(item => {
        const element$ = $(`#${item.id}`);

        if (item.id === targetDifficulty) {
            difficulty = item;
            element$.addClass("option-active");
        } else {
            element$.removeClass("option-active");
        }
    });
    setBombsLeft(difficulty.bombs);

    return difficulty;
}

function generateBoard({ boardWidth, boardHeight, bombs }) {
    board = [];

    for(let x = 0; x < boardHeight; x++) {
        if (!board[x]) board[x] = []

        for (let y = 0; y < boardWidth; y++) {
            if (x % 2 == 0 && y == boardWidth - 1) {
                board[x][y] = null;
            } else {
                board[x][y] = {
                    value: 0,
                    isSelected: false,
                };
            }
        }
    }

    insertBombs(boardWidth, boardHeight, bombs);
    updateNumbers(boardWidth, boardHeight);
}

function insertBombs(boardWidth, boardHeight, bombs) {
    bombsArray = [];
    for (let i = 0; i < bombs; i++) {
        const x = Math.floor(Math.random() * boardHeight);
        const y = Math.floor(Math.random() * boardWidth);

        if (board[x][y] == null || board[x][y].value == "💣")  i--;
        else {
            bombsArray.push({ x, y });
            board[x][y].value = "💣";
        }
    }
}

function updateNumbers(boardWidth, boardHeight) {
    for (let x = 0; x < boardHeight; x++) {
        for (let y = 0; y < boardWidth; y++) {
            if (board[x][y]?.value == "💣") {
                const modifier = x % 2 != 0 ? -1 : 0
                setNumber(x, y - 1);
                setNumber(x, y + 1);
                setNumber(x - 1, y + modifier);
                setNumber(x - 1, y + 1 + modifier);
                setNumber(x + 1, y + modifier);
                setNumber(x + 1, y + 1 + modifier);
            }
        }
    }
}

function setNumber(x, y) {
    if (
        x >= board.length || y >= board[0].length ||
        x < 0 || y < 0 ||
        board[x][y] == null || board[x][y].value == "💣"
    ) return;
    board[x][y].value += 1;
}

function drawBoard({ boardWidth, boardHeight }) {
    const container = document.getElementById("board");
    container.replaceChildren();

    for(let x = 0; x < boardHeight; x++) {
        const $hexRow = $("<div></div>").addClass("hex-row")
        if(x % 2 == 0) $hexRow.addClass("even");

        for(let y = 0; y < boardWidth; y++) {
            if (board[x][y] == null) continue;
            const $hex = $("<div></div>").attr("id", `${x}-${y}`);
            $hex.addClass("hex");
            $hex.mousedown((event) => { mouseClickEvent(event) });

            const $hexTop = $("<div></div>").addClass("top");
            const $hexMiddle = $("<div></div>").addClass("middle");
            const $hexBottom = $("<div></div>").addClass("bottom");

            $hex.append($hexTop, $hexMiddle, $hexBottom);
            $hexRow.append($hex);
            $("#board").append($hexRow);
        }
    }
}

function mouseClickEvent(event) {
    if (isGameOver) return;
    if (timer.isRunning === false) timer.start();

    const $hexTile = $(event.currentTarget);
    switch (event.which) {
        case 1:
            handleSelection($hexTile);
            break;
        case 3:
            toggleFlag($hexTile);
            break;
    }
}

function toggleFlag($hexTile) {
    const isSelected = $hexTile.children().hasClass("selected");
    if (isSelected) return;

    const hasFlag = $hexTile.find(".middle").text() == "🚩";
    const { x, y } = getTileCoord($hexTile.attr("id"));

    if (hasFlag) {
        $hexTile.find(".middle").text("");
        $hexTile.children().removeClass("flagged");
        setBombsLeft(++bombsLeft);
    } else {
        $hexTile.find(".middle").text("🚩");
        $hexTile.children().addClass("flagged");
        setBombsLeft(--bombsLeft);
    }
}

function handleSelection($hexTile) {
    const hasFlag = $hexTile.find(".middle").text() == "🚩";
    if (hasFlag) return;

    const { x, y } = getTileCoord($hexTile.attr("id"));
    board[x][y].isSelected = true;
    const isBomb = board[x][y].value == '💣';

    $hexTile.find(".middle").text(board[x][y].value);

    if (isBomb) {
        $hexTile.children().addClass("bomb");
        revealBombs();
        endGame("Voce perdeu!");
    } else {
        openNeighbors();
        $hexTile.children().addClass("selected");
        checkWin();
    }
}

function openNeighbors() {
    // TODO funcao para abrir vizinhos
}

function endGame(message) {
    isGameOver = true;
    timer.clear();
    $(".title").text(message);
}

function checkWin() {
    let allSelected = true;
    board.forEach(row => {
        row.forEach(item => {
            if (!item || item.value == "💣") return;
            if (!item.isSelected) allSelected = false;
        })
    });

    if (allSelected) endGame("Voce ganhou!")
}

function revealBombs() {
    bombsArray.forEach(({ x, y }) => {
        const $hexTile = $(`#${x}-${y}`);
        $hexTile.find(".middle").text(board[x][y]?.value);
        $hexTile.children().addClass("bomb");
    })
}

function getTileCoord(id) {
    const coordArray = id.split("-");
    const x = coordArray[0];
    const y = coordArray[1];
    return { x, y }
}

function setBombsLeft(value) {
    bombsLeft = value;
    $("#bombs-left").text(bombsLeft);
}