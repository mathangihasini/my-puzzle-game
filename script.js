// ============================================
// 🧩 MY PUZZLE GAME - FINAL VERSION
// ============================================


// ============================================
// 🎮 GAME VARIABLES
// ============================================

let level = 1;

let time = 0;

let moves = 0;

let score = 0;

let totalScore = 0;

let bestScore =
    Number(localStorage.getItem("bestScore")) || 0;

let timerInterval = null;

let tiles =
    [1, 2, 3, 4, 5, 6, 7, 8, ""];


// ============================================
// 🔊 AUDIO VARIABLES
// ============================================

let soundOn =
    localStorage.getItem("soundOn") !== "false";

let audioContext = null;

let musicTimer = null;

let musicStep = 0;


// ============================================
// 🚀 INITIAL SETUP
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    updateSoundButton();

    updateBestScore();

});


// ============================================
// 🔊 INITIALIZE AUDIO
// ============================================

function initAudio() {

    try {

        if (!audioContext) {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioContext) {
                return;
            }

            audioContext =
                new AudioContext();
        }

        if (audioContext.state === "suspended") {

            audioContext.resume();

        }

    } catch (error) {

        console.log(
            "Audio initialization error"
        );

    }

}


// ============================================
// 🎵 PLAY TONE
// ============================================

function playTone(
    frequency,
    duration,
    type = "sine",
    volume = 0.04
) {

    if (!soundOn) {
        return;
    }

    initAudio();

    if (!audioContext) {
        return;
    }

    try {

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();


        oscillator.type = type;

        oscillator.frequency.setValueAtTime(
            frequency,
            audioContext.currentTime
        );


        gain.gain.setValueAtTime(
            volume,
            audioContext.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration
        );


        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );


        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + duration
        );

    } catch (error) {

        console.log(
            "Sound error"
        );

    }

}


// ============================================
// 🧩 TILE MOVE SOUND
// ============================================

function moveSound() {

    playTone(
        520,
        0.055,
        "square",
        0.025
    );

}


// ============================================
// ❌ INVALID MOVE SOUND
// ============================================

function invalidMoveSound() {

    playTone(
        180,
        0.08,
        "sawtooth",
        0.018
    );

}


// ============================================
// 🎉 WIN SOUND
// ============================================

function winSound() {

    if (!soundOn) {
        return;
    }

    initAudio();

    const notes =
        [
            523.25,
            659.25,
            783.99,
            1046.50
        ];

    notes.forEach(
        function (frequency, index) {

            setTimeout(
                function () {

                    playTone(
                        frequency,
                        0.16,
                        "sine",
                        0.055
                    );

                },
                index * 120
            );

        }
    );

}


// ============================================
// 🏆 BEST SCORE SOUND
// ============================================

function bestScoreSound() {

    if (!soundOn) {
        return;
    }

    initAudio();

    playTone(
        659.25,
        0.12,
        "triangle",
        0.05
    );

    setTimeout(
        function () {

            playTone(
                783.99,
                0.12,
                "triangle",
                0.05
            );

        },
        120
    );

    setTimeout(
        function () {

            playTone(
                1046.50,
                0.22,
                "triangle",
                0.07
            );

        },
        240
    );

}


// ============================================
// 🎵 SIMPLE BACKGROUND MUSIC
// ============================================

function startBackgroundMusic() {

    if (!soundOn) {
        return;
    }

    initAudio();

    if (!audioContext) {
        return;
    }

    stopBackgroundMusic();

    musicStep = 0;

    const melody =
        [
            261.63,
            329.63,
            392.00,
            329.63,
            293.66,
            349.23,
            440.00,
            349.23
        ];


    function playMusicNote() {

        if (!soundOn) {
            return;
        }

        const frequency =
            melody[musicStep];

        playTone(
            frequency,
            0.35,
            "sine",
            0.008
        );

        musicStep++;

        if (
            musicStep >=
            melody.length
        ) {
            musicStep = 0;
        }

    }


    playMusicNote();

    musicTimer =
        setInterval(
            playMusicNote,
            650
        );

}


// ============================================
// 🛑 STOP BACKGROUND MUSIC
// ============================================

function stopBackgroundMusic() {

    if (musicTimer) {

        clearInterval(
            musicTimer
        );

        musicTimer = null;

    }

}


// ============================================
// 🔊 TOGGLE SOUND
// ============================================

function toggleSound() {

    soundOn = !soundOn;

    localStorage.setItem(
        "soundOn",
        soundOn
    );


    if (soundOn) {

        initAudio();

        updateSoundButton();

        startBackgroundMusic();

        playTone(
            659.25,
            0.12,
            "sine",
            0.04
        );

    } else {

        stopBackgroundMusic();

        updateSoundButton();

    }

}


// ============================================
// 🔊 UPDATE SOUND BUTTON
// ============================================

