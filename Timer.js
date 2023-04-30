export default class Timer {
    constructor(canvas, countdown) {
        this.canvas = canvas;
        this.countdown = countdown;
        this.timerId = null;
        this.startTime = null;
        this.stopTime = null;
        this.remainTime = null
    }

    startTimer() {
        this.startTime = Date.now();
        this.updateTimer();
    }

    updateTimer() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.startTime;
        const remainingTime = Math.max(this.countdown - Math.floor(elapsedTime / 1000), 0);
        this.remainTime = remainingTime
        document.getElementById("timer").textContent = remainingTime;

        if (remainingTime === 0) {
            document.getElementById("timer").textContent = "Time's up!";
            return;
        }

        this.timerId = setTimeout(() => {
            this.updateTimer();
        }, 1000);
    }
    setCountDown(time){
        this.countdown= time
    }
    stopCounter() {
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.stopTime = Date.now();
            console.log("Stopped at " + (this.countdown - document.getElementById("timer").textContent) + " seconds.");
        }
    }

    resetTimer() {
        clearTimeout(this.timerId);
        // this.countdown = 30;
        this.startTime = null;
        this.stopTime = null;
        document.getElementById("timer").textContent = this.countdown;
    }

    getCountDown = () => {
        return this.remainTime;
    }
}

