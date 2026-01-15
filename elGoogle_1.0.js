// ==UserScript==
// @name              elGoogle
// @name:ru-RU        эльГугал
// @namespace         https://github.com/ellatuk/elGoogle
// @icon              https://raw.githubusercontent.com/ellatuk/elGoogle/refs/heads/main/xlam/elGoogleLogo.ico
// @version           1.1
// @description       Better "Гугл поиск"
// @author            ellatuk
// @match             https://www.google.com/*
// @match             https://www.google.ru/*
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM.registerMenuCommand
// @license           MIT
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация по умолчанию
    const DEFAULT_CONFIG = {
        darkMode: true,
        panelTop: '20px',
        panelLeft: '20px',
        panelVisible: false,
        removeAI: true,
        removeIcons: true
    };

    // Переменные состояния
    let CONFIG = { ...DEFAULT_CONFIG };
    let panel = null;
    let darkThemeStyle = null;

    // ================== ИНИЦИАЛИЗАЦИЯ ==================

    async function init() {
        // Загружаем конфиг
        await loadConfig();

        // Применяем настройки
        applyDarkTheme();
        applyStyles();

        // Создаем панель управления
        createControlPanel();

        // Удаляем ненужные элементы
        if (CONFIG.removeAI || CONFIG.removeIcons) {
            cleanGooglePage();
            setupMutationObserver();
        }

        // Настраиваем горячие клавиши
        setupHotkeys();

        console.log('[elGoogle] Скрипт инициализирован');
    }

    // ================== КОНФИГУРАЦИЯ ==================

    async function loadConfig() {
        try {
            const saved = await GM.getValue('elGoogle_config');
            CONFIG = { ...DEFAULT_CONFIG, ...saved };
        } catch (e) {
            console.warn('[elGoogle] Ошибка загрузки настроек:', e);
            CONFIG = { ...DEFAULT_CONFIG };
        }
    }

    async function saveConfig() {
        try {
            await GM.setValue('elGoogle_config', CONFIG);
        } catch (e) {
            console.warn('[elGoogle] Ошибка сохранения настроек:', e);
        }
    }

    // ================== СТИЛИ И ТЕМА ==================

    function applyDarkTheme() {
        // Удаляем старый стиль, если есть
        if (darkThemeStyle && darkThemeStyle.parentNode) {
            darkThemeStyle.remove();
        }

        if (CONFIG.darkMode) {
            darkThemeStyle = document.createElement('style');
            darkThemeStyle.id = 'elgoogle-dark-theme';
            darkThemeStyle.textContent = `
                body {
                    background-color: #161616 !important;
                }
                #gb {
                    background-color: #161616 !important;
                }
            `;
            document.head.appendChild(darkThemeStyle);
        }
    }

    function applyStyles() {
        // Основные стили (всегда применяются)
        const style = document.createElement('style');
        style.id = 'elgoogle-styles';
        style.textContent = `
            /* Логотип */
            .lnXdpd {
                content: url('https://i7.imageban.ru/out/2024/07/20/eac25e8f5b8d656a7336d1fb7767b21c.png') !important;
                width: auto !important;
                height: auto !important;
            }

            /* Поисковая строка */
            .RNNXgb {
                border-radius: 34px 14px !important;
                background-color: #121212 !important;
                border: 3px solid #1c1d1d !important;
            }

            /* Панель управления */
            .elgoogle-panel {
                position: fixed;
                z-index: 999999;
                background: rgba(25, 25, 25, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 0;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                color: #fff;
                font-family: 'Segoe UI', system-ui, sans-serif;
                user-select: none;
                overflow: hidden;
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            .elgoogle-panel.hidden {
                opacity: 0;
                transform: translateY(-10px);
                pointer-events: none;
            }

            .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                background: rgba(40, 40, 40, 0.8);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                cursor: move;
                user-select: none;
            }

            .panel-title {
                font-size: 16px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .panel-close {
                background: none;
                border: none;
                color: #aaa;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
            }

            .panel-close:hover {
                background-color: rgba(255, 255, 255, 0.1);
                color: #fff;
            }

            .panel-content {
                padding: 20px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .panel-section {
                margin-bottom: 20px;
            }

            .panel-section-title {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 12px;
                color: #aaa;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .panel-control {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            .panel-control:last-child {
                border-bottom: none;
            }

            .control-label {
                font-size: 14px;
                color: #fff;
            }

            .control-description {
                font-size: 12px;
                color: #888;
                margin-top: 4px;
            }

            /* Переключатель */
            .switch {
                position: relative;
                display: inline-block;
                width: 52px;
                height: 26px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #555;
                transition: .4s;
                border-radius: 34px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .slider {
                background-color: #1a73e8;
            }

            input:checked + .slider:before {
                transform: translateX(26px);
            }

            /* Статус бар */
            .status-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 20px;
                background: rgba(30, 30, 30, 0.8);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 12px;
                color: #888;
            }

            .hotkey-hint {
                background: rgba(255, 255, 255, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
                font-family: monospace;
            }

            /* Дополнительные элементы */
            .hidden-element {
                opacity: 0.5;
                text-decoration: line-through;
            }

            .drag-handle {
                margin-right: 10px;
                opacity: 0.5;
                cursor: move;
            }
        `;

        // Удаляем старый стиль, если есть
        const oldStyle = document.getElementById('elgoogle-styles');
        if (oldStyle) oldStyle.remove();

        document.head.appendChild(style);
    }

    // ================== ПАНЕЛЬ УПРАВЛЕНИЯ ==================

    function createControlPanel() {
        // Удаляем старую панель, если есть
        if (panel) panel.remove();

        panel = document.createElement('div');
        panel.className = `elgoogle-panel ${CONFIG.panelVisible ? '' : 'hidden'}`;
        panel.style.top = CONFIG.panelTop || '20px';
        panel.style.left = CONFIG.panelLeft || '20px';

        panel.innerHTML = `
            <div class="panel-header" id="elgoogle-drag-handle">
                <div class="panel-title">
                    <span class="drag-handle">☰</span>
                    🎨 elGoogle
                </div>
                <button class="panel-close" title="Закрыть (Esc)">×</button>
            </div>

            <div class="panel-content">
                <div class="panel-section">
                    <div class="panel-section-title">Внешний вид</div>

                    <div class="panel-control">
                        <div>
                            <div class="control-label">Тёмная тема</div>
                            <div class="control-description">Включить тёмную тему оформления</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="darkToggle" ${CONFIG.darkMode ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="panel-control">
                        <div>
                            <div class="control-label">Кастомный логотип</div>
                            <div class="control-description">Заменить логотип Google</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="logoToggle" checked disabled>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="panel-section">
                    <div class="panel-section-title">Очистка интерфейса</div>

                    <div class="panel-control">
                        <div>
                            <div class="control-label ${!CONFIG.removeAI ? 'hidden-element' : ''}">Удалить "Режим ИИ"</div>
                            <div class="control-description">Скрыть кнопку AI-поиска</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="aiToggle" ${CONFIG.removeAI ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="panel-control">
                        <div>
                            <div class="control-label ${!CONFIG.removeIcons ? 'hidden-element' : ''}">Удалить иконки поиска</div>
                            <div class="control-description">Скрыть голосовой поиск и камеру</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="iconsToggle" ${CONFIG.removeIcons ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="panel-section">
                    <div class="panel-section-title">Настройки поиска</div>

                    <div class="panel-control">
                        <div>
                            <div class="control-label">Стиль строки поиска</div>
                            <div class="control-description">Скруглённые углы и тёмный фон</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="searchToggle" checked disabled>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="status-bar">
                <div>v1.2 • F2 для показа/скрытия</div>
                <div class="hotkey-hint">Esc</div>
            </div>
        `;

        document.body.appendChild(panel);

        // Настраиваем обработчики событий
        setupPanelEvents();

        // Делаем панель перетаскиваемой
        makePanelDraggable();
    }

    function setupPanelEvents() {
        // Кнопка закрытия
        panel.querySelector('.panel-close').addEventListener('click', togglePanel);

        // Переключатели
        panel.querySelector('#darkToggle').addEventListener('change', function(e) {
            CONFIG.darkMode = e.target.checked;
            applyDarkTheme();
            saveConfig();
        });

        panel.querySelector('#aiToggle').addEventListener('change', function(e) {
            CONFIG.removeAI = e.target.checked;
            if (CONFIG.removeAI) {
                cleanGooglePage();
            }
            saveConfig();
            updatePanelLabels();
        });

        panel.querySelector('#iconsToggle').addEventListener('change', function(e) {
            CONFIG.removeIcons = e.target.checked;
            if (CONFIG.removeIcons) {
                cleanGooglePage();
            }
            saveConfig();
            updatePanelLabels();
        });

        // Закрытие по Esc
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !panel.classList.contains('hidden')) {
                togglePanel();
            }
        });
    }

    function updatePanelLabels() {
        const aiLabel = panel.querySelector('#aiToggle').closest('.panel-control').querySelector('.control-label');
        const iconsLabel = panel.querySelector('#iconsToggle').closest('.panel-control').querySelector('.control-label');

        aiLabel.classList.toggle('hidden-element', !CONFIG.removeAI);
        iconsLabel.classList.toggle('hidden-element', !CONFIG.removeIcons);
    }

    // ================== ПЕРЕТАСКИВАНИЕ ==================

    function makePanelDraggable() {
        const dragHandle = panel.querySelector('#elgoogle-drag-handle');
        let isDragging = false;
        let offsetX, offsetY;

        dragHandle.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            if (e.target.classList.contains('panel-close')) return;

            isDragging = true;
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);

            panel.style.transition = 'none';
            e.preventDefault();
        }

        function onDrag(e) {
            if (!isDragging) return;

            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            // Ограничиваем перемещение в пределах окна
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;

            panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
        }

        function stopDrag() {
            if (!isDragging) return;

            isDragging = false;
            panel.style.transition = '';

            // Сохраняем позицию
            CONFIG.panelTop = panel.style.top;
            CONFIG.panelLeft = panel.style.left;
            saveConfig();

            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }

    // ================== УПРАВЛЕНИЕ ЭЛЕМЕНТАМИ ==================

    function cleanGooglePage() {
        if (CONFIG.removeAI) {
            const aiButton = document.querySelector('button[jsname="B6rgad"]');
            if (aiButton) {
                aiButton.remove();
                console.log('[elGoogle] Кнопка "Режим ИИ" удалена.');
            }
        }

        if (CONFIG.removeIcons) {
            const iconContainers = document.querySelectorAll('div[jsname="UdfVXc"].WC2Die');
            if (iconContainers.length > 0) {
                iconContainers.forEach(container => container.remove());
                console.log(`[elGoogle] Удалено контейнеров: ${iconContainers.length}`);
            }
        }
    }

    function setupMutationObserver() {
        let timeoutId;
        const observer = new MutationObserver(() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(cleanGooglePage, 100);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(cleanGooglePage, 2000);
    }

    // ================== ГОРЯЧИЕ КЛАВИШИ ==================

    function setupHotkeys() {
        document.addEventListener('keydown', function(e) {
            // F2 для показа/скрытия панели
            if (e.key === 'F2') {
                e.preventDefault();
                togglePanel();
            }

            // Ctrl+Alt+G для принудительного обновления
            if (e.ctrlKey && e.altKey && e.key === 'g') {
                e.preventDefault();
                location.reload();
            }
        });

        // Добавляем меню в Tampermonkey
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('Открыть панель elGoogle', togglePanel, 'F2');
            GM_registerMenuCommand('Сбросить настройки', resetSettings);
        }
    }

    function togglePanel() {
        if (!panel) return;

        const isHidden = panel.classList.contains('hidden');

        if (isHidden) {
            panel.classList.remove('hidden');
            CONFIG.panelVisible = true;
            // Фокус на первый переключатель
            panel.querySelector('input[type="checkbox"]')?.focus();
        } else {
            panel.classList.add('hidden');
            CONFIG.panelVisible = false;
        }

        saveConfig();
    }

    async function resetSettings() {
        if (confirm('Сбросить все настройки elGoogle?')) {
            CONFIG = { ...DEFAULT_CONFIG };
            await saveConfig();
            location.reload();
        }
    }

    // ================== ЗАПУСК ==================

    // Ждём полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();