function updateSoundButton() {

    const button =
        document.getElementById(
            "soundButton"
        );

    if (!button) {
        return;
    }


    if (soundOn) {

        button.textContent =
            "🔊 Sound ON";

    } else {

        button.textContent =
            "🔇 Sound OFF";

    }

}


// ============================================
// 🎮 START GAME
// ============================================

function startGame() {

    initAudio();

    clearInterval(
        timerInterval
    );

    level = 1;

    totalScore = 0;

    score = 0;

    time = 0;

    moves = 0;


    document.getElementById(
        "startScreen"
    ).style.display = "none";


    document.getElementById(
        "gameScreen"
    ).style.display = "flex";


    document.getElementById(
        "winScreen"
    ).style.display = "none";


    document.getElementById(
        "level"
    ).textContent = level;


    document.getElementById(
        "score"
    ).textContent = "0";


    document.getElementById(
        "moves"
    ).textContent = "0";


    document.getElementById(
        "timer"
    ).textContent = "0";


    updateBestScore();

    shufflePuzzle();

    startBackgroundMusic();

}


// ============================================
// ⏱️ START TIMER
// ============================================

function startTimer() {

    clearInterval(
        timerInterval
    );

    time = 0;


    document.getElementById(
        "timer"
    ).textContent = "0";


    timerInterval =
        setInterval(
            function () {

                time++;

                document.getElementById(
                    "timer"
                ).textContent =
                    time;

            },
            1000
        );

}


// ============================================
// 🧩 DRAW PUZZLE
// ============================================

function drawPuzzle() {

    const puzzle =
        document.getElementById(
            "puzzle"
        );


    puzzle.innerHTML = "";


    tiles.forEach(
        function (tile, index) {

            const box =
                document.createElement(
                    "div"
                );


            box.className =
                "tile";


            if (tile !== "") {

                box.textContent =
                    tile;


                box.setAttribute(
                    "role",
                    "button"
                );


                box.setAttribute(
                    "aria-label",
                    "Move tile " + tile
                );


                box.onclick =
                    function () {

                        moveTile(index);

                    };

            } else {

                box.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }


            puzzle.appendChild(
                box
            );

        }
    );

}


// ============================================
// 👉 MOVE TILE
// ============================================

function moveTile(index) {

    const emptyIndex =
        tiles.indexOf("");


    const row =
        Math.floor(index / 3);


    const col =
        index % 3;


    const emptyRow =
        Math.floor(emptyIndex / 3);


    const emptyCol =
        emptyIndex % 3;


    const canMove =

        (
            row === emptyRow &&
            Math.abs(
                col - emptyCol
            ) === 1
        )

        ||

        (
            col === emptyCol &&
            Math.abs(
                row - emptyRow
            ) === 1
        );


    if (!canMove) {

        invalidMoveSound();

        return;

    }


    [
        tiles[index],
        tiles[emptyIndex]
    ] =

    [
        tiles[emptyIndex],
        tiles[index]
    ];


    moves++;


    document.getElementById(
        "moves"
    ).textContent =
        moves;


    moveSound();


    drawPuzzle();


    checkWin();

}


// ============================================
// 🔀 SHUFFLE PUZZLE
// ============================================

function shufflePuzzle() {

    tiles =
        [1, 2, 3, 4, 5, 6, 7, 8, ""];


    moves = 0;


    document.getElementById(
        "moves"
    ).textContent =
        "0";


    /*
        Difficulty increases
        as the level increases.

        Minimum = 100 moves
        Maximum = 1200 moves
    */

    let shuffleCount =
        100 +
        (level - 1) * 15;


    if (shuffleCount > 1200) {

        shuffleCount = 1200;

    }


    let previousEmpty =
        -1;


    for (
        let i = 0;
        i < shuffleCount;
        i++
    ) {

        const possible = [];


        const emptyIndex =
            tiles.indexOf("");


        const row =
            Math.floor(
                emptyIndex / 3
            );


        const col =
            emptyIndex % 3;


        // UP
        if (row > 0) {

            possible.push(
                emptyIndex - 3
            );

        }


        // DOWN
        if (row < 2) {

            possible.push(
                emptyIndex + 3
            );

        }


        // LEFT
        if (col > 0) {

            possible.push(
                emptyIndex - 1
            );

        }


        // RIGHT
        if (col < 2) {

            possible.push(
                emptyIndex + 1
            );

        }


        /*
            Avoid immediately
            undoing the previous move.
        */

        const filtered =
            possible.filter(
                function (position) {

                    return position !==
                        previousEmpty;

                }
            );


        const choices =
            filtered.length > 0
                ? filtered
                : possible;


        const randomIndex =
            choices[
                Math.floor(
                    Math.random() *
                    choices.length
                )
            ];


        previousEmpty =
            emptyIndex;


        [
            tiles[emptyIndex],
            tiles[randomIndex]
        ] =

        [
            tiles[randomIndex],
            tiles[emptyIndex]
        ];

    }


    /*
        Make sure puzzle isn't
        accidentally already solved.
    */

    if (isSolved()) {

        shufflePuzzle();

        return;

    }


    startTimer();

    drawPuzzle();

}


