import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";
import Life from "./Life.js";
import Timer from "./Timer.js";

let recordsTable = []
var myGame = []


window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

// -------------------Setting-----------------

let selectedPhotoSrc = ''; // Variable to store the selected photo source
selectedPhotoSrc = document.querySelector('input[name="photo"]:checked').nextElementSibling.querySelector('img').getAttribute('src');
const radioButtons = document.getElementsByName('photo');
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', (event) => {
        selectedPhotoSrc = event.target.nextElementSibling.querySelector('img').getAttribute('src');
        console.log('Selected photo src:', selectedPhotoSrc);
        player.setImage(selectedPhotoSrc);
    });
});


let countdown = document.getElementById("totalTime").value;
const totalTimeInput = document.getElementById('totalTime');
var value = 120
totalTimeInput.addEventListener('input', (event) => {
    value = event.target.value;
});


const speedOfMonsters = document.getElementById('speedOfMonsters');
var speedMonsters = 1
// Add an event listener to the totalTime input element
speedOfMonsters.addEventListener('input', (speedEnemy) => {
    // Get the current value of the totalTime input element
    speedMonsters = speedEnemy.target.value;

    // Do something with the value (e.g. update a timer display)
    console.log(`speedMonsters: ${speedMonsters} `);
});

//------------------------------------------


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d")

canvas.width = "1366"
canvas.height = "768"

const background = new Image()

background.src = "./resources/images/back.jpg"
let playerBulletController = new BulletController(canvas, 10, "red", true)
let enemyBulletController = new BulletController(canvas, 4, 'blue', false)
let enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController)
let player = new Player(canvas, 3, playerBulletController)
player.setImage(selectedPhotoSrc)
let GameLife1 = new Life(canvas, 0, 10)
let GameLife2 = new Life(canvas, 50, 10)
let GameLife3 = new Life(canvas, 100, 10)
let isGameOver = false;
let didWin = false;
const numberOfHearts = 2
let numberOfFails = 0
var playMusic = true

//-------------------Sounds-----------------
const hitSound = new Audio('resources/sounds/hitFromEnemy.mp3')
const winSound = new Audio('resources/sounds/win.mp3')
const backgroundSong = new Audio('resources/sounds/backgroundSong.mp4')

function stopAllSounds() {
    if (playMusic === false) {
        hitSound.volume = 0
        winSound.volume = 0
        backgroundSong.volume = 0
    }
    if (playMusic === true) {
        hitSound.volume = 0.6
        winSound.volume = 0.6
        backgroundSong.volume = 0.6
    }
}

const muteSounds = document.getElementById('mainNavbar');
let clickCount = 0;

muteSounds.addEventListener('click', (event) => {
    if (event.target.id === 'myButton') {
        console.log('New game button clicked!');
        playMusic = true;
    } else {
        playMusic = false
    }
});

//------------------------------------------


const game = () => {
    checkGameOver()
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    displayGameOver()
    if (!isGameOver) {
        enemyController.draw(ctx);
        player.draw(ctx)
        player.setImage(selectedPhotoSrc)
        playerBulletController.draw(ctx)
        enemyBulletController.draw(ctx)
        lifeCount()
        showScore()
        canvas.focus()
        playSoundsWinOrLose()
    }
    stopAllSounds()

}

const showScore = () => {
    let stext = enemyController.score;

    ctx.fillStyle = "white";
    ctx.font = "70px Arial";
    ctx.fillText(stext, 1200, 100);

}
const lifeCount = () => {
    if (numberOfFails === 0) {
        GameLife1.draw(ctx)
        GameLife2.draw(ctx)
        GameLife3.draw(ctx)
    }
    if (numberOfFails === 1) {
        GameLife1.draw(ctx)
        GameLife2.draw(ctx)
    }
    if (numberOfFails === 2) {
        GameLife1.draw(ctx)
    }
}

const checkGameOver = () => {
    if (isGameOver) {
        // displayGameOver();
        playSoundsWinOrLose()
        return;

    }

    if (enemyBulletController.collideWith(player)) {
        numberOfFails += 1
        hitSound.play()
        player = new Player(canvas, 3, playerBulletController)
        if (numberOfFails > numberOfHearts) {
            isGameOver = true
            player.setImage(selectedPhotoSrc)
            timer.stopCounter()
            recordsTable.push([enemyController.score.toString(), timer.getCountDown(), new Date().toLocaleString()])
            console.log(recordsTable)
            showRecords()


        }
    }

    if (enemyController.collideWith(player)) {
        numberOfFails += 1
        hitSound.play()
        player = new Player(canvas, 3, playerBulletController)
        if (numberOfFails > numberOfHearts) {
            isGameOver = true
            player.setImage(selectedPhotoSrc)
            timer.stopCounter()
            recordsTable.push([enemyController.score.toString(), timer.getCountDown(), new Date().toLocaleString()])
            console.log(recordsTable)
            showRecords()


        }
    }
    if (enemyController.enemyRows.length === 0) {
        didWin = true;
        isGameOver = true;
        player.setImage(selectedPhotoSrc)
        timer.stopCounter()
        recordsTable.push([enemyController.score.toString(), timer.getCountDown(), new Date().toLocaleString()])
        console.log(recordsTable)
        showRecords()


    }
    if (timer.getCountDown() <= 0 && enemyController.enemyRows.length > 0) {
        didWin = false;
        isGameOver = true;
        player.setImage(selectedPhotoSrc)
        timer.stopCounter()
        recordsTable.push([enemyController.score.toString(), timer.getCountDown(), new Date().toLocaleString()])
        console.log(recordsTable)
        showRecords()

    }
}

