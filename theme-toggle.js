document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('themeToggle');
    const body = document.body;

    // 1. При загрузке страницы проверяем, какая тема сохранена
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme && currentTheme !== 'light-mode') {
        body.classList.add(currentTheme);
        toggleButton.textContent = '☀️'; // Солнце, если текущая тема темная
    } else {
        toggleButton.textContent = '🌙'; // Луна, если текущая тема светлая
    }

    // 2. Обработчик клика по кнопке
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark-mode');
            toggleButton.textContent = '☀️'; 
        } else {
            localStorage.setItem('theme', 'light-mode');
            toggleButton.textContent = '🌙';
        }
    });
});