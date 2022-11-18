const difficulties = [
    { id: 'facil', boardWidth: 6, boardHeight: 5 },
    { id: 'media', boardWidth: 10, boardHeight: 9 },
    { id: 'dificil', boardWidth: 15, boardHeight: 13 },
];

window.onload = () => {
    window.addEventListener("contextmenu", e => e.preventDefault());
    startGame();
}

function startGame() {
    listenToDifficulty();
    checkDifficulty();
}

function checkDifficulty() {
    const savedDifficulty = window.localStorage.getItem("difficulty");
    const selectedDifficulty = savedDifficulty ?? 'facil';
    difficulties.forEach(difficulty => {
        const element = document.getElementById(difficulty.id);
        if (difficulty.id === selectedDifficulty) {
            element.classList.add('option-active');
            drawBoard(difficulty);
        }
        else element.classList.remove('option-active');
    })
}

function listenToDifficulty() {
    difficulties.forEach(difficulty => {
        const element = document.getElementById(difficulty.id)
        element.addEventListener("click", () => {
            const response = window.confirm("Alterar a dificuldade reinicia o jogo. Deseja prosseguir?")
            if (response) {
                window.localStorage.setItem("difficulty", difficulty.id);
                checkDifficulty();
            }
        });
    });
}

function drawBoard(difficulty) {
    const container = document.getElementById("board");
    container.replaceChildren();

    for(let i = 0; i < difficulty.boardHeight; i++){
        const $hexRow = $("<div></div>").addClass("hex-row")
        let cont = difficulty.boardWidth;
        if(i%2 == 0) {
            $hexRow.addClass("even");
            cont--;
        }

        for(let j = 0; j < cont; j++) {
            _drawHexBoard($hexRow, j, i);
        }
    }
}

function _drawHexBoard($hexRow, col, row) {
    const $hex = $("<div></div>").attr("id", `${row}-${col}`);
    $hex.addClass("hex");
    $hex.mousedown((event) => { mouseClickEvent(event) });

    const $hexTop = $("<div></div>").addClass("top");
    const $hexMiddle = $("<div></div>").addClass("middle");
    const $hexBottom = $("<div></div>").addClass("bottom");

    $hexRow.append($hex);
    $hex.append($hexTop, $hexMiddle, $hexBottom);
    $("#board").append($hexRow);
}

function mouseClickEvent(event) {
    const $hexTile = $(event.currentTarget);
    const hexTileId = $hexTile[0].id;

    switch (event.which) {
        case 1:
            alert(`Clicou em ${hexTileId}`);
            break;
        case 3:
            toogleFlag($hexTile);
            break;
    }
}

function toogleFlag($hexTile) {
    const hasFlag = !!($hexTile.find(".middle").text() == "🚩");
    if(hasFlag){
        $hexTile.find(".middle").text("");
    }else{
        $hexTile.find(".middle").text("🚩");
    }
}
