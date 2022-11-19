const difficulties = [
    { id: 'facil', boardWidth: 6, boardHeight: 5, bombs: 8 },
    { id: 'media', boardWidth: 10, boardHeight: 9, bombs: 17 },
    { id: 'dificil', boardWidth: 15, boardHeight: 13, bombs: 40 },
];

let board = [];

let isGameRunning = false;

let timer;

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
    clearTimer();
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

            const bombsLeft$ = $("#bombs-left");
            bombsLeft$.text(difficulty.bombs);
        } else {
            element$.removeClass("option-active");
        }
    });

    return difficulty;
}

function generateBoard({ boardWidth, boardHeight, bombs }) {
    board = [];

    for (x = 0; x < boardHeight; x++) {
        if (!board[x]) board[x] = []

        for (y = 0; y < boardWidth; y++) {
            if (x % 2 == 0 && y == boardWidth - 1) {
                board[x][y] = null;
            } else {
                board[x][y] = {
                    value: 0,
                    isFlagged: false,
                    isSelected: false,
                };
            }
        }
    }

    insertBombs(boardWidth, boardHeight, bombs);
    updateNumbers(boardWidth, boardHeight);
}

function insertBombs(boardWidth, boardHeight, bombs) {
    for (let i = 0; i < bombs; i++) {
        const x = Math.floor(Math.random() * boardHeight);
        const y = Math.floor(Math.random() * boardWidth);

        if (board[x][y] == null || board[x][y].value == "💣")  i--;
        else board[x][y].value = "💣";
    }
}

function updateNumbers(boardWidth, boardHeight) {
    for (x = 0; x < boardHeight; x++) {
        for (y = 0; y < boardWidth; y++) {
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

    for (x = 0; x < boardHeight; x++) {
        const $hexRow = $("<div></div>").addClass("hex-row")
        if(x % 2 == 0) $hexRow.addClass("even");

        for (y = 0; y < boardWidth; y++) {
            if (board[x][y] == null) continue;
            const $hex = $("<div></div>").attr("id", `${x}-${y}`);
            $hex.addClass("hex");
            $hex.mousedown((event) => { mouseClickEvent(event) });

            const $hexTop = $("<div></div>").addClass("top");
            const $hexMiddle = $("<div></div>").addClass("middle");
            // TODO remover
            $hexMiddle.text(board[x][y].value)
            const $hexBottom = $("<div></div>").addClass("bottom");

            $hex.append($hexTop, $hexMiddle, $hexBottom);
            $hexRow.append($hex);
            $("#board").append($hexRow);
        }
    }
}

function mouseClickEvent(event) {
    if (isGameRunning === false) startTimer();

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
    board[x][y].isFlagged = !hasFlag;

    if (hasFlag) {
        $hexTile.find(".middle").text("");
        $hexTile.children().removeClass("flagged");
    } else {
        $hexTile.find(".middle").text("🚩");
        $hexTile.children().addClass("flagged");
    }
}

function handleSelection($hexTile) {
    const hasFlag = $hexTile.find(".middle").text() == "🚩";
    if (hasFlag) return;

    const { x, y } = getTileCoord($hexTile.attr("id"));
    board[x][y].isSelected = true;

    $hexTile.children().addClass("selected");
    $hexTile.find(".middle").text(board[x][y].value);

    if (board[x][y].value == '💣') gameOver();
}

function gameOver() {
}

function getTileCoord(id) {
    const coordArray = id.split("-");
    const x = coordArray[0];
    const y = coordArray[1];
    return { x, y }
}

function startTimer() {
    isGameRunning = true;
    const element = document.getElementById("timer");
    let secs = 0;
    timer = setInterval(() => {
        secs += 1;
        element.innerText = `${secs} (s)`
    }, 1000)

}

function clearTimer() {
    isGameRunning = false;
    clearInterval(timer);
    document.getElementById("timer").innerText = "0 (s)";
}