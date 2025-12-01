const boardElement = document.getElementById('board');
const newGameButton = document.getElementById('newGame');
const boardSizeSelector = document.getElementById('boardSize');
const minesLeftSpan = document.getElementById('minesLeft');
const timerSpan = document.getElementById('timer');
const messageElement = document.getElementById('message');

let size = 9;
let mines = 10;
let board = [];
let isGameOver = false;
let cellsRevealed = 0;
let timer = 0;
let timerInterval = null;

const sizeConfigs = {
    '9': { size: 9, mines: 10 },
    '16': { size: 16, mines: 40 },
    '25': { size: 25, mines: 99 }
};

newGameButton.addEventListener('click', () => initGame());
boardSizeSelector.addEventListener('change', (e) => {
    const config = sizeConfigs[e.target.value];
    size = config.size;
    mines = config.mines;
    initGame();
});

initGame();

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timer = 0;
    timerSpan.textContent = `Время: 0`;
    timerInterval = setInterval(() => {
        timer++;
        timerSpan.textContent = `Время: ${timer}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function initGame() {
    stopTimer();
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${size}, 30px)`;
    board = Array(size).fill(0).map(() => Array(size).fill({ isMine: false, count: 0, isRevealed: false, isFlagged: false }));
    isGameOver = false;
    cellsRevealed = 0;
    messageElement.classList.add('hidden');
    
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.row = r;
            cellElement.dataset.col = c;
            cellElement.addEventListener('click', handleLeftClick);
            cellElement.addEventListener('contextmenu', handleRightClick);
            boardElement.appendChild(cellElement);
        }
    }
    
    placeMines();
    updateMinesCount();
    minesLeftSpan.textContent = `Мин: ${mines}`;
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        
        if (!board[r][c].isMine) {
            board[r][c] = { ...board[r][c], isMine: true };
            minesPlaced++;
        }
    }
}

function updateMinesCount() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c].isMine) continue;
            
            let count = 0;
            iterateNeighbors(r, c, (nr, nc) => {
                if (board[nr][nc].isMine) count++;
            });
            
            board[r][c] = { ...board[r][c], count: count };
        }
    }
}

function iterateNeighbors(r, c, callback) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                callback(nr, nc);
            }
        }
    }
}

function handleLeftClick(e) {
    if (isGameOver) return;
    
    if (timer === 0 && timerInterval === null) startTimer();

    const cell = e.target;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    
    if (board[r][c].isFlagged || board[r][c].isRevealed) return;

    revealCell(r, c);
}

function handleRightClick(e) {
    e.preventDefault();
    if (isGameOver) return;
    
    if (timer === 0 && timerInterval === null) startTimer();

    const cell = e.target;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    
    if (board[r][c].isRevealed) return;
    
    const isFlagged = board[r][c].isFlagged;
    board[r][c] = { ...board[r][c], isFlagged: !isFlagged };
    cell.classList.toggle('flag', !isFlagged);
    
    const flagsCount = document.querySelectorAll('.cell.flag').length;
    minesLeftSpan.textContent = `Мин: ${mines - flagsCount}`;
    
    checkWinCondition();
}

function revealCell(r, c) {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    if (board[r][c].isRevealed) return;

    let cellData = board[r][c];
    const cellElement = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);

    if (cellData.isMine) {
        cellElement.classList.add('bomb');
        gameOver(false);
        return;
    }
    
    if (cellData.isFlagged) {
        cellData = { ...cellData, isFlagged: false };
        cellElement.classList.remove('flag');
    }

    cellData = { ...cellData, isRevealed: true };
    board[r][c] = cellData;
    cellElement.classList.add('open');
    cellsRevealed++;
    
    if (cellData.count > 0) {
        cellElement.textContent = cellData.count;
        cellElement.dataset.count = cellData.count;
    } else {
        iterateNeighbors(r, c, revealCell);
    }
    
    checkWinCondition();
}

function checkWinCondition() {
    const totalCells = size * size;
    if (cellsRevealed === totalCells - mines) {
        gameOver(true);
    }
}

function gameOver(isWin) {
    isGameOver = true;
    stopTimer();
    
    if (isWin) {
        messageElement.textContent = `🥳 ПОБЕДА! Вы разминировали поле за ${timer} секунд!`;
        messageElement.className = 'win';
        document.querySelectorAll('.cell').forEach(cell => {
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            if (board[r][c].isMine && !board[r][c].isFlagged) {
                 cell.classList.add('flag');
            }
        });
    } else {
        messageElement.textContent = '💥 БУМ! Вы проиграли.';
        messageElement.className = 'lose';
        
        document.querySelectorAll('.cell').forEach(cell => {
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            if (board[r][c].isMine) {
                 cell.classList.add('bomb');
            }
        });
    }
    messageElement.classList.remove('hidden');
}