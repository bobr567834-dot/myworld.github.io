const startGameButton = document.getElementById('startGame');
const difficultySelect = document.getElementById('difficulty');
const customRangeInputs = document.getElementById('customRangeInputs');
const minInput = document.getElementById('minInput');
const maxInput = document.getElementById('maxInput');
const gameArea = document.getElementById('gameArea');
const instruction = document.getElementById('instruction');
const guessInput = document.getElementById('guessInput');
const checkGuessButton = document.getElementById('checkGuess');
const messageElement = document.getElementById('message');
const attemptsSpan = document.getElementById('attempts');

let minNumber;
let maxNumber;
let secretNumber;
let attempts = 0;
let isGameOver = false;

startGameButton.addEventListener('click', startGame);
checkGuessButton.addEventListener('click', checkGuess);
guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

difficultySelect.addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
        customRangeInputs.classList.remove('hidden');
    } else {
        customRangeInputs.classList.add('hidden');
    }
    startGameButton.textContent = 'Начать игру';
    gameArea.classList.add('hidden');
    messageElement.textContent = '';
});

function startGame() {
    const difficultyValue = difficultySelect.value;
    
    if (difficultyValue === 'custom') {
        minNumber = parseInt(minInput.value);
        maxNumber = parseInt(maxInput.value);
        
        if (isNaN(minNumber) || isNaN(maxNumber) || minNumber >= maxNumber || minNumber < 1) {
            alert('Пожалуйста, введите корректный диапазон (Минимум < Максимум, и Минимум >= 1).');
            return;
        }
    } else {
        minNumber = 1;
        maxNumber = parseInt(difficultyValue);
    }
    
    secretNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    attempts = 0;
    isGameOver = false;

    gameArea.classList.remove('hidden');
    instruction.textContent = `Я загадал число от ${minNumber} до ${maxNumber}. Попробуй угадать!`;
    messageElement.textContent = '';
    messageElement.className = '';
    attemptsSpan.textContent = attempts;
    
    guessInput.value = '';
    guessInput.min = minNumber;
    guessInput.max = maxNumber;
    guessInput.disabled = false;
    checkGuessButton.disabled = false;
    guessInput.focus();
}

function checkGuess() {
    if (isGameOver) return;

    const guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < minNumber || guess > maxNumber) {
        messageElement.textContent = `Пожалуйста, введите число от ${minNumber} до ${maxNumber}.`;
        messageElement.className = 'lose';
        return;
    }

    attempts++;
    attemptsSpan.textContent = attempts;

    if (guess === secretNumber) {
        messageElement.textContent = `🎉 ПОБЕДА! Ты угадал число ${secretNumber} за ${attempts} попыток!`;
        messageElement.className = 'win';
        endGame();
    } else if (guess < secretNumber) {
        messageElement.textContent = `Слишком мало. Попробуй еще.`;
        messageElement.className = 'lose';
    } else {
        messageElement.textContent = `Слишком много. Попробуй еще.`;
        messageElement.className = 'lose';
    }

    guessInput.value = '';
    guessInput.focus();
}

function endGame() {
    isGameOver = true;
    checkGuessButton.disabled = true;
    guessInput.disabled = true;
    startGameButton.textContent = 'Начать новую игру';
}

startGameButton.textContent = 'Начать игру';