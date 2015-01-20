var gameBoard = null;
var gameBoardCopy = null;
var gameBoardX = 0;
var gameBoardY = 0;
var paddingAroundGrid = 5;
var cellSize = 50;
var onMouseX = null;
var onMouseY = null;
var timeStep = 1 * 1000;
var setIntervalId = null;
var playFunction;
var automats = ['Gra w życie', 'Marsza', 'Inwazja'];

// Change cell size to smaller
function setSmallerCellSize() {
    cellSize = 25;
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
    console.log("random" + " " + random);
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
    console.log("Jestem w drawBoarders");
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

        console.log(cellSize);
        // Draw vertical lines.
        for (var x = 0; x <= canvasWidth; x += cellSize) {
            context.moveTo(0.5 + x + paddingAroundGrid, paddingAroundGrid);
            console.log('Start' + (0.5 + x + paddingAroundGrid) + ' ' + paddingAroundGrid);
            context.lineTo(0.5 + x + paddingAroundGrid, canvasHeight + paddingAroundGrid);
            console.log('End' + (0.5 + x + paddingAroundGrid) + ' ' + (canvasHeight + paddingAroundGrid));
        }

        // Draw horizontal lines
        for (var x = 0; x <= canvasHeight; x += cellSize) {
            context.moveTo(paddingAroundGrid, 0.5 + x + paddingAroundGrid);
            context.lineTo(canvasWidth + paddingAroundGrid, 0.5 + x + paddingAroundGrid);
        }

        context.strokeStyle = "black";
        context.stroke();
        context.closePath();

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