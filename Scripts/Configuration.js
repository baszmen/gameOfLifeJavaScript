var timeStep = 0.1 * 1000;
var setIntervalId = null;
var playFunction;

var languageDict = {
    'pl': {
        'clearButton': 'Wyczy��',
        'startButton': 'Start',
        'stopButton': 'Stop',
        'stepButton': 'Krok',
        'randButton': 'Losuj',
        'methodLabel': 'Wybierze metod�',
        'gameOfLifeOption': 'Gra w �ycie',
        'marchOption': 'Marsz',
        'invasionOption': 'Inwazja',
        'fpsLabel': 'Klatek na sekund�:',
        'cellSizeLabel': 'Rozmiar kom�rki'
    },
    'en': {
        'clearButton': 'Clear',
        'startButton': 'Start',
        'stopButton': 'Stop',
        'stepButton': 'Step',
        'randButton': 'Random',
        'methodLabel': 'Chose method:',
        'gameOfLifeOption': 'Game of Life',
        'marchOption': 'March',
        'invasionOption': 'Invasion',
        'fpsLabel': 'Frames per second:',
        'cellSizeLabel': 'Cell size:'
    }
};

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
    console.log("Dupsko");
    var selectionId = document.getElementById('selectionMenu').value;
    if (selectionId == 0)
        playFunction = playGameOfLifeAutomat;
    else if (selectionId == 1)
        playFunction = playMarchGameAutomat;
    else if (selectionId == 2)
        playFunction = playInvasionGameAutomat;
    else
        playFunction = playGameOfLifeAutomat;
    console.log(playFunction);
}

// Event handlers configuration
function configuration() {
    playFunction = playGameOfLifeAutomat;
    var canvas = document.getElementById('canvas');
    canvas.addEventListener('click', getClickedPositionAndRedraw, false);
}

// Start playing game of life with standard timestep
function start() {
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
    if (setIntervalId != null)
        clearInterval(setIntervalId);
    setIntervalId = setInterval(playFunction, timeStep);
}

function oneStep() {
    stop();
    playFunction();
}

// Stop working
function stop() {
    document.getElementById('stopButton').disabled = true;
    document.getElementById('startButton').disabled = false;
    if (setIntervalId != null)
        clearInterval(setIntervalId);
}

// Refresh timestep
function refreshStep() {
    var isWorking = setIntervalId != null;
    stop();
    if (isWorking)
        start();
}

// Set propert language on every object in languageDictionary
function languageConfiguration() {
    var lang = sessionStorage.getItem("lang");
    var keys = Object.keys(languageDict[lang]);
    for (var index in keys)
        document.getElementById(keys[index]).innerHTML = languageDict[lang][keys[index]];
}

// Configuration of jQuery controls - sliders, selection menu and buttons.
$(function () {
    languageConfiguration();

    window.addEventListener('resize', function (event) {
        var boardContainer = document.getElementById('boardContainer');

        console.log(boardContainer);

        document.getElementById('canvas').setAttribute('width', Math.min($("#boardContainer").width(), $("#boardContainer").height()));
        document.getElementById('canvas').setAttribute('height', Math.min($("#boardContainer").width(), $("#boardContainer").height()));
        prepareBoard();
    });

    $("#cellSizeSlider").slider({
        range: "min",
        value: 50,
        min: 10,
        max: 100,
        slide: function (event, ui) {
            $("#cellSize").val(ui.value);
            setCellSize(ui.value);
        }
    });
    $("#aminationTicksPerSecond").slider({
        range: "min",
        value: 10,
        min: 1,
        max: 20,
        slide: function (event, ui) {
            $("#ticks").val(ui.value);
            timeStep = 1000 / ui.value;
            refreshStep();
        }
    });

    $("#cellSize").val($("#cellSizeSlider").slider("value"));
    $("#ticks").val($("#aminationTicksPerSecond").slider("value"));
});