var gameBoard = null;
var gameBoardCopy = null;
var gameBoardX = 0;
var gameBoardY = 0;
var paddingAroundGrid = 5;
var cellSize = 30;
var onMouseX = null;
var onMouseY = null;

// check if cell (x,y) exists
function isInside(x, y) {
    if (x >= 0 && x < gameBoardX && y >= 0 && y < gameBoardY)
        return true;
    return false;
}

// Change cell size to size chosed by user (slider)
function setCellSize(size) {
    cellSize = size;
    clearBoard();
    prepareBoard();
}

// Change cell size to smaller
function setSmallerCellSize() {
    cellSize = 10;
    clearBoard();
    prepareBoard();
}

// Change cell size to bigger
function setBiggerCellSize() {
    cellSize = 50;
    clearBoard();
    prepareBoard();
}

// Clear all board
function clearBoard() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        var canvasWidth = canvas.getAttribute('width');
        var canvasHeight = canvas.getAttribute('height');
        // Clear board
        context.clearRect(0, 0, canvasWidth + 100, canvasHeight + 100);
    }
}

// Fill board randomly
function randomCells() {
    var random = (playFunction == playInvasionGameAutomat) ? randomForInvasion : simpleRandom;
    for (var i = 0; i < gameBoardX; i++)
        for (var j = 0; j < gameBoardY; j++) {
            gameBoard[i][j] = random();
            if (gameBoard[i][j] >= 1)
                fillCell(i, j);
            else
                clearCell(i, j);
        }
}

/*
* Random function to generate values: 2, 1, 0. Based on simple random, that 
returns values in range (0,1) multiplied by 2.
*/
function randomForInvasion() {
    var random = Math.random() * 2;
    return random > 1.33 ? 2 : (random > 0.66) ? 1 : 0;
}

/*
* Simple random function to generate values: 1, 0.
*/
function simpleRandom() {
    return (Math.random() > 0.5) ? 1 : 0;
}

// Clear all cells
function clearCells() {
    for (var i = 0; i < gameBoardX; i++) {
        for (var j = 0; j < gameBoardY; j++) {
            gameBoard[i][j] = 0;
            clearCell(i, j);
        }
    }
}

// Prepare borders and board
function prepareBoard() {
    configuration();
    drawBoardBoarders();
    drawBoard();
}

// Fill all cells that have ones on gameBoard.
function drawBoard() {
    for (var i = 0; i < gameBoardX; i++) {
        for (var j = 0; j < gameBoardY; j++) {
            if (gameBoard[i][j] >= 1)
                fillCell(i, j);
            else
                clearCell(i, j);
        }
    }
}