// ============================================
// 🏆 CHECK WIN
// ============================================

function checkWin() {

    if (!isSolved()) {
        return;
    }


    clearInterval(
        timerInterval
    );


    stopBackgroundMusic();


    /*
        Score formula:
        Higher level = more points.
        Faster time = more points.
        Fewer moves = more points.
    */

    score =
        Math.max(
            100,
            1000 +
            (level * 500) -
            (time * 2) -
            moves
        );


    totalScore += score;


    const isNewBest =
        score > bestScore;


    if (isNewBest) {

        bestScore = score;


        localStorage.setItem(
            "bestScore",
            bestScore
        );

    }


    // Update game score

    document.getElementById(
        "score"
    ).textContent =
        score;


    // Update result

    document.getElementById(
        "finalLevel"
    ).textContent =
        level;


    document.getElementById(
        "finalTime"
    ).textContent =
        time;


    document.getElementById(
        "finalMoves"
    ).textContent =
        moves;


    document.getElementById(
        "finalScore"
    ).textContent =
        score;


    document.getElementById(
        "finalBestScore"
    ).textContent =
        bestScore;


    updateBestScore();


    // Sounds

    winSound();


    if (isNewBest) {

        setTimeout(
            function () {

                bestScoreSound();

            },
            550
        );

    }


    // Celebration

    createCelebration();


    // Show win screen

    document.getElementById(
        "gameScreen"
    ).style.display =
        "none";


    document.getElementById(
        "winScreen"
    ).style.display =
        "flex";

}


// ============================================
// ✅ CHECK SOLVED
// ============================================

function isSolved() {

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        if (
            tiles[i] !==
            i + 1
        ) {

            return false;

        }

    }


    return tiles[8] === "";

}


// ============================================
// ➡️ NEXT LEVEL
// ============================================

function nextLevel() {

    level++;


    document.getElementById(
        "level"
    ).textContent =
        level;


    document.getElementById(
        "winScreen"
    ).style.display =
        "none";


    document.getElementById(
        "gameScreen"
    ).style.display =
        "flex";


    score = 0;

    time = 0;

    moves = 0;


    document.getElementById(
        "score"
    ).textContent =
        "0";


    document.getElementById(
        "timer"
    ).textContent =
        "0";


    document.getElementById(
        "moves"
    ).textContent =
        "0";


    shufflePuzzle();

    startBackgroundMusic();

}


// ============================================
// 🔄 RESTART GAME
// ============================================

function restartGame() {

    clearInterval(
        timerInterval
    );


    stopBackgroundMusic();


    level = 1;

    totalScore = 0;

    score = 0;

    time = 0;

    moves = 0;


    document.getElementById(
        "startScreen"
    ).style.display =
        "none";


    document.getElementById(
        "gameScreen"
    ).style.display =
        "flex";


    document.getElementById(
        "winScreen"
    ).style.display =
        "none";


    document.getElementById(
        "level"
    ).textContent =
        "1";


    document.getElementById(
        "score"
    ).textContent =
        "0";


    document.getElementById(
        "moves"
    ).textContent =
        "0";


    document.getElementById(
        "timer"
    ).textContent =
        "0";


    shufflePuzzle();

    startBackgroundMusic();

}


// ============================================
// 🏠 HOME
// ============================================

function goHome() {

    clearInterval(
        timerInterval
    );


    stopBackgroundMusic();


    document.getElementById(
        "gameScreen"
    ).style.display =
        "none";


    document.getElementById(
        "winScreen"
    ).style.display =
        "none";


    document.getElementById(
        "startScreen"
    ).style.display =
        "flex";

}


// ============================================
// 🎉 CELEBRATION
// ============================================

function createCelebration() {

    const oldCelebration =
        document.getElementById(
            "celebration"
        );


    if (oldCelebration) {

        oldCelebration.remove();

    }


    const celebration =
        document.createElement(
            "div"
        );


    celebration.id =
        "celebration";


    celebration.innerHTML =
        "🎉 🎊 ⭐ 🏆 ⭐ 🎊 🎉";


    document.body.appendChild(
        celebration
    );


    setTimeout(
        function () {

            if (
                celebration.parentNode
            ) {

                celebration.remove();

            }

        },
        1600
    );

}


// ============================================
// 🏅 UPDATE BEST SCORE
// ============================================

function updateBestScore() {

    const bestScoreElement =
        document.getElementById(
            "bestScore"
        );


    if (bestScoreElement) {

        bestScoreElement.textContent =
            bestScore;

    }

}
