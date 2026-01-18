// ==UserScript==
// @name              elGoogle beta
// @name:ru-RU        elГугал beta
// @namespace         https://github.com/ellatuk/elGoogle
// @version           1.2.1
// @description       
// @author            ellatuk
// @icon              https://raw.githubusercontent.com/ellatuk/elGoogle/refs/heads/main/xlam/elGoogleLogo.ico
// @match             https://www.google.com/*
// @match             https://www.google.ru/*
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM.registerMenuCommand
// @grant             GM_info
// @license           MIT
// ==/UserScript==

(function() {
    'use strict';

    // Получаем версию из метаданных скрипта
    const SCRIPT_VERSION = GM_info?.script?.version || '1.2.1';

    // Конфигурация по умолчанию
    const DEFAULT_CONFIG = {
        darkMode: true,
        panelTop: '20px',
        panelLeft: '20px',
        panelVisible: false,
        removeAI: true,
        removeIcons: true,
        customLogo: true,
        styledSearch: true,
        removeImages: false,
        removeMail: false
    };

    // Переменные состояния
    let CONFIG = { ...DEFAULT_CONFIG };
    let panel = null;
    let darkThemeStyle = null;
    let logoStyle = null;
    let searchStyle = null;

    // ================== ИНИЦИАЛИЗАЦИЯ ==================

    async function init() {
        // Загружаем конфиг
        await loadConfig();

        // Применяем настройки
        applyDarkTheme();
        applyLogo();
        applySearchStyles();
        applyPanelStyles();

        // Создаем панель управления
        createControlPanel();

        // Удаляем ненужные элементы
        if (CONFIG.removeAI || CONFIG.removeIcons || CONFIG.removeImages || CONFIG.removeMail) {
            cleanGooglePage();
            setupMutationObserver();
        }

        // Настраиваем горячие клавиши
        setupHotkeys();

        // Добавляем меню управления
        setupUserScriptMenu();

        console.log(`[elGoogle v${SCRIPT_VERSION}] Скрипт инициализирован`);
        detectScriptManager();
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

    // ================== ПРИМЕНЕНИЕ СТИЛЕЙ ==================

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

    function applyLogo() {
        // Удаляем старый стиль логотипа, если есть
        if (logoStyle && logoStyle.parentNode) {
            logoStyle.remove();
        }

        if (CONFIG.customLogo) {
            logoStyle = document.createElement('style');
            logoStyle.id = 'elgoogle-logo-style';
            logoStyle.textContent = `
                .lnXdpd {
                    /* Скрываем оригинальный SVG */
                    display: none !important;
                }

                /* Создаем псевдоэлемент для кастомного логотипа */
                .lnXdpd::before {
                    content: '' !important;
                    display: inline-block !important;
                    width: 272px !important;
                    height: 92px !important;
                    background-image: url('https://raw.githubusercontent.com/ellatuk/elGoogle/refs/heads/main/xlam/elgygal_logo.png') !important;
                    background-size: contain !important;
                    background-repeat: no-repeat !important;
                    background-position: center !important;
                    vertical-align: middle !important;
                }

                /* Альтернативный способ: создаем отдельный элемент после логотипа */
                .elgoogle-custom-logo {
                    display: inline-block !important;
                    width: 272px !important;
                    height: 92px !important;
                    background-image: url('https://raw.githubusercontent.com/ellatuk/elGoogle/refs/heads/main/xlam/elgygal_logo.png') !important;
                    background-size: contain !important;
                    background-repeat: no-repeat !important;
                    background-position: center !important;
                    vertical-align: middle !important;
                }
            `;
            document.head.appendChild(logoStyle);

            // Также добавляем обработку для элемента
            setTimeout(() => {
                const logoElement = document.querySelector('.lnXdpd');
                if (logoElement && !logoElement.parentNode.querySelector('.elgoogle-custom-logo')) {
                    const customLogo = document.createElement('div');
                    customLogo.className = 'elgoogle-custom-logo';
                    customLogo.setAttribute('aria-label', 'Google');
                    customLogo.setAttribute('role', 'img');
                    logoElement.parentNode.insertBefore(customLogo, logoElement);
                }
            }, 100);
        } else {
            // Удаляем кастомный логотип если есть
            const customLogos = document.querySelectorAll('.elgoogle-custom-logo');
            customLogos.forEach(logo => logo.remove());

            // Показываем оригинальный логотип
            const originalStyle = document.createElement('style');
            originalStyle.id = 'elgoogle-original-logo';
            originalStyle.textContent = `
                .lnXdpd {
                    display: inline-block !important;
                }
                .lnXdpd::before {
                    content: none !important;
                }
            `;
            document.head.appendChild(originalStyle);
            setTimeout(() => {
                if (originalStyle.parentNode) originalStyle.remove();
            }, 1000);
        }
    }

    function applySearchStyles() {
        // Удаляем старый стиль поиска, если есть
        if (searchStyle && searchStyle.parentNode) {
            searchStyle.remove();
        }

        if (CONFIG.styledSearch) {
            searchStyle = document.createElement('style');
            searchStyle.id = 'elgoogle-search-style';
            searchStyle.textContent = `
                .RNNXgb {
                    border-radius: 34px 14px !important;
                    background-color: #121212 !important;
                    border: 3px solid #1c1d1d !important;
                }
                .Umvnrc {
                    display: none !important;
                }
                .Ne6nSd {
                    display: flex !important;
                    align-items: center !important;
                    padding: 1px !important;
                    color: #121212 !important;
                }
            `;
            document.head.appendChild(searchStyle);
        } else {
            // Восстанавливаем стандартные стили
            const resetStyle = document.createElement('style');
            resetStyle.id = 'elgoogle-reset-search';
            resetStyle.textContent = `
                .RNNXgb {
                    border-radius: 24px !important;
                    background-color: transparent !important;
                    border: 1px solid #5f6368 !important;
                }
            `;
            document.head.appendChild(resetStyle);
            setTimeout(() => {
                if (resetStyle.parentNode) resetStyle.remove();
            }, 1000);
        }
    }

    function applyPanelStyles() {
        // Стили панели управления (всегда применяются)
        const style = document.createElement('style');
        style.id = 'elgoogle-panel-styles';
        style.textContent = `
            /* Панель управления */
            .elgoogle-panel {
                position: fixed;
                z-index: 999999;
                background: rgba(25, 25, 25, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 0;
                min-width: 320px;
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
                display: flex;
                align-items: center;
                gap: 8px;
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
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .control-description {
                font-size: 12px;
                color: #888;
                margin-top: 4px;
                margin-left: 24px;
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

            .manager-indicator {
                background: rgba(26, 115, 232, 0.2);
                border: 1px solid rgba(26, 115, 232, 0.3);
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 10px;
                font-family: monospace;
                margin-left: 8px;
            }

            /* Стили для иконок Lucide */
            .lucide-inline {
                display: inline-block;
                vertical-align: middle;
                margin-right: 8px;
                color: #aaa;
                flex-shrink: 0;
            }

            .lucide-icon-header {
                margin-right: 10px;
                color: #1a73e8;
            }

            .panel-control:hover .lucide-inline {
                color: #fff;
            }

            .panel-section-title .lucide-inline {
                color: #1a73e8;
            }

            .panel-title .lucide-icon-header {
                color: #1a73e8;
            }

            /* Информационные блоки */
            .panel-info {
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                padding: 12px 0;
            }

            .panel-info:last-child {
                border-bottom: none;
            }

            .panel-info-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .info-label {
                font-weight: 500;
                color: #fff;
            }

            /* Блок быстрых действий */
            .panel-actions {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-top: 10px;
            }

            .action-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 10px 8px;
                font-size: 13px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                color: #fff;
                cursor: pointer;
                transition: all 0.2s;
            }

            .action-btn:hover {
                background: rgba(255, 255, 255, 0.12);
                transform: translateY(-1px);
            }

            .action-btn svg {
                flex-shrink: 0;
            }

            /* Ссылки в информационном блоке */
            .panel-info a {
                color: #8ab4f8;
                text-decoration: none;
            }

            .panel-info a:hover {
                text-decoration: underline;
            }

            /* Стили для иконок Lucide */
            .lucide {
                vertical-align: middle;
            }
        `;

        // Удаляем старый стиль, если есть
        const oldStyle = document.getElementById('elgoogle-panel-styles');
        if (oldStyle) oldStyle.remove();

        document.head.appendChild(style);
    }

    function createControlPanel() {
        // Удаляем старую панель, если есть
        if (panel) panel.remove();

        const scriptManager = detectScriptManager();

        panel = document.createElement('div');
        panel.className = `elgoogle-panel ${CONFIG.panelVisible ? '' : 'hidden'}`;
        panel.style.top = CONFIG.panelTop || '20px';
        panel.style.left = CONFIG.panelLeft || '20px';

        panel.innerHTML = `
            <div class="panel-header" id="elgoogle-drag-handle">
                <div class="panel-title">
                    <span class="drag-handle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu">
                            <line x1="4" x2="20" y1="12" y2="12"/>
                            <line x1="4" x2="20" y1="6" y2="6"/>
                            <line x1="4" x2="20" y1="18" y2="18"/>
                        </svg>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon-header lucide-settings-2">
                        <path d="M14 17H5"/>
                        <path d="M19 7h-9"/>
                        <circle cx="17" cy="17" r="3"/>
                        <circle cx="7" cy="7" r="3"/>
                    </svg>
                    elGoogle v${SCRIPT_VERSION}
                    <span class="manager-indicator" title="Менеджер скриптов">${scriptManager.short}</span>
                </div>
                <button class="panel-close" title="Закрыть (Esc)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </button>
            </div>

            <div class="panel-content">
                <div class="panel-section">
                    <div class="panel-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette">
                            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
                        </svg>
                        Внешний вид
                    </div>

                    <div class="panel-control">
                        <div>
                            <div class="control-label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon">
                                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                                </svg>
                                Тёмная тема
                            </div>
                            <div class="control-description">Включить тёмную тему оформления</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="darkToggle" ${CONFIG.darkMode ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="panel-control">
                        <div>
                            <div class="control-label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image">
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                    <circle cx="9" cy="9" r="2"/>
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                </svg>
                                Кастомный логотип
                            </div>
                            <div class="control-description">Заменить логотип Google</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="logoToggle" ${CONFIG.customLogo ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="panel-section">
                    <div class="panel-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                        </svg>
                        Очистка интерфейса
                    </div>

                    <div class="panel-control">
                        <div>
                            <div class="control-label ${!CONFIG.removeAI ? 'hidden-element' : ''}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-x">
                                    <path d="m13.5 8.5-5 5"/>
                                    <path d="m8.5 8.5 5 5"/>
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="m21 21-4.3-4.3"/>
                                </svg>
                                Удалить "Режим ИИ"
                            </div>
                            <div class="control-description">Скрыть кнопку AI-поиска</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="aiToggle" ${CONFIG.removeAI ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="panel-control">
                        <div>
                            <div class="control-label ${!CONFIG.removeIcons ? 'hidden-element' : ''}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic-off">
                                    <line x1="2" x2="22" y1="2" y2="22"/>
                                    <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/>
                                    <path d="M5 10v2a7 7 0 0 0 12 5"/>
                                    <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/>
                                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12"/>
                                    <line x1="12" x2="12" y1="19" y2="22"/>
                                </svg>
                                Удалить иконки поиска
                            </div>
                            <div class="control-description">Скрыть голосовой поиск и камеру</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="iconsToggle" ${CONFIG.removeIcons ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="panel-control">
                        <div>
                            <div class="control-label ${!CONFIG.removeImages ? 'hidden-element' : ''}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image">
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                    <circle cx="9" cy="9" r="2"/>
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                </svg>
                                Удалить "Картинки"
                            </div>
                            <div class="control-description">Скрыть ссылку на поиск по картинкам</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="imagesToggle" ${CONFIG.removeImages ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="panel-control">
                        <div>
                            <div class="control-label ${!CONFIG.removeMail ? 'hidden-element' : ''}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail">
                                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
                                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                                </svg>
                                Удалить "Почта"
                            </div>
                            <div class="control-description">Скрыть ссылку на Gmail</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="mailToggle" ${CONFIG.removeMail ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="panel-section">
                    <div class="panel-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
                            <path d="m21 21-4.34-4.34"/>
                            <circle cx="11" cy="11" r="8"/>
                        </svg>
                        Настройки поиска
                    </div>

                    <div class="panel-control">
                        <div>
                            <div class="control-label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen">
                                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.506l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.853z"/>
                                </svg>
                                Стиль строки поиска
                            </div>
                            <div class="control-description">Скруглённые углы и тёмный фон</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="searchToggle" ${CONFIG.styledSearch ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="panel-section">
                    <div class="panel-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4"/>
                            <path d="M12 8h.01"/>
                        </svg>
                        О скрипте
                    </div>

                    <div class="panel-control panel-info">
                        <div class="panel-info-content">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            <div>
                                <div class="info-label">Автор</div>
                                <div class="control-description">ellatuk</div>
                            </div>
                        </div>
                    </div>

                    <div class="panel-control panel-info">
                        <div class="panel-info-content">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag">
                                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
                                <path d="M7 7h.01"/>
                            </svg>
                            <div>
                                <div class="info-label">Версия</div>
                                <div class="control-description">v${SCRIPT_VERSION}</div>
                            </div>
                        </div>
                    </div>

                    <div class="panel-control panel-info">
                        <div class="panel-info-content">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                            </svg>
                            <div>
                                <div class="info-label">Иконки</div>
                                <div class="control-description">
                                    <a href="https://lucide.dev/" target="_blank" style="color: #8ab4f8;">Lucide</a> (Open Source)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="panel-section">
                    <div class="panel-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap">
                            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
                        </svg>
                        Быстрые действия
                    </div>

                    <div class="panel-actions">
                        <button class="panel-btn action-btn" id="githubBtn" title="GitHub репозиторий">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                                <path d="M9 18c-4.51 2-5-2-7-2"/>
                            </svg>
                            GitHub
                        </button>

                        <button class="panel-btn action-btn" id="exportBtn" title="Экспорт настроек">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" x2="12" y1="15" y2="3"/>
                            </svg>
                            Экспорт
                        </button>

                        <button class="panel-btn action-btn" id="resetBtn" title="Сбросить настройки">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-ccw">
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                <path d="M3 3v5h5"/>
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                                <path d="M16 16h5v5"/>
                            </svg>
                            Сброс
                        </button>
                    </div>
                </div>
            </div>

            <div class="status-bar">
                <div>Нажмите F2 чтобы показать/скрыть панель</div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                        <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span class="hotkey-hint">Esc</span>
                </div>
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

        // Переключатель темной темы
        panel.querySelector('#darkToggle').addEventListener('change', function(e) {
            CONFIG.darkMode = e.target.checked;
            applyDarkTheme();
            saveConfig();
        });

        // Переключатель логотипа
        panel.querySelector('#logoToggle').addEventListener('change', function(e) {
            CONFIG.customLogo = e.target.checked;
            applyLogo();
            saveConfig();
        });

        // Переключатель AI
        panel.querySelector('#aiToggle').addEventListener('change', function(e) {
            CONFIG.removeAI = e.target.checked;
            if (CONFIG.removeAI) {
                cleanGooglePage();
            }
            saveConfig();
            updatePanelLabels();
        });

        // Переключатель иконок
        panel.querySelector('#iconsToggle').addEventListener('change', function(e) {
            CONFIG.removeIcons = e.target.checked;
            if (CONFIG.removeIcons) {
                cleanGooglePage();
            }
            saveConfig();
            updatePanelLabels();
        });

        // Переключатель стиля поиска
        panel.querySelector('#searchToggle').addEventListener('change', function(e) {
            CONFIG.styledSearch = e.target.checked;
            applySearchStyles();
            saveConfig();
        });

        // Переключатель "Картинки"
        panel.querySelector('#imagesToggle').addEventListener('change', function(e) {
            CONFIG.removeImages = e.target.checked;
            if (CONFIG.removeImages) {
                cleanGooglePage();
            }
            saveConfig();
            updatePanelLabels();
        });

        // Переключатель "Почта"
        panel.querySelector('#mailToggle').addEventListener('change', function(e) {
            CONFIG.removeMail = e.target.checked;
            if (CONFIG.removeMail) {
                cleanGooglePage();
            }
            saveConfig();
            updatePanelLabels();
        });

        // Кнопка GitHub
        panel.querySelector('#githubBtn').addEventListener('click', function() {
            window.open('https://github.com/ellatuk/elGoogle', '_blank');
        });

        // Кнопка экспорта
        panel.querySelector('#exportBtn').addEventListener('click', exportSettings);

        // Кнопка сброса
        panel.querySelector('#resetBtn').addEventListener('click', resetSettings);

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
        const imagesLabel = panel.querySelector('#imagesToggle').closest('.panel-control').querySelector('.control-label');
        const mailLabel = panel.querySelector('#mailToggle').closest('.panel-control').querySelector('.control-label');

        aiLabel.classList.toggle('hidden-element', !CONFIG.removeAI);
        iconsLabel.classList.toggle('hidden-element', !CONFIG.removeIcons);
        imagesLabel.classList.toggle('hidden-element', !CONFIG.removeImages);
        mailLabel.classList.toggle('hidden-element', !CONFIG.removeMail);
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
        // 1. Удаляем кнопку "Режим ИИ"
        if (CONFIG.removeAI) {
            const aiButton = document.querySelector('button[jsname="B6rgad"]');
            if (aiButton) {
                aiButton.remove();
                console.log('[elGoogle] Кнопка "Режим ИИ" удалена.');
            }
        }

        // 2. Удаляем контейнеры с иконками
        if (CONFIG.removeIcons) {
            const iconContainers = document.querySelectorAll('div[jsname="UdfVXc"].WC2Die');
            if (iconContainers.length > 0) {
                iconContainers.forEach(container => container.remove());
                console.log(`[elGoogle] Удалено контейнеров: ${iconContainers.length}`);
            }
        }

        // 3. Удаляем кнопку "Картинки" (поиск по картинкам)
        if (CONFIG.removeImages) {
            // Ищем ссылку с атрибутом data-pid="2" (обычно это картинки)
            const imagesLink = document.querySelector('a.gb_Z[data-pid="2"], a[aria-label*="картинк" i], a[href*="imghp"]');
            if (imagesLink) {
                // Находим родительский элемент div и удаляем его
                const parentDiv = imagesLink.closest('div.gb_0');
                if (parentDiv) {
                    parentDiv.remove();
                    console.log('[elGoogle] Кнопка "Картинки" удалена.');
                } else {
                    imagesLink.remove();
                    console.log('[elGoogle] Ссылка "Картинки" удалена.');
                }
            }

            // Дополнительный поиск по тексту для надёжности
            const imagesLinksByText = document.querySelectorAll('a.gb_Z');
            imagesLinksByText.forEach(link => {
                if (link.textContent.includes('Картинки') || link.textContent.includes('Images')) {
                    const parent = link.closest('div.gb_0');
                    if (parent) {
                        parent.remove();
                        console.log('[elGoogle] Кнопка "Картинки" удалена (по тексту).');
                    }
                }
            });
        }

        // 4. Удаляем кнопку "Почта" (Gmail)
        if (CONFIG.removeMail) {
            // Ищем ссылку с атрибутом data-pid="23" (обычно это почта)
            const mailLink = document.querySelector('a.gb_Z[data-pid="23"], a[aria-label*="почт" i], a[href*="mail.google.com"]');
            if (mailLink) {
                // Находим родительский элемент div и удаляем его
                const parentDiv = mailLink.closest('div.gb_0');
                if (parentDiv) {
                    parentDiv.remove();
                    console.log('[elGoogle] Кнопка "Почта" удалена.');
                } else {
                    mailLink.remove();
                    console.log('[elGoogle] Ссылка "Почта" удалена.');
                }
            }

            // Дополнительный поиск по тексту для надёжности
            const mailLinksByText = document.querySelectorAll('a.gb_Z');
            mailLinksByText.forEach(link => {
                if (link.textContent.includes('Почта') || link.textContent.includes('Gmail') || link.textContent.includes('Mail')) {
                    const parent = link.closest('div.gb_0');
                    if (parent) {
                        parent.remove();
                        console.log('[elGoogle] Кнопка "Почта" удалена (по тексту).');
                    }
                }
            });
        }
    }

    function setupMutationObserver() {
        let timeoutId;
        const observer = new MutationObserver(() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                cleanGooglePage();
                // Также проверяем логотип
                if (CONFIG.customLogo) {
                    applyLogo();
                }
            }, 100);
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
            if (e.key === 'F2' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                togglePanel();
            }

            // Ctrl+Alt+G для открытия GitHub
            if (e.ctrlKey && e.altKey && e.key === 'g') {
                e.preventDefault();
                window.open('https://github.com/ellatuk/elGoogle', '_blank');
            }

            // Ctrl+Alt+R для принудительного обновления
            if (e.ctrlKey && e.altKey && e.key === 'r') {
                e.preventDefault();
                location.reload();
            }
        });
    }

    // ================== МЕНЕДЖЕР СКРИПТОВ ==================

    function detectScriptManager() {
        const managerInfo = {
            name: 'Неизвестно',
            short: '???',
            version: '?',
            hasMenu: false
        };

        try {
            if (typeof GM_info !== 'undefined') {
                const info = GM_info;
                managerInfo.version = info.version || '?';

                if (info.scriptHandler) {
                    managerInfo.name = info.scriptHandler;
                    managerInfo.short = info.scriptHandler.substring(0, 3).toUpperCase();
                } else if (typeof GM !== 'undefined') {
                    managerInfo.name = 'Greasemonkey';
                    managerInfo.short = 'GM';
                }

                // Проверяем возможности
                managerInfo.hasMenu = typeof GM_registerMenuCommand !== 'undefined';
            }
        } catch (e) {
            console.log('[elGoogle] Не удалось определить менеджер скриптов');
        }

        console.log(`[elGoogle] Менеджер: ${managerInfo.name} v${managerInfo.version}`);
        return managerInfo;
    }

    // ================== МЕНЮ УПРАВЛЕНИЯ ==================

    function setupUserScriptMenu() {
        // Проверяем, доступна ли функция
        if (typeof GM_registerMenuCommand === 'undefined') {
            console.log('[elGoogle] GM_registerMenuCommand не поддерживается');
            return;
        }

        try {
            // Основные команды
            GM_registerMenuCommand('🎨 Открыть панель elGoogle', function() {
                console.log('[elGoogle] Меню: открыть панель');
                togglePanel();
            }, 'f2');

            GM_registerMenuCommand('🔄 Обновить страницу', function() {
                console.log('[elGoogle] Меню: обновить страницу');
                location.reload();
            });

            // Настройки
            GM_registerMenuCommand('⚙️  Быстрые настройки', function() {
                console.log('[elGoogle] Меню: быстрые настройки');
                quickSettings();
            });

            GM_registerMenuCommand('📋 Экспорт настроек', function() {
                console.log('[elGoogle] Меню: экспорт настроек');
                exportSettings();
            });

            GM_registerMenuCommand('🗑️  Сбросить все настройки', function() {
                console.log('[elGoogle] Меню: сброс настроек');
                resetSettings();
            });

            // Информация
            GM_registerMenuCommand('📊 Информация о скрипте', function() {
                console.log('[elGoogle] Меню: информация о скрипте');
                showScriptInfo();
            });

            // Ссылки
            GM_registerMenuCommand('🌐 GitHub репозиторий', function() {
                console.log('[elGoogle] Меню: открыть GitHub');
                window.open('https://github.com/ellatuk/elGoogle', '_blank');
            });

            GM_registerMenuCommand('📖 Настройки Google', function() {
                console.log('[elGoogle] Меню: настройки Google');
                window.open('https://www.google.com/preferences', '_blank');
            });

            console.log('[elGoogle] Меню управления добавлено');

        } catch(error) {
            console.warn('[elGoogle] Ошибка создания меню:', error);
        }
    }

    function showScriptManagerMenu() {
        alert(`Чтобы открыть меню управления elGoogle:

1. Нажмите на иконку менеджера скриптов (Tampermonkey/Violentmonkey)
2. Найдите "elGoogle" в списке скриптов
3. Нажмите на него для открытия меню

Или используйте горячие клавиши:
• F2 - открыть/скрыть панель
• Ctrl+Alt+G - открыть GitHub
• Ctrl+Alt+R - обновить страницу`);
    }

    // ================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==================

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
        if (confirm('Сбросить все настройки elGoogle к значениям по умолчанию?')) {
            CONFIG = { ...DEFAULT_CONFIG };
            await saveConfig();
            location.reload();
        }
    }

    function exportSettings() {
        const settingsStr = JSON.stringify(CONFIG, null, 2);
        navigator.clipboard.writeText(settingsStr)
            .then(() => alert('✅ Настройки скопированы в буфер обмена!\n\nВы можете вставить их в любой текстовый редактор.'))
            .catch(() => {
                const textarea = document.createElement('textarea');
                textarea.value = settingsStr;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('✅ Настройки скопированы в буфер обмена!');
            });
    }

    function quickSettings() {
        // Быстрое переключение популярных настроек
        const oldDarkMode = CONFIG.darkMode;
        const oldRemoveAI = CONFIG.removeAI;

        CONFIG.darkMode = !CONFIG.darkMode;
        CONFIG.removeAI = !CONFIG.removeAI;

        applyDarkTheme();
        if (CONFIG.removeAI !== oldRemoveAI) {
            cleanGooglePage();
        }

        saveConfig();

        alert(`Быстрые настройки применены:
• Тёмная тема: ${CONFIG.darkMode ? 'ВКЛ' : 'ВЫКЛ'}
• Удалить AI: ${CONFIG.removeAI ? 'ВКЛ' : 'ВЫКЛ'}

Страница будет обновлена через 3 секунды.`);

        setTimeout(() => location.reload(), 3000);
    }

    function showScriptInfo() {
        const manager = detectScriptManager();
        const activeSettings = Object.entries(CONFIG)
            .filter(([key, value]) => value !== DEFAULT_CONFIG[key])
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

        const info = `
elGoogle v${SCRIPT_VERSION}

Менеджер скриптов: ${manager.name} v${manager.version}
Автор: ellatuk
GitHub: https://github.com/ellatuk/elGoogle

Изменённые настройки:
${activeSettings || 'Все настройки по умолчанию'}

Горячие клавиши:
• F2 - панель управления
• Esc - закрыть панель
• Ctrl+Alt+G - GitHub
• Ctrl+Alt+R - обновить`;

        alert(info);
    }

    // ================== ЗАПУСК ==================

    // Ждём полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();