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

export function clear() {
    isRunning = false;
    clearInterval(timer);
    $("#timer").text("0 (s)");
}
