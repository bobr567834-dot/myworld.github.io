const statusDisplay = document.querySelector('#status');
const restartButton = document.querySelector('#restart');
const board = document.querySelector('#board');

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""]; // 9 пустых ячеек

// Создание ячеек
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i; // Сохраняем индекс ячейки
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
}

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Ряды
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Колонки
    [0, 4, 8], [2, 4, 6]             // Диагонали
];

// Сообщения
const winningMessage = () => `Игрок ${currentPlayer} победил! 🎉`;
const drawMessage = () => `Ничья! 🤝`;
const currentPlayerTurn = () => `Ходит ${currentPlayer}`;

statusDisplay.innerHTML = currentPlayerTurn();

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    // Проверяем, был ли ход уже сделан или игра закончена
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleMove(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleMove(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase()); // Добавляем класс для цвета
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    // Проверяем на ничью
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    // Переключаем ход
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
}

restartButton.addEventListener('click', handleRestartGame);