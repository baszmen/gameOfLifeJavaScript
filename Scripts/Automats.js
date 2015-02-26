/*
    Game of life algorithm.
    If cell is active (1) and there is 2 or 3 neighbors that are active - it stays active.
    If cell is inactive (0) and there is extaclyt 3 neighbors active - it becomes active
    Otherwise - it's inactive.
*/
function playLifeAutomat(neighborsFunction) {
    clearGameBoardCopy();

    for (var i = 0; i < gameBoardX; i++) {
        for (var j = 0; j < gameBoardY; j++) {
            if (gameBoard[i][j] == 1 && (neighborsFunction(i, j) == 2 || neighborsFunction(i, j) == 3))
                gameBoardCopy[i][j] = 1;
            else if (gameBoard[i][j] == 0 && neighborsFunction(i, j) == 3)
                gameBoardCopy[i][j] = 1;
            else {
                gameBoardCopy[i][j] = 0;
            }
        }
    }

    prepareBoardAfterChanges();
}

/*
    Description of March algorithm.
*/
function playMarchAutomat(neighborsFunction) {
    clearGameBoardCopy();
    for (var i = 0; i < gameBoardX; i++) {
        for (var j = 0; j < gameBoardY; j++) {
            if (gameBoard[i][j] == 1 && neighborsFunction(i, j) >= 4)
                gameBoardCopy[i][j] = 0;
            else if (gameBoard[i][j] == 0 && (neighborsFunction(i, j) == 2))
                gameBoardCopy[i][j] = 1;
            else if (neighborsFunction(i, j) == 3)
                gameBoardCopy[i][j] = 1;
            else {
                gameBoardCopy[i][j] = 0;
            }
        }
    }

    prepareBoardAfterChanges();
}

/*
    Description of Invasion algorithm.
*/
function playInvasionAutomat(neighborsFunction) {
    clearGameBoardCopy();

    for (var i = 0; i < gameBoardX; i++) {
        for (var j = 0; j < gameBoardY; j++) {
            if (gameBoard[i][j] == 1 && neighborsFunction(i, j) >= 3)
                gameBoardCopy[i][j] = 2;
            else if (gameBoard[i][j] == 0 && neighborsFunction(i, j) >= 2)
                gameBoardCopy[i][j] = 1;
            else if (gameBoard[i][j] == 1 && neighborsFunction(i, j) >= 1 && neighborsFunction(i, j) <= 2)
                gameBoardCopy[i][j] = 1;
            else {
                gameBoardCopy[i][j] = 0;
            }
        }
    }

    prepareBoardAfterChanges();
}


function prepareBoardAfterChanges() {
    if (!anyChanges())
        stop();

    setGameBoardToGameBoardCopy();
}

/*
    Check if there is any changes in gameBoard and gameBoardCopy.
    If not, we can stop playing.
*/
function anyChanges() {
    var changes = false;
    for (var i = 0; i < gameBoardX; i++) {
        for (var j = 0; j < gameBoardY; j++) {
            if (gameBoard[i][j] != gameBoardCopy[i][j])
                changes = true;
        }
    }

    return changes;
}