/*
    Function that draws board's boarders. It's based on width and height of canvas and 
    cell size which can be chosen by user.

    It also create a gameBoard - global game board array. For logical operations.
*/
function drawBoardBoarders() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        var canvasWidth = canvas.getAttribute('width');
        var canvasHeight = canvas.getAttribute('height');

        // Calculate cellsCount (width and height)
        var cellWidthCount = parseInt((canvasWidth - 2 * paddingAroundGrid) / cellSize);
        var cellHeigthCount = parseInt((canvasHeight - 2 * paddingAroundGrid) / cellSize);

        // Calculate new height and width based on cellsize
        canvasWidth = parseInt(cellWidthCount * cellSize);
        canvasHeight = parseInt(cellHeigthCount * cellSize);

        // Clear board
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.beginPath();

        // Draw vertical lines.
        for (var x = 0; x <= canvasWidth; x += cellSize) {
            context.moveTo(0.5 + x + paddingAroundGrid, paddingAroundGrid);
            context.lineTo(0.5 + x + paddingAroundGrid, canvasHeight + paddingAroundGrid);
        }

        // Draw horizontal lines
        for (var x = 0; x <= canvasHeight; x += cellSize) {
            context.moveTo(paddingAroundGrid, 0.5 + x + paddingAroundGrid);
            context.lineTo(canvasWidth + paddingAroundGrid, 0.5 + x + paddingAroundGrid);
        }

        context.strokeStyle = "black";
        context.stroke();
        context.closePath();

        var previousBoardState = new Array(gameBoardX);
        var previousWidth = gameBoardX;
        var previousHeigth = gameBoardY;
        for (var i = 0; i < previousWidth; i++) {
            previousBoardState[i] = new Array(previousHeigth);
        }

        for (var i = 0; i < previousWidth; i++)
            for (var j = 0; j < previousHeigth; j++) {
                previousBoardState[i][j] = gameBoard[i][j];
            }

        gameBoardX = cellWidthCount;
        gameBoardY = cellHeigthCount;
        gameBoard = new Array(cellWidthCount);
        gameBoardCopy = new Array(cellWidthCount);

        for (var i = 0; i < cellWidthCount; i++) {
            gameBoard[i] = new Array(cellHeigthCount);
            gameBoardCopy[i] = new Array(cellHeigthCount);
        }

        for (var i = 0; i < gameBoardX; i++)
            for (var j = 0; j < gameBoardY; j++) {
                gameBoard[i][j] = gameBoardCopy[i][j] = 0;
            }

        // Set previous data
        for (var i = 0; i < previousWidth; i++)
            for (var j = 0; j < previousHeigth; j++) {
                gameBoard[i][j] = gameBoardCopy[i][j] = previousBoardState[i][j];
            }
    }
}
/*
    Fill cell on coordinates x,y. Based on cellSize.
    Need to add 1 to starting points and endingPoints of cell 
    to avoid overlapping gameboarders.
*/
function fillCell(x, y) {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        if (gameBoard[x][y] == 1)
            context.fillStyle = '#d3d3d3';
        else
            context.fillStyle = '#000000';

        var x = paddingAroundGrid + ((x) * cellSize) + 1;
        var y = paddingAroundGrid + ((y) * cellSize) + 1;

        context.fillRect(x, y, cellSize - 1, cellSize - 1);
    }
}

/*
    Clear cell on coordinates x,y. Based on cellSize.
    Need to add 1 to starting points and endingPoints of cell 
    to avoid overlapping gameboarders.
*/
function clearCell(x, y) {

    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var context = canvas.getContext('2d');

        x = paddingAroundGrid + ((x) * cellSize) + 1;
        y = paddingAroundGrid + ((y) * cellSize) + 1;

        context.fillStyle = '#ffffff';
        context.fillRect(x, y, cellSize - 1, cellSize - 1);
    }
}

// Prepare for draw blinkers 
function drawBlinker() {
    if (gameBoardX <= 25 || gameBoardY <= 25) {
        alert("Wymagany rozmiar planszy to przynajmniej: 25 x 25");
        return;
    }
    clearCells();
    blinker(3, 3, gameBoard);
    bloc(17, 3, gameBoard);
    tub(4, 9, gameBoard);
    toad(17, 9, gameBoard);
    clock(10, 15, gameBoard);
    drawBoard();
}

// Prepare for draw march 
function drawMarch() {
    clearCells();
    for (var i = 0; i < Math.min(gameBoardX, gameBoardY); i++)
        gameBoard[i][i] = 1;
    drawBoard();
}

// Prepare for draw invasion 
function drawInvasion() {
    clearCells();
    var x = parseInt(gameBoardX / 2) - 1;
    var y = parseInt(gameBoardY / 2) - 1;
    for (var i = x - 1; i <= x + 1; i++)
        for (var j = y - 1; j <= y + 1; j++)
            gameBoard[i][j] = 1;
    drawBoard();
}

// Prepare for glider
function drawGlider() {
    clearCells();
    glider(
        parseInt(gameBoardX / 4) + parseInt(gameBoardX / 2),
        parseInt(gameBoardY / 4) + parseInt(gameBoardY / 2),
        gameBoard
    );

    lightWeight(
        parseInt(gameBoardX / 3),
        parseInt(gameBoardY / 3),
        gameBoard);
    drawBoard();
}

// Prepare for pi heptomino
function drawPiHeptomino() {
    clearCells();
    piHeptomino(
        parseInt(gameBoardX / 2) - 2,
        parseInt(gameBoardY / 2) + 2,
        gameBoard);
    drawBoard();
}

// Prepare for r heptomino
function drawRHeptomino() {
    clearCells();
    rPentomino(
        parseInt(gameBoardX / 4) + parseInt(gameBoardX / 3),
        parseInt(gameBoardY / 4),
        gameBoard);
    drawBoard();
}

