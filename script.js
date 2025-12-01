const statusDisplay = document.querySelector('#status');
const restartButton = document.querySelector('#restart');
const board = document.querySelector('#board');
const gameModeSelector = document.querySelector('#gameMode');
const difficultySelector = document.querySelector('#difficultySelector');
const difficultyLevel = document.querySelector('#difficulty');

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameMode = 'human';
let difficulty = 'easy';

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const winningMessage = () => `Игрок ${currentPlayer} победил! 🎉`;
const drawMessage = () => `Ничья! 🤝`;
const currentPlayerTurn = () => `Ходит ${currentPlayer}`;

for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
}

gameModeSelector.addEventListener('change', (e) => {
    gameMode = e.target.value;
    difficultySelector.style.display = gameMode === 'ai' ? 'block' : 'none';
    handleRestartGame();
});

difficultyLevel.addEventListener('change', (e) => {
    difficulty = e.target.value;
    handleRestartGame();
});

statusDisplay.innerHTML = currentPlayerTurn();
restartButton.addEventListener('click', handleRestartGame);

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    if (gameState[clickedCellIndex] !== "" || !gameActive || (gameMode === 'ai' && currentPlayer === 'O')) {
        return;
    }
    
    handleMove(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (gameActive && gameMode === 'ai' && currentPlayer === 'O') {
        statusDisplay.innerHTML = "Компьютер думает...";
        setTimeout(handleComputerMove, 800); 
    }
}

function handleMove(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
}

function handleResultValidation() {
    let roundWon = checkWin(currentPlayer);

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('x', 'o');
    });
    
    if (gameMode === 'ai' && currentPlayer === 'O') {
        setTimeout(handleComputerMove, 800);
    }
}

function getEmptyCells() {
    return gameState
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);
}

function checkWin(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === player && gameState[b] === player && gameState[c] === player) {
            return true;
        }
    }
    return false;
}

function getBestMoveIndex(emptyCells) {
    if (difficulty === 'easy') {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } 
    
    let moveIndex = getWinningOrBlockingMove(emptyCells);

    if (moveIndex !== undefined && (difficulty === 'medium' || difficulty === 'hard')) {
        return moveIndex;
    }
    
    if (difficulty === 'hard') {
        if (gameState[4] === '') return 4; 
        const corners = [0, 2, 6, 8].filter(i => gameState[i] === '');
        if (corners.length > 0) {
            return corners[Math.floor(Math.random() * corners.length)];
        }
    }
    
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getWinningOrBlockingMove(emptyCells) {
    for (const index of emptyCells) {
        gameState[index] = 'O';
        if (checkWin('O')) {
            gameState[index] = ''; 
            return index; 
        }
        gameState[index] = '';
    }

    for (const index of emptyCells) {
        gameState[index] = 'X';
        if (checkWin('X')) {
            gameState[index] = ''; 
            return index; 
        }
        gameState[index] = '';
    }
    
    return undefined;
}

function handleComputerMove() {
    const emptyCells = getEmptyCells();
    
    if (emptyCells.length === 0) return;

    const bestMoveIndex = getBestMoveIndex(emptyCells);

    if (bestMoveIndex !== undefined && gameActive) {
        const cellElement = document.querySelector(`[data-index="${bestMoveIndex}"]`);
        handleMove(cellElement, bestMoveIndex);
        handleResultValidation();
    }
}