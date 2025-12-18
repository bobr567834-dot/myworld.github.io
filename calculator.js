const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let previousInput = '';
let operation = null;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.innerText;

        // Если нажата цифра или точка
        if (button.classList.contains('number')) {
            appendNumber(value);
        }

        // Если нажат оператор
        if (button.classList.contains('operator')) {
            const action = button.dataset.action;
            handleOperator(action, value);
        }

        // Сброс
        if (button.classList.contains('clear')) {
            clear();
        }

        // Равно
        if (button.id === 'equals') {
            calculate();
        }

        updateDisplay();
    });
});

function appendNumber(number) {
    if (number === '.' && currentInput.includes('.')) return;
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
}

function handleOperator(action, symbol) {
    if (action === 'delete') {
        currentInput = currentInput.slice(0, -1) || '0';
        return;
    }
    
    if (previousInput !== '') {
        calculate();
    }
    
    operation = symbol;
    previousInput = currentInput;
    currentInput = '0';
}

function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+': result = prev + current; break;
        case '−': result = prev - current; break;
        case '×': result = prev * current; break;
        case '÷': result = prev / current; break;
        default: return;
    }

    currentInput = result.toString();
    operation = null;
    previousInput = '';
}

function clear() {
    currentInput = '0';
    previousInput = '';
    operation = null;
}

function updateDisplay() {
    display.value = currentInput;
}