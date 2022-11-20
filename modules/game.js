import * as board from './board.js';
import * as timer from './timer.js';

export let isGameOver = false;
export let bombsLeft;

const difficulties = [
    { id: 'easy', boardWidth: 6, boardHeight: 5, bombs: 6 },
    { id: 'normal', boardWidth: 10, boardHeight: 9, bombs: 14 },
    { id: 'hard', boardWidth: 15, boardHeight: 13, bombs: 40 },
];

export function start() {
    $(".title").text("Campo Minado");
    isGameOver = false;
    timer.clear();

    const difficulty = _loadDifficulty();
    setBombsLeft(difficulty.bombs);
    board.generate(difficulty);
    board.draw(difficulty);
}

export function setBombsLeft(bombs) {
    bombsLeft = bombs;
    $("#bombs-left").text(bombsLeft);
}

export function checkWin() {
    let allSelected = true;
    board.boardMatrix.forEach(row => {
        row.forEach(item => {
            if (!item || item.value == "💣") return;
            if (!item.isSelected) allSelected = false;
        })
    });

    if (allSelected) end("Voce ganhou!")
}

export function end(message) {
    isGameOver = true;
    timer.stop();
    $(".title").text(message);
}

function _loadDifficulty() {
    const targetDifficulty = window.localStorage.getItem("difficulty") || difficulties[0].id;
    let difficulty;

    difficulties.forEach(item => {
        const $option = $(`#${item.id}`);

        if (item.id === targetDifficulty) {
            difficulty = item;
            $option.addClass("option-active");
        } else {
            $option.removeClass("option-active");
        }
    });
    return difficulty;
}
