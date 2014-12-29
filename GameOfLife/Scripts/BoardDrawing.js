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
    prepareBoard();
}

// Change cell size to bigger
function setBiggerCellSize() {
    cellSize = 50;
    prepareBoard();
}

// Fill board randomly
function randomCells() {
    for (var i = 0; i < gameBoardX; i++)
        for (var j = 0; j < gameBoardY; j++) {
            gameBoard[i][j] = (Math.random() > 0.5) ? 1 : 0;
            if (gameBoard[i][j] == 1)
                fillCell(i, j);
            else
                clearCell(i, j);
        }
}

/*
    Get clicked position and calculate x and y position to a board
    Fill rectangle and set values on gameBoard.
*/
function getClickedPositionAndRedraw(e) {
    var x = e.clientX - paddingAroundGrid - $('#canvas').offset().left;
    var y = e.clientY - paddingAroundGrid - $('#canvas').offset().top;
    var canvasWidth = document.getElementById('canvas').getAttribute('width');
    var canvasHeight = document.getElementById('canvas').getAttribute('height');
    if (x > canvasWidth - paddingAroundGrid || y > canvasHeight - paddingAroundGrid ||
        x < 0 || y < 0)
        return;
    x = parseInt(x / cellSize);
    y = parseInt(y / cellSize);

    if (gameBoard[x][y] == 0) {
        gameBoard[x][y] = 1;
        fillCell(x, y);
    } else if (gameBoard[x][y] == 1 && playFunction == playInvasionGameAutomat) {
        gameBoard[x][y] = 2;
        fillCell(x, y);
    } else {
        gameBoard[x][y] = 0;
        clearCell(x, y);
    }
}

function playModeChanged() {
    var selectionId = document.getElementById('mySelect').options.selectedIndex;

    if (selectionId == 0)
        playFunction = playGameOfLifeAutomat;
    else if (selectionId == 1)
        playFunction = playMarchGameAutomat;
    else if (selectionId == 2)
        playFunction = playInvasionGameAutomat;
    else
        playFunction = playGameOfLifeAutomat;
}

// Event handlers configuration
function configuration() {
    playFunction = playInvasionGameAutomat;
    var canvas = document.getElementById('canvas');
    canvas.addEventListener('click', getClickedPositionAndRedraw, false);
}

// Start playing game of life with standard timestep
function start() {
    if (setIntervalId != null)
        clearInterval(setIntervalId);
    setIntervalId = setInterval(playFunction, timeStep);
}

function oneStep() {
    stop();
    playFunction();
}

// Set step to half a second
function slowStep() {
    timeStep = 1000 / 2;
    start();
}

// Set step to quater a second
function mediumStep() {
    timeStep = 1000 / 4;
    start();
}

// Set step to eigths a second
function fastStep() {
    timeStep = 1000 / 8;
    start();
}

// Stop working
function stop() {
    if (setIntervalId != null)
        clearInterval(setIntervalId);
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