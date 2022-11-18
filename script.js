const boardWidth = 10;
const boardHeight = 9;

window.onload = () => {
    window.addEventListener("contextmenu", e => e.preventDefault());
    startGame();
}

function startGame() {
    drawBoard();
}

function drawBoard() {
    for(let i = 0; i < boardHeight; i++){
        const $hexRow = $("<div></div>").addClass("hex-row")
        let cont = boardWidth;
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
