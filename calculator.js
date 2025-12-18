const display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let firstOperand = null;
let waitingForSecondOperand = false;

function updateDisplay() {
    display.value = currentInput;
}

function appendToDisplay(digit) {
    if (waitingForSecondOperand) {
        currentInput = digit;
        waitingForSecondOperand = false;
    } else {
        if (digit === '.' && currentInput.includes('.')) return;
        if (currentInput === '0' && digit !== '.') {
            currentInput = digit;
        } else {
            currentInput += digit;
        }
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    operator = null;
    firstOperand = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function performCalculation(op, secondOperand) {
    const result = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
    }[op](firstOperand, secondOperand);
    
    // Округление для избежания ошибок с плавающей точкой
    return parseFloat(result.toFixed(6));
}

function calculateResult() {
    if (operator === null || waitingForSecondOperand) {
        return;
    }

    const secondOperand = parseFloat(currentInput);
    
    if (operator === '/' && secondOperand === 0) {
        currentInput = 'Ошибка: Деление на 0';
        updateDisplay();
        return;
    }

    const result = performCalculation(operator, secondOperand);
    currentInput = String(result);
    firstOperand = result;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

// Обработка операторов
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation(operator, inputValue);
        currentInput = String(result);
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    updateDisplay();
}

// Заменяем стандартные обработчики кнопок
document.querySelectorAll('.buttons button').forEach(button => {
    if (button.classList.contains('operator') && !button.classList.contains('clear')) {
        button.onclick = () => handleOperator(button.textContent.trim().replace('÷', '/').replace('×', '*').replace('−', '-'));
    } else if (!button.classList.contains('operator') && !button.classList.contains('clear') && !button.classList.contains('equals') && !button.classList.contains('zero')) {
        button.onclick = () => appendToDisplay(button.textContent.trim());
    } else if (button.classList.contains('zero')) {
         button.onclick = () => appendToDisplay('0');
    }
});

updateDisplay();