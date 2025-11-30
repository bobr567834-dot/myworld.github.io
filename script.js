const statusDisplay = document.querySelector('#status');
const restartButton = document.querySelector('#restart');
const board = document.querySelector('#board');

// Элементы управления режимом и сложностью
const gameModeSelector = document.querySelector('#gameMode');
const difficultySelector = document.querySelector('#difficultySelector');
const difficultyLevel = document.querySelector('#difficulty');

// Состояние игры
let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""]; // 9 пустых ячеек
let gameMode = 'human';
let difficulty = 'easy';

// Условия победы
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Ряды
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Колонки
    [0, 4, 8], [2, 4, 6]             // Диагонали
];

// Сообщения
const winningMessage = () => `Игрок ${currentPlayer} победил! 🎉`;
const drawMessage = () => `Ничья! 🤝`;
const currentPlayerTurn = () => `Ходит ${currentPlayer}`;

// --- ИНИЦИАЛИЗАЦИЯ ИГРЫ ---

// Создание ячеек
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
}

// Прослушиватели для настроек
gameModeSelector.addEventListener('change', (e) => {
    gameMode = e.target.value;
    difficultySelector.style.display = gameMode === 'ai' ? 'block' : 'none';
    handleRestartGame();
});

difficultyLevel.addEventListener('change', (e) => {
    difficulty = e.target.value;
    handleRestartGame();
});

// Начальное сообщение
statusDisplay.innerHTML = currentPlayerTurn();
restartButton.addEventListener('click', handleRestartGame);

// --- ЛОГИКА ХОДОВ ---

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    // Если ход уже был сделан, или игра закончена, или ждем хода ИИ
    if (gameState[clickedCellIndex] !== "" || !gameActive || (gameMode === 'ai' && currentPlayer === 'O')) {
        return;
    }
    
    // Ход игрока-человека
    handleMove(clickedCell, clickedCellIndex);
    handleResultValidation();

    // Если игра еще активна, включен режим ИИ, и сейчас ход О (компьютера)
    if (gameActive && gameMode === 'ai' && currentPlayer === 'O') {
        // Делаем задержку для имитации "мышления"
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
    
    // Если включен режим ИИ и компьютер начинает (что маловероятно, но на всякий случай)
    if (gameMode === 'ai' && currentPlayer === 'O') {
        setTimeout(handleComputerMove, 800);
    }
}


// ===================================
// ЛОГИКА ИИ (Компьютер играет за 'O')
// ===================================

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
        // Легко: Случайный ход
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } 
    
    // Средне/Сложно: Пытается выиграть или заблокировать
    let moveIndex = getWinningOrBlockingMove(emptyCells);

    if (moveIndex !== undefined && difficulty === 'medium') {
        return moveIndex;
    }
    
    if (moveIndex !== undefined && difficulty === 'hard') {
        return moveIndex;
    }
    
    // Дополнительная стратегия для "Сложно"
    if (difficulty === 'hard') {
        // 1. Занять центр
        if (gameState[4] === '') return 4; 
        
        // 2. Занять углы
        const corners = [0, 2, 6, 8].filter(i => gameState[i] === '');
        if (corners.length > 0) {
            return corners[Math.floor(Math.random() * corners.length)];
        }
    }
    
    // Если не найдено стратегического хода, делаем случайный
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}


function getWinningOrBlockingMove(emptyCells) {
    // 1. Проверяем, может ли ИИ ('O') выиграть
    for (const index of emptyCells) {
        gameState[index] = 'O';
        if (checkWin('O')) {
            gameState[index] = ''; 
            return index; 
        }
        gameState[index] = '';
    }

    // 2. Проверяем, нужно ли блокировать ход игрока ('X')
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
    
    if (emptyCells.length === 0) return; // Ничья, если не обработано раньше

    const bestMoveIndex = getBestMoveIndex(emptyCells);

    if (bestMoveIndex !== undefined && gameActive) {
        const cellElement = document.querySelector(`[data-index="${bestMoveIndex}"]`);
        handleMove(cellElement, bestMoveIndex);
        handleResultValidation();
    }
}