import * as game from './modules/game.js';

window.onload = () => {
    window.addEventListener("contextmenu", e => e.preventDefault());
    game.start();
    listenClickEvents();
}

function listenClickEvents() {
    listenDifficulty();
    listenRestart();
}

function listenDifficulty() {
    $(".difficulty .options").children().each((_, difficulty) => {
        $(`#${difficulty.id}`).click(() => {
            if ($(this).hasClass("option-active")) return;
            const response = window.confirm("Alterar a dificuldade reinicia o jogo. Deseja prosseguir?");
            if (response) {
                window.localStorage.setItem("difficulty", difficulty.id);
                game.start();
            }
        });
    });
}

function listenRestart() {
    $("#restart").click(() => {
        const response = window.confirm("Todo seu progresso será perdido. Deseja reiniciar?");
        if (response) game.start();
    });
}
