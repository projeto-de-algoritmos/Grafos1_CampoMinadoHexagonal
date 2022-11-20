export let isRunning = false;
let timer;

export function start() {
    isRunning = true;
    let secs = 0;
    timer = setInterval(() => {
        secs += 1;
        $("#timer").text(`${secs} (s)`);
    }, 1000)

}

export function stop() {
    isRunning = false;
    clearInterval(timer);
}

export function clear() {
    $("#timer").text("0 (s)");
}
