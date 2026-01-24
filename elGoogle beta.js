// ==UserScript==
// @name              elGoogle [beta]
// @name:ru-RU        elГугал [beta]
// @namespace         https://github.com/ellatuk/elGoogle/releases
// @icon              https://raw.githubusercontent.com/ellatuk/elGoogle/refs/heads/main/xlam/elGoogleLogo.ico
// @version           1.2
// @description       Makes the Google Search home page better. Better "Gygale Search"
// @description:ru-RU Делает гугл поиск лучше. Лучший "Гугал поиск"
// @author            ellatuk
// @homepageURL   https://github.com/ellatuk/elGoogle
// @match             https://www.google.com/*
// @match             https://www.google.ru/*
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM.registerMenuCommand
// @grant             GM_info
// @grant             GM.xmlHttpRequest
// @connect           github.com
// @connect           api.github.com
// @license           MIT
// ==/UserScript==

(function() {
    'use strict';

    // ================== КОНСТАНТЫ И КОНФИГУРАЦИЯ ==================

    const SCRIPT_VERSION = GM_info?.script?.version || '1.3.1';
    const NOISE_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E")`;

    const DEFAULT_CONFIG = {
        darkMode: true,
        customLogo: true,
        removeAI: true,
        removeIcons: true,
        removeImages: false,
        removeMail: false,
        preset: 'full',
        searchStyleEnabled: true,
        searchStyle: 'elgoogle-classic',
        menuTheme: 'dark',
        compactMode: false,
        glassEffect: true,
        panelTop: '20px',
        panelLeft: '20px',
        panelVisible: false,
        lastVersionCheck: 0
    };

    const SEARCH_STYLES = {
        'google-default': {
            name: 'Google (родной)',
            css: `.RNNXgb{border-radius:24px!important;background-color:transparent!important;border:1px solid #5f6368!important;box-shadow:none!important;}`
        },
        'elgoogle-classic': {
            name: 'elGoogle Classic',
            css: `.RNNXgb{border-radius:34px 14px!important;background-color:#121212!important;border:3px solid #1c1d1d!important;box-shadow:0 2px 8px rgba(0,0,0,0.3)!important;}`
        },
        'minimal-dark': {
            name: 'Minimal Dark',
            css: `.RNNXgb{border-radius:12px!important;background-color:#0a0a0a!important;border:1px solid #2a2a2a!important;box-shadow:0 1px 3px rgba(0,0,0,0.2)!important;}`
        },
        'glass-frosted': {
            name: 'Glass / Frosted',
            css: `.RNNXgb{border-radius:20px!important;background:linear-gradient(135deg,rgba(25,25,25,0.85)0%,rgba(35,35,35,0.8)100%),${NOISE_TEXTURE}!important;backdrop-filter:blur(12px) saturate(2)!important;-webkit-backdrop-filter:blur(12px) saturate(2)!important;border:1px solid rgba(255,255,255,0.2)!important;box-shadow:0 4px 20px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.15),inset 0 -1px 0 rgba(0,0,0,0.6)!important;}.RNNXgb::before{content:''!important;position:absolute!important;top:0!important;left:0!important;right:0!important;bottom:0!important;background:${NOISE_TEXTURE}!important;opacity:0.2!important;pointer-events:none!important;border-radius:inherit!important;mix-blend-mode:overlay!important;}`
        },
        'rounded-soft': {
            name: 'Rounded Soft',
            css: `.RNNXgb{border-radius:28px!important;background:linear-gradient(135deg,#121212 0%,#1a1a1a 100%)!important;border:2px solid #2d2d2d!important;box-shadow:0 6px 20px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.05)!important;}`
        }
    };

    const PRESETS = {
        minimal: { darkMode: true, customLogo: false, removeAI: false, removeIcons: false, removeImages: false, removeMail: false },
        clean: { darkMode: true, customLogo: true, removeAI: true, removeIcons: false, removeImages: false, removeMail: false },
        full: { darkMode: true, customLogo: true, removeAI: true, removeIcons: true, removeImages: true, removeMail: true }
    };

    // ================== МЕНЕДЖЕРЫ И СОСТОЯНИЕ ==================

    const StyleManager = (() => {
        const styles = new Map();

        return {
            apply(id, css) {
                this.remove(id);
                const style = document.createElement('style');
                style.id = id;
                style.textContent = css;
                document.head.appendChild(style);
                styles.set(id, style);
            },
            remove(id) {
                const style = styles.get(id);
                if (style) {
                    style.remove();
                    styles.delete(id);
                }
            },
            clear() {
                styles.forEach(style => style.remove());
                styles.clear();
            }
        };
    })();

    let CONFIG = { ...DEFAULT_CONFIG };
    let panel = null;
    let activeTab = 'general';
    let lastReleaseInfo = null;
    let isCheckingUpdate = false;

    // ================== ИНИЦИАЛИЗАЦИЯ ==================

    async function init() {
        await loadConfig();
        injectLucideSprite();
        applyAll();
        createControlPanel();
        setupMutationObserver();
        setupHotkeys();
        setupUserScriptMenu();
        checkForUpdates(true);

        console.log(`[elGoogle v${SCRIPT_VERSION}] Запущен`);
    }

    async function loadConfig() {
        try {
            const saved = await GM.getValue('elGoogle_config');
            if (saved) CONFIG = { ...DEFAULT_CONFIG, ...saved };
        } catch (e) {
            console.warn('[elGoogle] Ошибка загрузки настроек:', e);
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

    function applyAll() {
        applyDarkTheme();
        applyLogo();
        applySearchStyles();
        applyPanelStyles();
        applyMenuTheme();
        applyMenuGlass();
        applyCompactMode();
        updateRemovedElements();
    }

    function applyDarkTheme() {
        if (CONFIG.darkMode) {
            StyleManager.apply('elgoogle-dark-theme', `
                body { background-color: #161616 !important; }
                #gb { background-color: #161616 !important; }
            `);
        } else {
            StyleManager.remove('elgoogle-dark-theme');
        }
    }

    function applyLogo() {
        if (CONFIG.customLogo) {
            StyleManager.apply('elgoogle-logo-style', `
                .lnXdpd { display: none !important; }
                .lnXdpd::before {
                    content: '' !important; display: inline-block !important;
                    width: 272px !important; height: 92px !important;
                    background-image: url('https://raw.githubusercontent.com/ellatuk/elGoogle/refs/heads/main/xlam/elgygal_logo.png') !important;
                    background-size: contain !important; background-repeat: no-repeat !important;
                    background-position: center !important; vertical-align: middle !important;
                }
            `);
        } else {
            StyleManager.remove('elgoogle-logo-style');
        }
    }

    function applySearchStyles() {
        if (CONFIG.searchStyleEnabled && CONFIG.searchStyle) {
            const style = SEARCH_STYLES[CONFIG.searchStyle];
            if (style) StyleManager.apply('elgoogle-search-style', style.css);
        } else {
            StyleManager.remove('elgoogle-search-style');
        }
    }

    function applyPanelStyles() {
        StyleManager.apply('elgoogle-panel-styles', getPanelStyles());
    }

    function applyMenuTheme() {
        if (panel) {
            panel.classList.remove('theme-dark', 'theme-light');
            panel.classList.add(`theme-${CONFIG.menuTheme}`);
        }
    }

    function applyMenuGlass() {
        if (panel) {
            // ИСПРАВЛЕНИЕ: правильная логика эффекта стекла
            panel.classList.toggle('glass', CONFIG.glassEffect);
            panel.classList.toggle('no-glass', !CONFIG.glassEffect);
        }
    }

    function applyCompactMode() {
        if (panel) {
            panel.classList.toggle('compact', CONFIG.compactMode);
        }
    }

    // ================== SVG-СПРАЙТ LUCIDE ==================

    function injectLucideSprite() {
        if (document.getElementById('el-lucide-sprite')) return;

        const sprite = document.createElement('div');
        sprite.id = 'el-lucide-sprite';
        sprite.style.display = 'none';
        sprite.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg">
                <!-- Основные иконки -->
                <symbol id="i-sliders" viewBox="0 0 24 24">
                    <line x1="21" x2="14" y1="4" y2="4"/>
                    <line x1="10" x2="3" y1="4" y2="4"/>
                    <line x1="21" x2="12" y1="12" y2="12"/>
                    <line x1="8" x2="3" y1="12" y2="12"/>
                    <line x1="21" x2="16" y1="20" y2="20"/>
                    <line x1="12" x2="3" y1="20" y2="20"/>
                    <line x1="14" x2="14" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="10" y2="14"/>
                    <line x1="16" x2="16" y1="18" y2="22"/>
                </symbol>
                <symbol id="i-search" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </symbol>
                <symbol id="i-menu" viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                </symbol>
                <symbol id="i-info" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                </symbol>

                <!-- Вспомогательные иконки -->
                <symbol id="i-close" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </symbol>
                <symbol id="i-export" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </symbol>
                <symbol id="i-import" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 10 12 15 7 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </symbol>
                <symbol id="i-reset" viewBox="0 0 24 24">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                </symbol>
                <symbol id="i-list-restart" viewBox="0 0 24 24">
                    <path d="M21 6H3"/>
                    <path d="M7 12H3"/>
                    <path d="M7 18H3"/>
                    <path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/>
                    <path d="M11 10v4h4"/>
                </symbol>
                <symbol id="i-settings" viewBox="0 0 24 24">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                </symbol>
                <symbol id="i-theme" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2"/>
                    <path d="M12 20v2"/>
                    <path d="m4.93 4.93 1.41 1.41"/>
                    <path d="m17.66 17.66 1.41 1.41"/>
                    <path d="M2 12h2"/>
                    <path d="M20 12h2"/>
                    <path d="m6.34 17.66-1.41 1.41"/>
                    <path d="m19.07 4.93-1.41 1.41"/>
                </symbol>
                <symbol id="i-logo" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="3" x2="9" y2="21"/>
                </symbol>
                <symbol id="i-image-off" viewBox="0 0 24 24">
                    <line x1="2" x2="22" y1="2" y2="22"/>
                    <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/>
                    <line x1="13.5" x2="6" y1="13.5" y2="21"/>
                    <line x1="18" x2="21" y1="12" y2="15"/>
                    <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"/>
                    <path d="M21 15V5a2 2 0 0 0-2-2H9"/>
                </symbol>
                <symbol id="i-mail-x" viewBox="0 0 24 24">
                    <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    <path d="m17 17 4 4"/>
                    <path d="m21 17-4 4"/>
                </symbol>
                <symbol id="i-ai" viewBox="0 0 24 24">
                    <path d="M12 8V4H8"/>
                    <rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/>
                    <path d="M20 14h2"/>
                    <path d="M15 13v2"/>
                    <path d="M9 13v2"/>
                </symbol>
                <symbol id="i-icon" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="9" r="1"/>
                    <path d="M12 13v3"/>
                </symbol>
                <symbol id="i-check" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                </symbol>
                <symbol id="i-github" viewBox="0 0 24 24">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </symbol>
                <symbol id="i-user" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="5"/>
                    <path d="M20 21a8 8 0 1 0-16 0"/>
                </symbol>
                <symbol id="i-leaf" viewBox="0 0 24 24">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </symbol>
                <symbol id="i-youtube" viewBox="0 0 24 24">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                    <path d="m10 15 5-3-5-3z"/>
                </symbol>
                <symbol id="i-lucide" viewBox="0 0 24 24">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </symbol>
                <symbol id="i-settings-2" viewBox="0 0 24 24">
                    <path d="M20 7h-9"/>
                    <path d="M14 17H5"/>
                    <circle cx="17" cy="17" r="3"/>
                    <circle cx="7" cy="7" r="3"/>
                </symbol>
            </svg>
        `;
        document.body.appendChild(sprite);
    }

    // ================== УПРАВЛЕНИЕ ЭЛЕМЕНТАМИ ==================

    function updateRemovedElements() {
        // Кнопка "Режим ИИ"
        const aiButton = document.querySelector('button[jsname="B6rgad"]');
        if (aiButton) aiButton.style.display = CONFIG.removeAI ? 'none' : '';

        // Иконки поиска
        document.querySelectorAll('div[jsname="UdfVXc"].WC2Die').forEach(el => {
            el.style.display = CONFIG.removeIcons ? 'none' : '';
        });

        // Кнопка "Картинки"
        const imagesLink = document.querySelector('a.gb_Z[data-pid="2"], a[aria-label*="картинк" i], a[href*="imghp"]');
        if (imagesLink) {
            const parent = imagesLink.closest('div.gb_0') || imagesLink.parentElement;
            if (parent) parent.style.display = CONFIG.removeImages ? 'none' : '';
        }

        // Кнопка "Почта"
        const mailLink = document.querySelector('a.gb_Z[data-pid="23"], a[aria-label*="почт" i], a[href*="mail.google.com"]');
        if (mailLink) {
            const parent = mailLink.closest('div.gb_0') || mailLink.parentElement;
            if (parent) parent.style.display = CONFIG.removeMail ? 'none' : '';
        }
    }

    // ================== ПАНЕЛЬ УПРАВЛЕНИЯ ==================

    function createControlPanel() {
        if (panel) panel.remove();

        panel = document.createElement('div');
        panel.className = `elgoogle-panel ${CONFIG.panelVisible ? '' : 'hidden'}`;
        panel.style.top = CONFIG.panelTop;
        panel.style.left = CONFIG.panelLeft;

        panel.innerHTML = `
            <div class="panel-header" id="elgoogle-drag-handle">
                <div class="panel-title">
                    <svg class="el-icon logo-icon"><use href="#i-logo"></use></svg>
                    <div class="title-text">
                        <span class="title-main">elGoogle</span>
                        <span class="title-version">v${SCRIPT_VERSION}</span>
                    </div>
                </div>
                <button class="panel-close" title="Закрыть (Esc)">
                    <svg class="el-icon"><use href="#i-close"></use></svg>
                </button>
            </div>

            <div class="tabs">
                <button class="tab ${activeTab === 'general' ? 'active' : ''}" data-tab="general">
                    <svg class="el-icon"><use href="#i-sliders"></use></svg>
                    Общие
                </button>
                <button class="tab ${activeTab === 'search' ? 'active' : ''}" data-tab="search">
                    <svg class="el-icon"><use href="#i-search"></use></svg>
                    Поиск
                </button>
                <button class="tab ${activeTab === 'menu' ? 'active' : ''}" data-tab="menu">
                    <svg class="el-icon"><use href="#i-menu"></use></svg>
                    Меню
                </button>
                <button class="tab ${activeTab === 'about' ? 'active' : ''}" data-tab="about">
                    <svg class="el-icon"><use href="#i-info"></use></svg>
                    <span class="tab-text">О плагине</span>
                </button>
            </div>

            <div class="tab-content" id="tabContent"></div>

            <div class="panel-footer">
                <button class="footer-btn" id="exportBtn" title="Экспорт настроек">
                    <svg class="el-icon"><use href="#i-export"></use></svg>
                </button>
                <button class="footer-btn" id="importBtn" title="Импорт настроек">
                    <svg class="el-icon"><use href="#i-import"></use></svg>
                </button>
                <button class="footer-btn" id="resetBtn" title="Сбросить настройки">
                    <svg class="el-icon"><use href="#i-list-restart"></use></svg>
                </button>
                <div class="footer-status">
                    ${isCheckingUpdate ? 'Проверка обновлений...' : 'F2 - меню'}
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        renderActiveTab();
        setupPanelEvents();
        makePanelDraggable();
        applyAll(); // Применяем стили к панели
    }

    function renderActiveTab() {
        const content = document.getElementById('tabContent');
        if (!content) return;

        const renderers = {
            general: renderGeneralTab,
            search: renderSearchTab,
            menu: renderMenuTab,
            about: renderAboutTab
        };

        renderers[activeTab]?.(content);
    }

    function renderGeneralTab(container) {
        container.innerHTML = `
            <div class="tab-section">
                <h3><svg class="el-icon section-icon"><use href="#i-settings-2"></use></svg>Основные настройки</h3>

                <div class="control-group">
                    <div class="control-row ${CONFIG.darkMode ? 'active' : ''}" data-action="toggleDark">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-theme"></use></svg>
                            <div>
                                <div class="control-title">Тёмная тема Google</div>
                                <div class="control-description">Полная тёмная тема страницы</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.darkMode ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="control-row ${CONFIG.customLogo ? 'active' : ''}" data-action="toggleLogo">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-logo"></use></svg>
                            <div>
                                <div class="control-title">Кастомный логотип</div>
                                <div class="control-description">Заменить логотип Google</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.customLogo ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="control-group">
                    <h4><svg class="el-icon section-icon"><use href="#i-ai"></use></svg>Очистка интерфейса</h4>

                    <div class="control-row ${CONFIG.removeAI ? 'active' : ''}" data-action="toggleAI">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-ai"></use></svg>
                            <div>
                                <div class="control-title">Удалить "Режим ИИ"</div>
                                <div class="control-description">Скрыть кнопку AI-поиска</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.removeAI ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="control-row ${CONFIG.removeIcons ? 'active' : ''}" data-action="toggleIcons">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-icon"></use></svg>
                            <div>
                                <div class="control-title">Удалить иконки поиска</div>
                                <div class="control-description">Скрыть голосовой поиск и камеру</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.removeIcons ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="control-row ${CONFIG.removeImages ? 'active' : ''}" data-action="toggleImages">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-image-off"></use></svg>
                            <div>
                                <div class="control-title">Удалить "Картинки"</div>
                                <div class="control-description">Скрыть ссылку на поиск по картинкам</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.removeImages ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="control-row ${CONFIG.removeMail ? 'active' : ''}" data-action="toggleMail">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-mail-x"></use></svg>
                            <div>
                                <div class="control-title">Удалить "Почта"</div>
                                <div class="control-description">Скрыть ссылку на Gmail</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.removeMail ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="control-group">
                    <h4><svg class="el-icon section-icon"><use href="#i-list-restart"></use></svg>Пресеты</h4>
                    <div class="preset-buttons">
                        <button class="preset-btn ${CONFIG.preset === 'minimal' ? 'active' : ''}" data-preset="minimal">Minimal</button>
                        <button class="preset-btn ${CONFIG.preset === 'clean' ? 'active' : ''}" data-preset="clean">Clean</button>
                        <button class="preset-btn ${CONFIG.preset === 'full' ? 'active' : ''}" data-preset="full">Full</button>
                    </div>
                    <div class="preset-description">${getPresetDescription(CONFIG.preset)}</div>
                </div>
            </div>
        `;

        setupControlHandlers(container);
    }

    function renderSearchTab(container) {
        container.innerHTML = `
            <div class="tab-section">
                <h3><svg class="el-icon section-icon"><use href="#i-search"></use></svg>Настройки поиска</h3>

                <div class="control-group">
                    <div class="control-row ${CONFIG.searchStyleEnabled ? 'active' : ''}" data-action="toggleSearchStyle">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-check"></use></svg>
                            <div>
                                <div class="control-title">Включить кастомизацию поиска</div>
                                <div class="control-description">Использовать кастомные стили поисковой строки</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.searchStyleEnabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="control-group">
                    <h4><svg class="el-icon section-icon"><use href="#i-theme"></use></svg>Стиль строки поиска</h4>
                    <div class="style-preview-grid">
                        ${Object.entries(SEARCH_STYLES).map(([key, style]) => `
                            <div class="style-preview ${CONFIG.searchStyle === key ? 'active' : ''}" data-style="${key}">
                                <div class="preview-box" style="${getPreviewStyle(key)}"></div>
                                <span class="preview-label">${style.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        setupControlHandlers(container);
    }

    function renderMenuTab(container) {
        container.innerHTML = `
            <div class="tab-section">
                <h3><svg class="el-icon section-icon"><use href="#i-menu"></use></svg>Настройки панели</h3>

                <div class="control-group">
                    <h4><svg class="el-icon section-icon"><use href="#i-theme"></use></svg>Тема панели</h4>
                    <div class="theme-buttons">
                        <button class="theme-btn ${CONFIG.menuTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                            <div class="theme-preview dark"></div>
                            Тёмная
                        </button>
                        <button class="theme-btn ${CONFIG.menuTheme === 'light' ? 'active' : ''}" data-theme="light">
                            <div class="theme-preview light"></div>
                            Светлая
                        </button>
                    </div>
                </div>

                <div class="control-group">
                    <div class="control-row ${CONFIG.compactMode ? 'active' : ''}" data-action="toggleCompact">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-check"></use></svg>
                            <div>
                                <div class="control-title">Компактный режим</div>
                                <div class="control-description">Уменьшить отступы и размеры</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.compactMode ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="control-row ${CONFIG.glassEffect ? 'active' : ''}" data-action="toggleGlass">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-check"></use></svg>
                            <div>
                                <div class="control-title">Эффект "Жидкое стекло"</div>
                                <div class="control-description">Полупрозрачный фон с размытием и шероховатостью</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.glassEffect ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        `;

        setupControlHandlers(container);
    }

    function renderAboutTab(container) {
        const versionStatus = lastReleaseInfo
            ? compareVersions(SCRIPT_VERSION, lastReleaseInfo.version) >= 0
                ? '<span class="status-good">✅ У вас актуальная версия</span>'
                : `<span class="status-warning">⚠️ Доступна новая версия ${lastReleaseInfo.version}</span>`
            : '<span class="status-neutral">Не удалось проверить</span>';

        container.innerHTML = `
            <div class="tab-section">
                <h3><svg class="el-icon section-icon"><use href="#i-info"></use></svg>О плагине elGoogle</h3>

                <div class="about-info">
                    <div class="info-item">
                        <strong>Текущая версия:</strong> ${SCRIPT_VERSION}
                    </div>
                    <div class="info-item">
                        <strong>Последняя версия:</strong> ${lastReleaseInfo ? lastReleaseInfo.version : '...'}
                        <button class="check-update-btn" id="checkUpdateBtn" ${isCheckingUpdate ? 'disabled' : ''}>
                            ${isCheckingUpdate ? 'Проверка...' : 'Проверить сейчас'}
                        </button>
                    </div>
                    <div class="info-item">
                        <strong>Статус:</strong> ${versionStatus}
                    </div>

                    <div class="info-item author-info">
                        <svg class="el-icon author-icon"><use href="#i-leaf"></use></svg>
                        <strong>Автор:</strong> ellatuk
                    </div>

                    <div class="info-item">
                        <strong>Технологии:</strong> JavaScript, Tampermonkey API, Lucide Icons
                    </div>
                </div>

                <div class="links-grid">
                    <a href="https://github.com/ellatuk/elGoogle" target="_blank" class="link-card">
                        <svg class="el-icon"><use href="#i-github"></use></svg>
                        <span>Репозиторий проекта</span>
                    </a>

                    <a href="https://github.com/ellatuk" target="_blank" class="link-card">
                        <svg class="el-icon"><use href="#i-user"></use></svg>
                        <span>Автор на GitHub</span>
                    </a>

                    <a href="https://www.youtube.com/@ellatuk" target="_blank" class="link-card">
                        <svg class="el-icon"><use href="#i-youtube"></use></svg>
                        <span>YouTube канал</span>
                    </a>

                    <a href="https://lucide.dev" target="_blank" class="link-card">
                        <svg class="el-icon"><use href="#i-lucide"></use></svg>
                        <span>Иконки Lucide</span>
                    </a>
                </div>

                <div class="about-footer">
                    <p>Спасибо за использование elGoogle! Если вам нравится скрипт, поставьте звезду на GitHub ⭐</p>
                </div>
            </div>
        `;

        container.querySelector('#checkUpdateBtn')?.addEventListener('click', () => checkForUpdates());
    }

    // ================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==================

    function getPresetDescription(preset) {
        const descriptions = {
            minimal: 'Только самое необходимое. Тёмная тема.',
            clean: 'Чистый Google. Тёмная тема, кастомный логотип, удаление AI.',
            full: 'Полная кастомизация. Все функции включены.'
        };
        return descriptions[preset] || '';
    }

    function getPreviewStyle(styleKey) {
        const styles = {
            'google-default': 'border-radius:24px;border:1px solid #5f6368;background:transparent;',
            'elgoogle-classic': 'border-radius:34px 14px;background:#121212;border:3px solid #1c1d1d;',
            'minimal-dark': 'border-radius:12px;background:#0a0a0a;border:1px solid #2a2a2a;',
            'glass-frosted': `border-radius:20px;background:linear-gradient(135deg,rgba(25,25,25,0.85)0%,rgba(35,35,35,0.8)100%),${NOISE_TEXTURE};backdrop-filter:blur(12px) saturate(2);border:1px solid rgba(255,255,255,0.2);`,
            'rounded-soft': 'border-radius:28px;background:linear-gradient(135deg,#121212 0%,#1a1a1a 100%);border:2px solid #2d2d2d;'
        };
        return styles[styleKey] || '';
    }

    function setupControlHandlers(container) {
        // Обработчики переключателей
        container.querySelectorAll('.control-row[data-action]').forEach(row => {
            const action = row.dataset.action;
            const checkbox = row.querySelector('input[type="checkbox"]');

            checkbox?.addEventListener('change', async (e) => {
                const value = e.target.checked;

                switch (action) {
                    case 'toggleDark': CONFIG.darkMode = value; break;
                    case 'toggleLogo': CONFIG.customLogo = value; break;
                    case 'toggleAI': CONFIG.removeAI = value; break;
                    case 'toggleIcons': CONFIG.removeIcons = value; break;
                    case 'toggleImages': CONFIG.removeImages = value; break;
                    case 'toggleMail': CONFIG.removeMail = value; break;
                    case 'toggleSearchStyle': CONFIG.searchStyleEnabled = value; break;
                    case 'toggleCompact': CONFIG.compactMode = value; break;
                    case 'toggleGlass': CONFIG.glassEffect = value; break;
                }

                await saveConfig();
                applyAll();
                updateRemovedElements();
                renderActiveTab();
            });
        });

        // Обработчики пресетов
        container.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const preset = btn.dataset.preset;
                CONFIG.preset = preset;
                Object.assign(CONFIG, PRESETS[preset]);

                await saveConfig();
                applyAll();
                updateRemovedElements();
                renderActiveTab();
            });
        });

        // Обработчики стилей поиска
        container.querySelectorAll('.style-preview').forEach(preview => {
            preview.addEventListener('click', async () => {
                CONFIG.searchStyle = preview.dataset.style;
                await saveConfig();
                applySearchStyles();
                renderActiveTab();
            });
        });

        // Обработчики тем меню
        container.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                CONFIG.menuTheme = btn.dataset.theme;
                await saveConfig();
                applyMenuTheme();
                renderActiveTab();
            });
        });
    }

    // ================== СОБЫТИЯ ПАНЕЛИ ==================

    function setupPanelEvents() {
        panel.querySelector('.panel-close').addEventListener('click', togglePanel);

        panel.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                activeTab = tab.dataset.tab;
                panel.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderActiveTab();
            });
        });

        panel.querySelector('#exportBtn').addEventListener('click', exportSettings);
        panel.querySelector('#importBtn').addEventListener('click', importSettings);
        panel.querySelector('#resetBtn').addEventListener('click', resetSettings);

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && !panel.classList.contains('hidden')) {
                togglePanel();
            }
        });
    }

    function makePanelDraggable() {
        const dragHandle = panel.querySelector('#elgoogle-drag-handle');
        let isDragging = false;
        let offsetX, offsetY;

        dragHandle.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            if (e.target.closest('button')) return;
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
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
        }

        function stopDrag() {
            if (!isDragging) return;
            isDragging = false;
            panel.style.transition = '';
            CONFIG.panelTop = panel.style.top;
            CONFIG.panelLeft = panel.style.left;
            saveConfig();
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }

    function togglePanel() {
        if (!panel) return;
        const isHidden = panel.classList.contains('hidden');
        panel.classList.toggle('hidden', !isHidden);
        CONFIG.panelVisible = isHidden;
        saveConfig();
    }

    // ================== СИСТЕМНЫЕ ФУНКЦИИ ==================

    async function exportSettings() {
        const settingsStr = JSON.stringify(CONFIG, null, 2);
        const blob = new Blob([settingsStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elGoogle-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('✅ Настройки экспортированы в файл!');
    }

    async function importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const imported = JSON.parse(text);

                if (typeof imported !== 'object' || imported === null) {
                    throw new Error('Неверный формат файла');
                }

                if (confirm(`Импортировать настройки? ВНИМАНИЕ: Это перезапишет текущие настройки.`)) {
                    CONFIG = { ...DEFAULT_CONFIG, ...imported };
                    await saveConfig();
                    location.reload();
                }
            } catch (error) {
                alert(`❌ Ошибка импорта: ${error.message}`);
            }
        };

        input.click();
    }

    async function resetSettings() {
        if (confirm('Сбросить ВСЕ настройки к значениям по умолчанию?')) {
            CONFIG = { ...DEFAULT_CONFIG };
            await saveConfig();
            location.reload();
        }
    }

    function setupMutationObserver() {
        let timeoutId;
        const observer = new MutationObserver(() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                updateRemovedElements();
                if (CONFIG.customLogo) applyLogo();
            }, 100);
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(updateRemovedElements, 2000);
    }

    function setupHotkeys() {
        document.addEventListener('keydown', e => {
            if (e.key === 'F2' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                togglePanel();
            }
            if (e.ctrlKey && e.altKey && e.key === 'r') {
                e.preventDefault();
                location.reload();
            }
        });
    }

    function setupUserScriptMenu() {
        if (typeof GM_registerMenuCommand === 'undefined') return;
        try {
            GM_registerMenuCommand('🎨 Открыть панель elGoogle', togglePanel, 'f2');
            GM_registerMenuCommand('🔄 Проверить обновления', () => checkForUpdates());
            GM_registerMenuCommand('📋 Экспорт настроек', exportSettings);
            GM_registerMenuCommand('🗑️ Сбросить все настройки', resetSettings);
        } catch (e) {
            console.warn('[elGoogle] Ошибка создания меню:', e);
        }
    }

    // ================== ПРОВЕРКА ОБНОВЛЕНИЙ ==================

    async function checkForUpdates(silent = false) {
        if (isCheckingUpdate) return;

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (!silent && (now - CONFIG.lastVersionCheck < oneDay)) {
            if (!silent) alert('Проверка обновлений доступна раз в сутки');
            return;
        }

        isCheckingUpdate = true;

        try {
            const latestRelease = await getLatestRelease();
            lastReleaseInfo = latestRelease;
            CONFIG.lastVersionCheck = now;
            await saveConfig();

            if (!silent) renderAboutTab(document.getElementById('tabContent'));
        } catch (error) {
            console.warn('[elGoogle] Ошибка проверки обновлений:', error);
            if (!silent) alert('Не удалось проверить обновления. Попробуйте позже.');
        } finally {
            isCheckingUpdate = false;
        }
    }

    function getLatestRelease() {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://api.github.com/repos/ellatuk/elGoogle/releases/latest',
                headers: { 'Accept': 'application/vnd.github.v3+json' },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve({
                                version: data.tag_name.replace(/^v/, ''),
                                url: data.html_url,
                                published: data.published_at
                            });
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error(`GitHub API error: ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    }

    function compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const p1 = parts1[i] || 0;
            const p2 = parts2[i] || 0;
            if (p1 !== p2) return p1 - p2;
        }
        return 0;
    }

    // ================== СТИЛИ ПАНЕЛИ ==================

    function getPanelStyles() {
        return `
            .elgoogle-panel {
                position: fixed; z-index: 999999;
                min-width: 400px; max-width: 500px;
                font-family: 'Segoe UI', system-ui, sans-serif;
                user-select: none; border-radius: 16px;
                transition: opacity 0.3s ease, transform 0.3s ease;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                overflow: hidden;
            }

            .elgoogle-panel.hidden {
                opacity: 0; transform: translateY(-10px);
                pointer-events: none;
            }

            /* Основные темы */
            .elgoogle-panel.theme-dark {
                background: rgba(25, 25, 25, 0.95);
                color: #fff; border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .elgoogle-panel.theme-light {
                background: rgba(255, 255, 255, 0.95);
                color: #333; border: 1px solid rgba(0, 0, 0, 0.1);
            }

            /* Эффект стекла - ИСПРАВЛЕН */
            .elgoogle-panel.glass {
                background: rgba(30, 30, 30, 0.55) !important;
                backdrop-filter: blur(20px) saturate(1.8) !important;
                -webkit-backdrop-filter: blur(20px) saturate(1.8) !important;
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
            }

            .elgoogle-panel.theme-dark.glass::before {
                content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: ${NOISE_TEXTURE}; opacity: 0.15; pointer-events: none;
                mix-blend-mode: overlay; z-index: -1;
            }

            .elgoogle-panel.theme-light.glass {
                background: rgba(255, 255, 255, 0.65) !important;
                backdrop-filter: blur(20px) saturate(1.8) !important;
                -webkit-backdrop-filter: blur(20px) saturate(1.8) !important;
                border: 1px solid rgba(0, 0, 0, 0.1) !important;
            }

            .elgoogle-panel.theme-light.glass::before {
                content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: ${NOISE_TEXTURE}; opacity: 0.1; pointer-events: none;
                mix-blend-mode: multiply; z-index: -1;
            }

            /* Состояние без эффекта стекла */
            .elgoogle-panel.no-glass {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
            }

            .elgoogle-panel.compact {
                min-width: 320px; max-width: 380px;
            }

            .elgoogle-panel.compact .panel-header { padding: 12px 16px; }
            .elgoogle-panel.compact .tabs { padding: 0 12px; }
            .elgoogle-panel.compact .tab { padding: 8px 12px; font-size: 13px; }
            .elgoogle-panel.compact .tab-content { padding: 16px; }

            /* Заголовок - ИСПРАВЛЕНО отображение версии */
            .panel-header {
                display: flex; justify-content: space-between;
                align-items: center; padding: 16px 20px;
                cursor: move; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .theme-light .panel-header {
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .panel-title {
                display: flex; align-items: center; gap: 10px;
            }

            .title-text {
                display: flex; align-items: baseline; gap: 6px;
            }

            .title-main {
                font-weight: 600; font-size: 16px;
            }

            .title-version {
                font-size: 12px; opacity: 0.6; font-weight: 400;
                letter-spacing: -0.2px;
            }

            .logo-icon {
                width: 20px; height: 20px;
            }

            .panel-close {
                background: rgba(255, 255, 255, 0.1); border: none;
                border-radius: 50%; width: 32px; height: 32px;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: background 0.2s;
            }

            .theme-light .panel-close { background: rgba(0, 0, 0, 0.1); }
            .panel-close:hover { background: rgba(255, 255, 255, 0.2); }
            .theme-light .panel-close:hover { background: rgba(0, 0, 0, 0.2); }

            /* Вкладки - ИСПРАВЛЕНО отображение текста */
            .tabs {
                display: flex; padding: 0 16px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(0, 0, 0, 0.1);
                border-radius: 16px 16px 0 0;
            }

            .theme-light .tabs {
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                background: rgba(0, 0, 0, 0.05);
            }

            .tab {
                flex: 1; display: flex; align-items: center;
                justify-content: center; gap: 8px; padding: 12px 16px;
                background: none; border: none; color: inherit;
                cursor: pointer; font-size: 14px; transition: all 0.2s;
                border-bottom: 2px solid transparent; opacity: 0.7;
                white-space: nowrap; /* Предотвращаем перенос текста */
            }

            .tab-text {
                display: inline-block;
            }

            .tab:hover {
                opacity: 1; background: rgba(255, 255, 255, 0.05);
                transform: translateY(-1px);
            }

            .theme-light .tab:hover { background: rgba(0, 0, 0, 0.05); }

            .tab.active {
                opacity: 1; border-bottom-color: #1a73e8;
                background: rgba(26, 115, 232, 0.1);
            }

            /* Контент вкладок */
            .tab-content {
                padding: 20px; max-height: 60vh; overflow-y: auto;
            }

            .tab-section h3 {
                margin: 0 0 20px 0; font-size: 18px;
                display: flex; align-items: center; gap: 10px;
            }

            .tab-section h4 {
                margin: 0 0 12px 0; font-size: 14px; opacity: 0.9;
                display: flex; align-items: center; gap: 8px;
            }

            .control-group { margin-bottom: 24px; }

            /* Строки управления */
            .control-row {
                display: flex; justify-content: space-between;
                align-items: center; padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                transition: background .15s, transform .12s;
                cursor: pointer; border-radius: 8px; margin: 2px 0;
                padding-left: 12px; padding-right: 12px;
            }

            .theme-light .control-row {
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            }

            .control-row:hover {
                background: rgba(255, 255, 255, 0.06);
                transform: translateX(2px);
            }

            .theme-light .control-row:hover {
                background: rgba(0, 0, 0, 0.06);
            }

            .control-row.active {
                background: color-mix(in srgb, #1a73e8 18%, transparent);
            }

            .control-label {
                display: flex; align-items: center; gap: 12px;
                flex: 1;
            }

            .control-title {
                font-size: 14px; color: inherit;
            }

            .control-description {
                font-size: 12px; opacity: 0.7; margin-top: 2px;
            }

            /* Иконки */
            .el-icon {
                width: 18px; height: 18px;
                stroke: currentColor; fill: none;
                stroke-width: 2; stroke-linecap: round;
                stroke-linejoin: round;
                flex-shrink: 0;
            }

            .section-icon {
                width: 20px; height: 20px; opacity: 0.9;
            }

            .author-icon {
                width: 16px; height: 16px; margin-right: 6px;
                opacity: 0.8;
            }

            .author-info {
                display: flex; align-items: center;
            }

            /* Переключатель */
            .switch {
                position: relative; display: inline-block;
                width: 52px; height: 26px;
            }

            .switch input {
                opacity: 0; width: 0; height: 0;
            }

            .slider {
                position: absolute; cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: #555; transition: .4s;
                border-radius: 34px;
            }

            .theme-light .slider { background-color: #ccc; }

            .slider:before {
                position: absolute; content: "";
                height: 18px; width: 18px; left: 4px;
                bottom: 4px; background-color: white;
                transition: .4s; border-radius: 50%;
                transition: transform .2s cubic-bezier(.4,0,.2,1);
            }

            input:checked + .slider { background-color: #1a73e8; }

            input:checked + .slider:before {
                transform: translateX(26px);
            }

            /* Пресеты */
            .preset-buttons { display: flex; gap: 10px; margin-bottom: 12px; }
            .preset-btn {
                flex: 1; padding: 10px; background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px;
                color: inherit; cursor: pointer; transition: all 0.2s;
            }
            .theme-light .preset-btn { background: rgba(0, 0, 0, 0.05); border-color: rgba(0, 0, 0, 0.1); }
            .preset-btn:hover { background: rgba(255, 255, 255, 0.2); }
            .theme-light .preset-btn:hover { background: rgba(0, 0, 0, 0.1); }
            .preset-btn.active { background: #1a73e8; border-color: #1a73e8; color: white; }
            .preset-description { font-size: 13px; opacity: 0.8; padding: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 6px; }
            .theme-light .preset-description { background: rgba(0, 0, 0, 0.05); }

            /* Предпросмотр стилей */
            .style-preview-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 12px; }
            .style-preview {
                cursor: pointer; border: 2px solid transparent; border-radius: 10px;
                padding: 12px; transition: all 0.2s; background: rgba(255, 255, 255, 0.05);
            }
            .theme-light .style-preview { background: rgba(0, 0, 0, 0.05); }
            .style-preview:hover {
                background: rgba(255, 255, 255, 0.1); transform: translateY(-2px);
            }
            .theme-light .style-preview:hover { background: rgba(0, 0, 0, 0.1); }
            .style-preview.active { border-color: #1a73e8; background: rgba(26, 115, 232, 0.1); }
            .preview-box { width: 100%; height: 40px; border-radius: 8px; margin-bottom: 8px; transition: all 0.3s; }
            .preview-label { display: block; text-align: center; font-size: 13px; opacity: 0.9; }

            /* Темы меню */
            .theme-buttons { display: flex; gap: 12px; margin-top: 12px; }
            .theme-btn {
                flex: 1; display: flex; flex-direction: column;
                align-items: center; gap: 8px; padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid transparent; border-radius: 10px;
                cursor: pointer; transition: all 0.2s;
            }
            .theme-light .theme-btn { background: rgba(0, 0, 0, 0.05); }
            .theme-btn:hover { background: rgba(255, 255, 255, 0.1); }
            .theme-light .theme-btn:hover { background: rgba(0, 0, 0, 0.1); }
            .theme-btn.active { border-color: #1a73e8; background: rgba(26, 115, 232, 0.1); }
            .theme-preview { width: 60px; height: 40px; border-radius: 6px; }
            .theme-preview.dark { background: #1a1a1a; border: 1px solid #333; }
            .theme-preview.light { background: #f5f5f5; border: 1px solid #ddd; }

            /* О плагине */
            .about-info { background: rgba(255, 255, 255, 0.05); border-radius: 10px; padding: 16px; margin-bottom: 20px; }
            .theme-light .about-info { background: rgba(0, 0, 0, 0.05); }
            .info-item {
                display: flex; justify-content: space-between;
                align-items: center; padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            .theme-light .info-item { border-bottom: 1px solid rgba(0, 0, 0, 0.05); }
            .info-item:last-child { border-bottom: none; }
            .check-update-btn {
                padding: 4px 12px; background: rgba(26, 115, 232, 0.2);
                border: 1px solid #1a73e8; border-radius: 6px;
                color: inherit; cursor: pointer; font-size: 12px;
                transition: background 0.2s;
            }
            .check-update-btn:hover:not(:disabled) { background: rgba(26, 115, 232, 0.3); }
            .check-update-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            .status-good { color: #34a853; }
            .status-warning { color: #fbbc05; }
            .status-neutral { opacity: 0.7; }

            /* Ссылки */
            .links-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 20px 0; }
            .link-card {
                display: flex; flex-direction: column; align-items: center;
                gap: 10px; padding: 16px; background: rgba(255, 255, 255, 0.05);
                border-radius: 10px; text-decoration: none; color: inherit;
                transition: all 0.2s;
            }
            .theme-light .link-card { background: rgba(0, 0, 0, 0.05); }
            .link-card:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px); text-decoration: none;
            }
            .theme-light .link-card:hover { background: rgba(0, 0, 0, 0.1); }
            .link-card .el-icon { width: 24px; height: 24px; }
            .link-card span { font-size: 13px; text-align: center; opacity: 0.9; }

            .about-footer {
                margin-top: 20px; padding-top: 16px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 13px; opacity: 0.8; text-align: center;
            }
            .theme-light .about-footer { border-top: 1px solid rgba(0, 0, 0, 0.1); }

            /* Футер панели */
            .panel-footer {
                display: flex; align-items: center; padding: 12px 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(0, 0, 0, 0.1);
                border-radius: 0 0 16px 16px;
            }
            .theme-light .panel-footer {
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                background: rgba(0, 0, 0, 0.05);
            }

            .footer-btn {
                background: rgba(255, 255, 255, 0.1); border: none;
                border-radius: 6px; width: 32px; height: 32px;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; margin-right: 8px; transition: background 0.2s;
            }
            .theme-light .footer-btn { background: rgba(0, 0, 0, 0.1); }
            .footer-btn:hover { background: rgba(255, 255, 255, 0.2); }
            .theme-light .footer-btn:hover { background: rgba(0, 0, 0, 0.2); }

            .footer-status {
                flex: 1; text-align: right;
                font-size: 12px; opacity: 0.7;
            }
        `;
    }

    // ================== ЗАПУСК ==================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();