function displayGameOver() {
    let text1 = "";
    let text = "";
    let textOffset = 4;
    let hightOffset = 150;
    if (isGameOver) {
        if (enemyController.score < 100 && didWin === false && timer.getCountDown() <= 0) {
            text = "You can do better !";
            text1 = "Your Score: " + enemyController.score.toString() + " Points"
            textOffset = 2
        } else if (enemyController.enemyRows.length === 0 && didWin === true) {
            text1 = "Champion!"
            // winSound.play()
            textOffset = 3
            hightOffset = 0;
        } else if (numberOfFails === 3 && didWin === false) {
            text1 = "You lose!"
            textOffset = 2.2
            hightOffset = 0;
        } else {
            text1 = "Winner!"
            // winSound.play()
            textOffset = 3
            hightOffset = 0;
        }
        ctx.fillStyle = "green";
        ctx.font = "bold 60pt Ink Free"; // Note the use of single quotes around the font name


        ctx.fillText(text, (canvas.width / textOffset), canvas.height / 2);
        ctx.fillText(text1, (canvas.width / textOffset), (canvas.height - hightOffset) / 2);

// Set cell dimensions and offsets
        const cellWidth = 100;
        const cellHeight = 40;
        const textOffsetY = 200;
        const tableOffsetY = (canvas.height - textOffsetY) / 2;


    }

}

function playSoundsWinOrLose() {

    let text1 = "";
    let text = "";
    let textOffset = 4;
    let hightOffset = 150;
    if (isGameOver) {
        console.log("dS")
        if (enemyController.score < 100 && didWin === false && timer.getCountDown() <= 0) {
            text = "You can do better !";
            text1 = "Your Score: " + enemyController.score.toString() + " Points"
        } else if (enemyController.enemyRows.length === 0 && didWin === true) {
            text1 = "Champion!"
            backgroundSong.pause()
            winSound.play()


        } else if (numberOfFails === 3 && didWin === false) {
            text1 = "You lose!"
        } else {
            text1 = "Winner!"
            winSound.play()
            backgroundSong.pause()
            winSound.play()
        }
    }

}


// ---------------------- Timer ----------------------
var timer = new Timer(canvas, countdown)
// ---------------------------------------------------
var button = document.getElementById("myButton");
button.addEventListener("click", reload);
var buttonFromsetting = document.getElementById("startFromSetting");
buttonFromsetting.addEventListener("click", reload);

function reload() {
    playerBulletController = new BulletController(canvas, 10, "red", true)
    enemyBulletController = new BulletController(canvas, 4, 'blue', false)
    enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController)

    enemyController.setDefaultXVelocity(Number(speedMonsters))
    player = new Player(canvas, 3, playerBulletController)
    player.setImage(selectedPhotoSrc);
    GameLife1 = new Life(canvas, 0, 10)
    GameLife2 = new Life(canvas, 50, 10)
    GameLife3 = new Life(canvas, 100, 10)
    isGameOver = false;
    didWin = false;
    numberOfFails = 0
    timer.setCountDown(value)
    winSound.pause()
    timer.resetTimer()
    timer.startTimer()
    backgroundSong.play()
    playMusic = true

}

//----------------------------------------------------


const table = document.createElement('table');
const header = table.createTHead();
const row = header.insertRow();
const valueHeader = row.insertCell();
const timeHeader = row.insertCell();
const timestampHeader = row.insertCell();
valueHeader.innerText = 'Score';
timeHeader.innerText = 'Time';
timestampHeader.innerText = 'Timestamp';

function showRecords() {


    // add rows for the array data
    const tbody = table.createTBody();

    for (let i = 0; i < recordsTable.length; i++) {
        if (recordsTable[i][1] != null) {
            const record = recordsTable[i];
            const row = tbody.insertRow();
            const valueCell = row.insertCell();
            const timeCell = row.insertCell();
            const timestampCell = row.insertCell();
            valueCell.style.width = "33.33%";
            timeCell.style.width = "33.33%";
            timestampCell.style.width = "33.33%";
            valueCell.innerText = record[0];
            timeCell.innerText = record[1];
            timestampCell.innerText = record[2];
            row.classList.add("high");
            if (i === recordsTable.length - 1) {
                row.classList.add("highlight");
            }
        }
    }
    recordsTable = []

    // add the table to a container element in the HTML
    const container = document.getElementById('table-container');
    container.appendChild(table);
}

//-----------------------------------------------------------------------------------------------
setInterval(game, 1000 / 60)

