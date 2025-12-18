const passwordDisplay = document.getElementById('passwordDisplay');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const messageElement = document.getElementById('message');

// Обновление значения длины пароля при движении ползунка
lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
});

// Основная функция генерации пароля
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    
    // Проверка, что хотя бы один тип символов выбран
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        passwordDisplay.value = 'Выберите хотя бы 1 опцию!';
        return;
    }

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+=-{}[]|:;"<>,.?/~`';

    let availableChars = '';
    let generatedPassword = '';
    
    // Формируем набор доступных символов
    if (includeUppercase) availableChars += uppercase;
    if (includeLowercase) availableChars += lowercase;
    if (includeNumbers) availableChars += numbers;
    if (includeSymbols) availableChars += symbols;

    // Генерируем пароль
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        generatedPassword += availableChars[randomIndex];
    }
    
    passwordDisplay.value = generatedPassword;
    messageElement.textContent = ''; // Очистка сообщения
}

// Копирование пароля в буфер обмена
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value && passwordDisplay.value !== 'Выберите хотя бы 1 опцию!' && passwordDisplay.value !== 'Сгенерированный пароль') {
        navigator.clipboard.writeText(passwordDisplay.value).then(() => {
            messageElement.textContent = 'Пароль скопирован!';
            setTimeout(() => {
                messageElement.textContent = '';
            }, 2000);
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            messageElement.textContent = 'Ошибка копирования!';
        });
    }
});

generateBtn.addEventListener('click', generatePassword);

// Генерируем пароль при первой загрузке
generatePassword();