const board = document.getElementById('board');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore'); 
const statusDisplay = document.getElementById('status');

const gridSize = 20;
const boardSize = gridSize * gridSize;
let snake = [{x: 10, y: 10}];
let food = {};
let direction = 'right';
let score = 0;
let speed = 200;
let gameLoop;
let isGameOver = true;
let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0; // Загрузка рекорда

highScoreDisplay.textContent = `Рекорд: ${highScore}`; // Отображение рекорда

// 1. Инициализация поля
function createGrid() {
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    for (let i = 0; i < boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        board.appendChild(cell);
    }
}

// 2. Генерация еды
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
}

// 3. Рисование игры
function draw() {
    document.querySelectorAll('.snake, .food').forEach(el => {
        el.classList.remove('snake', 'food');
    });

    // Рисование змейки
    snake.forEach(segment => {
        const cellIndex = segment.y * gridSize + segment.x;
        const cell = board.querySelector(`[data-index="${cellIndex}"]`);
        if (cell) cell.classList.add('snake');
    });

    // Рисование еды
    const foodIndex = food.y * gridSize + food.x;
    const foodCell = board.querySelector(`[data-index="${foodIndex}"]`);
    if (foodCell) foodCell.classList.add('food');
}

// 4. Движение
function move() {
    if (isGameOver) return;

    const head = {x: snake[0].x, y: snake[0].y};

    switch (direction) {
        case 'right': head.x++; break;
        case 'left': head.x--; break;
        case 'up': head.y--; break;
        case 'down': head.y++; break;
    }

    // Проверка столкновений
    if (
        head.x < 0 || head.x >= gridSize || 
        head.y < 0 || head.y >= gridSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Проверка еды
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `Счет: ${score}`;
        generateFood(); 
        
        // Ускорение
        if (score % 5 === 0 && speed > 50) {
             clearInterval(gameLoop);
             speed -= 10;
             gameLoop = setInterval(move, speed);
        }
    } else {
        snake.pop(); 
    }

    draw();
}

// 5. Управление
document.addEventListener('keydown', (e) => {
    if (isGameOver && e.key !== 'Enter') return;
    
    if ((e.key === 'ArrowRight' || e.key === 'd') && direction !== 'left') direction = 'right';
    else if ((e.key === 'ArrowLeft' || e.key === 'a') && direction !== 'right') direction = 'left';
    else if ((e.key === 'ArrowUp' || e.key === 'w') && direction !== 'down') direction = 'up';
    else if ((e.key === 'ArrowDown' || e.key === 's') && direction !== 'up') direction = 'down';
});

// 6. Конец игры
function gameOver() {
    isGameOver = true;
    clearInterval(gameLoop);
    
    // Проверка и сохранение рекорда
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreDisplay.textContent = `Рекорд: ${highScore}`;
        statusDisplay.textContent = `НОВЫЙ РЕКОРД! Счет: ${score}`;
    } else {
        statusDisplay.textContent = `Игра окончена! Счет: ${score}`;
    }
    
    startBtn.textContent = 'Играть снова';
    startBtn.style.display = 'block';
}

// 7. Старт игры
function startGame() {
    if (!isGameOver) return;
    isGameOver = false;
    snake = [{x: 10, y: 10}];
    direction = 'right';
    score = 0;
    speed = 200;

    scoreDisplay.textContent = `Счет: 0`;
    statusDisplay.textContent = 'В игре...';
    startBtn.style.display = 'none';
    
    generateFood();
    draw();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(move, speed);
}

startBtn.addEventListener('click', startGame);

createGrid();