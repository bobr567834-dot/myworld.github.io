const boardElement = document.getElementById('puzzle-board');
const resetBtn = document.getElementById('resetBtn');
const movesDisplay = document.getElementById('moves');
const messageElement = document.getElementById('message');

let tiles = [];
let moves = 0;
let isSolved = false;
const size = 4; // 4x4 поле

resetBtn.addEventListener('click', initGame);

function initGame() {
    isSolved = false;
    moves = 0;
    movesDisplay.textContent = 'Ходов: 0';
    messageElement.classList.add('hidden');
    
    // Создание плиток в порядке
    tiles = Array.from({length: size * size}, (_, i) => i + 1);
    
    shuffleTiles(tiles);
    
    // Проверка на решаемость (классический алгоритм для 15-пазла)
    while (!isSolvable(tiles)) {
        shuffleTiles(tiles);
    }
    
    renderBoard();
}

// Перемешивание (Fisher-Yates)
function shuffleTiles(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Проверка на решаемость (для 4x4)
function isSolvable(arr) {
    let inversions = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] !== 16 && arr[j] !== 16 && arr[i] > arr[j]) {
                inversions++;
            }
        }
    }
    const emptyRowFromBottom = size - Math.floor(arr.indexOf(16) / size);
    return size % 2 === 1 ? inversions % 2 === 0 : (inversions % 2 === 0) === (emptyRowFromBottom % 2 === 1);
}

function renderBoard() {
    boardElement.innerHTML = '';
    
    tiles.forEach((value, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.value = value;
        tile.textContent = value === 16 ? '' : value; // 16 - это пустая ячейка
        
        if (value === 16) {
            tile.classList.add('empty');
        } else {
            tile.addEventListener('click', handleTileClick);
        }
        boardElement.appendChild(tile);
    });
}

function handleTileClick(e) {
    if (isSolved) return;
    
    const clickedValue = parseInt(e.target.dataset.value);
    const clickedIndex = tiles.indexOf(clickedValue);
    const emptyIndex = tiles.indexOf(16);
    
    if (isMoveValid(clickedIndex, emptyIndex)) {
        [tiles[clickedIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[clickedIndex]];
        
        moves++;
        movesDisplay.textContent = `Ходов: ${moves}`;
        
        renderBoard();
        checkWin();
    }
}

function isMoveValid(clickedIndex, emptyIndex) {
    const clickedRow = Math.floor(clickedIndex / size);
    const clickedCol = clickedIndex % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    
    return (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) || 
           (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);
}

function checkWin() {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] !== i + 1) {
            return;
        }
    }
    
    isSolved = true;
    messageElement.textContent = `🎉 ПОБЕДА! Вы собрали пазл за ${moves} ходов!`;
    messageElement.classList.remove('hidden');
    
    const emptyTile = boardElement.querySelector('.empty');
    if (emptyTile) emptyTile.textContent = '16'; 
}

initGame();