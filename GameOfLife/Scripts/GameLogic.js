// Clear gameBoardCopy table
function clearGameBoardCopy() {
    for (var i = 0; i < gameBoardX; i++)
        for (var j = 0; j < gameBoardY; j++)
            gameBoardCopy[i][j] = 0;
}

// Set all gameBoard values to values from gameBoardCopy
function setGameBoardToGameBoardCopy() {
    for (var i = 0; i < gameBoardX; i++)
        for (var j = 0; j < gameBoardY; j++)
            gameBoard[i][j] = gameBoardCopy[i][j];
}

/*
4
*/
function getNeighborsCountNeumann(x, y) {
    var neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    return getNeighborsCount(x, y, neighbors, gameBoardX, gameBoardY);
}

/*
8
*/
function getNeighborsCountMoore(x, y) {
    var neighbors = [[1, 0], [-1, 0],
             [0, 1], [0, -1],
             [-1, -1], [-1, 1],
             [1, -1], [1, 1]];
    return getNeighborsCount(x, y, neighbors, gameBoardX, gameBoardY);
}

/*
    Count living cells using Neighbors array.
*/
function getNeighborsCount(x, y, neighborsArray, width, height) {
    var result = 0;
    var newX = x;
    var newY = y;
    for (var i = 0; i < neighborsArray.length; i++) {
        newX = x + neighborsArray[i][0];
        newY = y + neighborsArray[i][1];

        if (newY >= 0 && newY < height && newX >= 0 && newX < width && gameBoard[newX][newY] >= 1)
            result++;
    }

    return result;
}

/*
    Play game using standard automat
*/
function playGameOfLifeAutomat() {
    playLifeAutomat(getNeighborsCountMoore);
    drawBoard();
}

/*
    Play game using march automat
*/
function playMarchGameAutomat() {
    playMarchAutomat(getNeighborsCountMoore);
    drawBoard();
}

/*
    Play game using march automat
*/
function playInvasionGameAutomat() {
    playInvasionAutomat(getNeighborsCountMoore);
    drawBoard();
}