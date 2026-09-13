let level = 1;
let time = 0;
let moves = 0;
let score = 0;
let totalScore = 0;
let timerInterval;

let tiles = [1,2,3,4,5,6,7,8,""];


/* START GAME */
function startGame() {

    level = 1;
    totalScore = 0;

    document.getElementById("startScreen").style.display = "none";
    document.getElementById("finalScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    document.getElementById("winScreen").style.display = "none";

    document.getElementById("level").textContent = level;

    shufflePuzzle();
}


/* TIMER */
function startTimer() {

    clearInterval(timerInterval);

    time = 0;

    document.getElementById("timer").textContent = "0";

    timerInterval = setInterval(function() {

        time++;

        document.getElementById("timer").textContent = time;

    }, 1000);
}


/* DRAW PUZZLE */
function drawPuzzle() {

    const puzzle = document.getElementById("puzzle");

    puzzle.innerHTML = "";

    tiles.forEach(function(tile, index) {

        const box = document.createElement("div");

        box.className = "tile";

        box.textContent = tile;

        if (tile !== "") {

            box.onclick = function() {

                moveTile(index);

            };
        }

        puzzle.appendChild(box);

    });
}


/* MOVE TILE */
function moveTile(index) {

    const emptyIndex = tiles.indexOf("");

    const row = Math.floor(index / 3);
    const col = index % 3;

    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;


    if (
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1)
    ) {

        [tiles[index], tiles[emptyIndex]] =
        [tiles[emptyIndex], tiles[index]];

        moves++;

        document.getElementById("moves").textContent = moves;

        drawPuzzle();

        checkWin();
    }
}


/* SHUFFLE */
function shufflePuzzle() {

    tiles = [1,2,3,4,5,6,7,8,""];

    moves = 0;

    document.getElementById("moves").textContent = "0";

    /*
       Higher level = more shuffle
    */

    let shuffleCount = 100 + (level * 100);


    for (let i = 0; i < shuffleCount; i++) {

        const possible = [];

        const emptyIndex = tiles.indexOf("");

        const row = Math.floor(emptyIndex / 3);
        const col = emptyIndex % 3;


        if (row > 0)
            possible.push(emptyIndex - 3);

        if (row < 2)
            possible.push(emptyIndex + 3);

        if (col > 0)
            possible.push(emptyIndex - 1);

        if (col < 2)
            possible.push(emptyIndex + 1);


        const randomIndex =
            possible[Math.floor(Math.random() * possible.length)];


        [tiles[emptyIndex], tiles[randomIndex]] =
        [tiles[randomIndex], tiles[emptyIndex]];
    }


    startTimer();

    drawPuzzle();
}


/* CHECK WIN */
function checkWin() {

    const win =
        tiles.slice(0,8).every(function(tile,index) {

            return tile === index + 1;

        }) && tiles[8] === "";


    if (win) {

        clearInterval(timerInterval);


        /*
          Score calculation
        */

        score = Math.max(
            100,
            1000 + (level * 500) - (time * 2) - moves
        );


        totalScore += score;


        document.getElementById("finalLevel").textContent = level;

        document.getElementById("finalTime").textContent = time;

        document.getElementById("finalMoves").textContent = moves;

        document.getElementById("finalScore").textContent = score;


        document.getElementById("gameScreen").style.display = "none";

        document.getElementById("winScreen").style.display = "block";
    }
}


/* NEXT LEVEL */
function nextLevel() {

    level++;


    /*
      Only 3 levels for now
    */

    if (level > 3) {

        document.getElementById("winScreen").style.display = "none";

        document.getElementById("totalScore").textContent =
            totalScore;

        document.getElementById("finalScreen").style.display = "block";

        return;
    }


    document.getElementById("level").textContent = level;

    document.getElementById("winScreen").style.display = "none";

    document.getElementById("gameScreen").style.display = "block";

    shufflePuzzle();
}