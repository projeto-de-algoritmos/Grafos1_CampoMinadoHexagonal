const difficulties = [
    { id: 'facil', boardWidth: 6, boardHeight: 5, bombs: 10 },
    { id: 'media', boardWidth: 10, boardHeight: 9, bombs: 20 },
    { id: 'dificil', boardWidth: 15, boardHeight: 13, bombs: 40 },
];

let bombs = [];

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

    bombs = [];
    generateBombs(difficulty);
}

function generateBombs(difficulty) {
    for(let i = 0; i < difficulty.bombs; i++) {
        const y = Math.floor(Math.random() * difficulty.boardHeight);
        const x = Math.floor(Math.random() * (difficulty.boardWidth + (y % 2 == 0 ? -1 : 0)));
    
        const $idTile = $(`div.hex#${y}-${x} .middle`);
    
        if($idTile.text() == "") $idTile.text("💣");
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
    switch (event.which) {
        case 1:
            selectHexTile($hexTile);
            break;
        case 3:
            toogleFlaggedHexTile($hexTile);
            break;
    }
}

function selectHexTile($hexTile) {
    const hasNoFlag = !($hexTile.find(".middle").text() == "🚩");
    if(hasNoFlag){
        $hexTile.children().addClass("selected");

        const hasNoBomb = !($hexTile.find(".middle").text() == "💣");
        if(hasNoBomb) {
            $hexTile.find(".middle").text(getBombsNumber($hexTile));
        }
    }
}

function getBombsNumber($hexTile) {
    let cont = 0;
    getNeighborsHexTile($hexTile).forEach((tile) => {
        tile[0].innerText == "💣" && cont++;
    });
    return cont;
}

function getNeighborsHexTile($hexTile) {
    const y = parseInt($hexTile[0].id.split("-")[0]);
    const x = parseInt($hexTile[0].id.split("-")[1]);

    let neighbors = [];
    neighbors.push($(`#${y}-${x-1}`));
    neighbors.push($(`#${y}-${x+1}`));
    neighbors.push($(`#${y-1}-${x}`));
    neighbors.push($(`#${y+1}-${x}`));
    const diagonal = y % 2 === 0 ? 1 : -1;
    neighbors.push($(`#${y-1}-${x+diagonal}`));
    neighbors.push($(`#${y+1}-${x+diagonal}`));

    let result = neighbors.filter(function (element) {
        return element[0] != undefined;
    });

    return result;
}

function toogleFlaggedHexTile($hexTile) {
    const hasFlag = !!($hexTile.find(".middle").text() == "🚩");
    const isNotSelected = !($hexTile.children().hasClass("selected"));
    if(hasFlag){
        $hexTile.find(".middle").text("");
        $hexTile.children().removeClass("flagged");
    }else if(isNotSelected){
        $hexTile.find(".middle").text("🚩");
        $hexTile.children().addClass("flagged");
    }
}
