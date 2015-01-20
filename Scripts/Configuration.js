/*
    Get clicked position and calculate x and y position to a board
    Fill rectangle and set values on gameBoard.
*/
function getClickedPositionAndRedraw(e) {
    // get clicked position based on padding around grid and canvas position
    var x = e.pageX - paddingAroundGrid - $('#canvas').offset().left;
    var y = e.pageY - paddingAroundGrid - $('#canvas').offset().top;
    var canvasWidth = document.getElementById('canvas').getAttribute('width');
    var canvasHeight = document.getElementById('canvas').getAttribute('height');
    // check if inside canvas
    if (x > canvasWidth - paddingAroundGrid || y > canvasHeight - paddingAroundGrid ||
        x < 0 || y < 0)
        return;
    x = parseInt(x / cellSize);
    y = parseInt(y / cellSize);

    // check to make sure, if we are inside gameBoard
    if (x < 0 || x >= gameBoardX || y < 0 || y >= gameBoardY)
        return;

    // fill cell
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

/*
* Change mode after clicked on html form
*/
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
    playFunction = playGameOfLifeAutomat;
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