// Prepare for thunderbird
function drawThunderbird() {
    clearCells();
    thunderbird(
        parseInt(gameBoardX / 2) - 2,
        parseInt(gameBoardY / 2) - 2,
        gameBoard);
    drawBoard();
}

// Prepare for glidersByTheDozen
function drawDlidersByTheDozen() {
    clearCells();
    glidersByTheDozen(
        parseInt(gameBoardX / 2) - 2,
        parseInt(gameBoardY / 2) - 2,
        gameBoard);
    drawBoard();
}



// Functions to draw certain objects 
//(from previous application in java - adapter)
function blinker(i, j, boardReference) {
    if (!isInside(i, j)) return;
    boardReference[i][j] = 1;
    boardReference[i + 1][j] = 1;
    boardReference[i + 2][j] = 1;
}

function bloc(i, j, boardReference) {
    if (!isInside(i, j)) return;
    boardReference[i][j] = 1;
    boardReference[i + 1][j] = 1;
    boardReference[i][j + 1] = 1;
    boardReference[i + 1][j + 1] = 1;
}

function tub(i, j, boardReference) {
    if (!isInside(i, j)) return;
    boardReference[i][j] = 1;
    boardReference[i - 1][j + 1] = 1;
    boardReference[i + 1][j + 1] = 1;
    boardReference[i][j + 2] = 1;
}

function toad(i, j, boardReference) {
    if (!isInside(i, j)) return;
    boardReference[i][j] = 1;
    boardReference[i + 1][j] = 1;
    boardReference[i + 2][j] = 1;
    boardReference[i + 1][j + 1] = 1;
    boardReference[i + 2][j + 1] = 1;
    boardReference[i + 3][j + 1] = 1;
}

function clock(i, j, boardReference) {
    if (!isInside(i, j)) return;
    boardReference[i][j] = 1;
    boardReference[i][j + 1] = 1;
    boardReference[i - 1][j + 2] = 1;
    boardReference[i + 1][j + 2] = 1;
    boardReference[i + 1][j + 3] = 1;
    boardReference[i + 2][j + 1] = 1;
}

function glider(i, j, boardReference) {
    if (!isInside(i, j)) return;
    boardReference[i][j] = 1;
    boardReference[i + 1][j] = 1;
    boardReference[i + 2][j] = 1;
    boardReference[i][j + 1] = 1;
    boardReference[i + 1][j + 2] = 1;
}

function lightWeight(i, j, boardReference) {
    if (!isInside(i, j)) return;
    boardReference[i][j] = 1;
    boardReference[i + 1][j] = 1;
    boardReference[i + 2][j] = 1;
    boardReference[i + 3][j] = 1;
    boardReference[i + 4][j + 1] = 1;
    boardReference[i][j + 1] = 1;
    boardReference[i][j + 2] = 1;
    boardReference[i + 1][j + 3] = 1;
}

function piHeptomino(i, j, boardReference) {
    if (!isInside(i, j)) return;
    boardReference[i][j] = 1;
    boardReference[i + 1][j] = 1;
    boardReference[i + 2][j] = 1;
    boardReference[i + 3][j + 1] = 1;
    boardReference[i][j + 1] = 1;
}

function rPentomino(i, j, boardReference) {
    if (!isInside(i, j)) return;
    boardReference[i][j] = 1;
    boardReference[i][j + 1] = 1;
    boardReference[i + 1][j + 1] = 1;
    boardReference[i + 2][j + 1] = 1;
    boardReference[i + 1][j + 2] = 1;
}

function thunderbird(i, j, boardReference) {
    if (!isInside(i, j)) return;
    boardReference[i][j] = 1;
    boardReference[i][j + 1] = 1;
    boardReference[i + 2][j + 1] = 1;
    boardReference[i + 3][j + 1] = 1;
    boardReference[i + 4][j + 1] = 1;
    boardReference[i][j + 2] = 1;
}

function glidersByTheDozen(i, j, boardReference) {
    if (!isInside(i, j)) return;
    boardReference[i][j] = 1;
    boardReference[i + 1][j] = 1;
    boardReference[i + 4][j] = 1;
    boardReference[i][j + 1] = 1;
    boardReference[i][j + 2] = 1;
    boardReference[i + 3][j + 2] = 1;
    boardReference[i + 4][j + 2] = 1;
    boardReference[i + 4][j + 1] = 1;
}