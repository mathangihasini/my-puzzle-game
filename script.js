let level = 1;
let time = 0;
let moves = 0;
let score = 0;
let totalScore = 0;
let bestScore = Number(localStorage.getItem("bestScore")) || 0;

let timerInterval;

let tiles = [1, 2, 3, 4, 5, 6, 7, 8, ""];

// ===============================
// 🔊 AUDIO SYSTEM
// ===============================

let audioContext = null;

function initAudio() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
    } catch (error) {
        console.log("Audio not supported");
    }
}

function playTone(frequency, duration, type = "sine", volume = 0.05) {
    if (!audioContext) {
        initAudio();
    }

    if (!audioContext) return;

    try {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(volume, audioContext.currentTime);

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + duration
        );
    } catch (error) {
        console.log("Sound error");
    }
}

// 🧩 Tile move sound
function moveSound() {
    playTone(500, 0.06, "square", 0.035);
}

// 🎉 Level complete sound
function winSound() {
    initAudio();

    playTone(523.25, 0.12, "sine", 0.06);

    setTimeout(function () {
        playTone(659.25, 0.12, "sine", 0.06);
    }, 120);

    setTimeout(function () {
        playTone(783.99, 0.18, "sine", 0.07);
    }, 240);
}

// 🏆 Best score sound
function bestScoreSound() {
    initAudio();

    playTone(659.25, 0.12, "triangle", 0.06);

    setTimeout(function () {
        playTone(783.99, 0.12, "triangle", 0.06);
    }, 120);

    setTimeout(function () {
        playTone(1046.50, 0.22, "triangle", 0.08);
    }, 240);
}


// ===============================
// 🎮 START GAME
// ===============================

function startGame() {

    initAudio();

    clearInterval(timerInterval);

    level = 1;
    totalScore = 0;
    score = 0;

    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    document.getElementById("winScreen").style.display = "none";

    document.getElementById("level").textContent = level;
    document.getElementById("score").textContent = "0";
    document.getElementById("moves").textContent = "0";
    document.getElementById("timer").textContent = "0";

    shufflePuzzle();
}


// ===============================
// ⏱️ TIMER
// ===============================

function startTimer() {

    clearInterval(timerInterval);

    time = 0;

    document.getElementById("timer").textContent = "0";

    timerInterval = setInterval(function () {

        time++;

        document.getElementById("timer").textContent = time;

    }, 1000);
}


// ===============================
// 🧩 DRAW PUZZLE
// ===============================

function drawPuzzle() {

    const puzzle = document.getElementById("puzzle");

    puzzle.innerHTML = "";

    tiles.forEach(function (tile, index) {

        const box = document.createElement("div");

        box.className = "tile";

        box.textContent = tile;

        if (tile !== "") {

            box.onclick = function () {

                moveTile(index);

            };

        }

        puzzle.appendChild(box);

    });
}


// ===============================
// 👉 MOVE TILE
// ===============================

function moveTile(index) {

    const emptyIndex = tiles.indexOf("");

    const row = Math.floor(index / 3);
    const col = index % 3;

    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    const canMove =
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1);

    if (canMove) {

        // Swap tiles
        [tiles[index], tiles[emptyIndex]] =
        [tiles[emptyIndex], tiles[index]];

        moves++;

        document.getElementById("moves").textContent = moves;

        // 🔊 Move sound
        moveSound();

        drawPuzzle();

        checkWin();
    }
}


// ===============================
// 🔀 SHUFFLE PUZZLE
// ===============================

function shufflePuzzle() {

    tiles = [1, 2, 3, 4, 5, 6, 7, 8, ""];

    moves = 0;

    document.getElementById("moves").textContent = "0";

    // Difficulty increases with level
    let shuffleCount = 100 + (level - 1) * 10;

    // Maximum shuffle
    if (shuffleCount > 1200) {
        shuffleCount = 1200;
    }

    for (let i = 0; i < shuffleCount; i++) {

        const possible = [];

        const emptyIndex = tiles.indexOf("");

        const row = Math.floor(emptyIndex / 3);
        const col = emptyIndex % 3;

        // Up
        if (row > 0) {
            possible.push(emptyIndex - 3);
        }

        // Down
        if (row < 2) {
            possible.push(emptyIndex + 3);
        }

        // Left
        if (col > 0) {
            possible.push(emptyIndex - 1);
        }

        // Right
        if (col < 2) {
            possible.push(emptyIndex + 1);
        }

        const randomIndex =
            possible[Math.floor(Math.random() * possible.length)];

        [tiles[emptyIndex], tiles[randomIndex]] =
        [tiles[randomIndex], tiles[emptyIndex]];
    }

    startTimer();

    drawPuzzle();
}


// ===============================
// 🏆 CHECK WIN
// ===============================

function checkWin() {

    const win =
        tiles.slice(0, 8).every(function (tile, index) {

            return tile === index + 1;

        }) &&
        tiles[8] === "";

    if (win) {

        clearInterval(timerInterval);

        // Calculate score
        score = Math.max(
            100,
            1000 +
            (level * 500) -
            (time * 2) -
            moves
        );

        totalScore += score;

        // Check best score
        const isNewBest = score > bestScore;

        if (isNewBest) {

            bestScore = score;

            localStorage.setItem(
                "bestScore",
                bestScore
            );
        }

        // Update score
        document.getElementById("score").textContent = score;

        document.getElementById("finalLevel").textContent = level;

        document.getElementById("finalTime").textContent = time;

        document.getElementById("finalMoves").textContent = moves;

        document.getElementById("finalScore").textContent = score;

        // 🔊 Winning sound
        winSound();

        // 🏆 Best score sound
        if (isNewBest) {

            setTimeout(function () {
                bestScoreSound();
            }, 450);

        }

        // 🎉 Celebration
        createCelebration();

        // Show win screen
        document.getElementById("gameScreen").style.display = "none";

        document.getElementById("winScreen").style.display = "block";
    }
}


// ===============================
// ➡️ NEXT LEVEL
// ===============================

function nextLevel() {

    level++;

    document.getElementById("level").textContent = level;

    document.getElementById("winScreen").style.display = "none";

    document.getElementById("gameScreen").style.display = "block";

    shufflePuzzle();
}


// ===============================
// 🎉 CELEBRATION
// ===============================

function createCelebration() {

    const celebration = document.createElement("div");

    celebration.id = "celebration";

    celebration.innerHTML =
        "🎉 🎊 ⭐ 🏆 ⭐ 🎊 🎉";

    celebration.style.position = "fixed";

    celebration.style.top = "40%";

    celebration.style.left = "50%";

    celebration.style.transform =
        "translate(-50%, -50%)";

    celebration.style.fontSize = "35px";

    celebration.style.zIndex = "9999";

    celebration.style.textAlign = "center";

    celebration.style.animation =
        "celebrate 1.5s ease";

    document.body.appendChild(celebration);

    setTimeout(function () {

        celebration.remove();

    }, 1600);
}


// ===============================
// 🔄 RESTART GAME
// ===============================

function restartGame() {

    initAudio();

    clearInterval(timerInterval);

    level = 1;

    totalScore = 0;

    score = 0;

    document.getElementById("winScreen").style.display = "none";

    document.getElementById("gameScreen").style.display = "block";

    document.getElementById("level").textContent = "1";

    document.getElementById("score").textContent = "0";

    document.getElementById("moves").textContent = "0";

    document.getElementById("timer").textContent = "0";

    shufflePuzzle();
}
