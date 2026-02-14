// ==UserScript==
// @name              elGoogle
// @name:ru-RU        elГугал
// @namespace         https://github.com/ellatuk/elGoogle/releases
// @icon              https://raw.githubusercontent.com/ellatuk/elGoogle/refs/heads/main/xlam/elGoogleLogo.ico
// @version           1.3
// @description       Makes the Google Search home page better. Better "Gygale Search"
// @description:ru-RU Делает гугл поиск лучше. Лучший "Гугал поиск"
// @author            ellatuk
// @homepageURL       https://github.com/ellatuk/elGoogle
// @match             https://www.google.com/*
// @match             https://www.google.ru/*
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM.registerMenuCommand
// @grant             GM_info
// @grant             GM.xmlHttpRequest
// @connect           github.com
// @connect           api.github.com
// @license      CC-BY-NC-ND-4.0; https://creativecommons.org/licenses/by-nc-nd/4.0/
// @downloadURL https://update.greasyfork.org/scripts/501245/elGoogle.user.js
// @updateURL https://update.greasyfork.org/scripts/501245/elGoogle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================== СИСТЕМА ЯЗЫКОВ ==================

    const LANGUAGES = {
        ru: {
            // Общие названия разделов и элементов интерфейса
            general: 'Общие',
            search: 'Поиск',
            menu: 'Меню',
            about: 'О плагине',

            // Тема и внешний вид
            darkTheme: 'Тёмная тема Google',
            darkThemeDesc: 'Полная тёмная тема страницы',
            customLogo: 'Кастомный логотип',
            customLogoDesc: 'Заменить логотип Google',

            // Очистка интерфейса
            cleaninginterface: 'Очистка внешнего вида',
            removeAI: 'Удалить "Режим ИИ"',
            removeAIDesc: 'Скрыть кнопку AI-поиска',
            removeIcons: 'Удалить иконки поиска',
            removeIconsDesc: 'Скрыть голосовой поиск и камеру',
            removeImages: 'Удалить "Картинки"',
            removeImagesDesc: 'Скрыть ссылку на поиск по картинкам',
            removeMail: 'Удалить "Почта"',
            removeMailDesc: 'Скрыть ссылку на Gmail',

            // Стили поисковой строки
            searchStyleEnabled: 'Включить кастомизацию поиска',
            searchStyleEnabledDesc: 'Использовать кастомные стили поисковой строки',

            // Компактный режим и эффекты
            compactMode: 'Компактный режим',
            compactModeDesc: 'Уменьшить отступы и размеры',
            glassEffect: 'Эффект "Жидкое стекло"',
            glassEffectDesc: 'Полупрозрачный фон с размытием и шероховатостью',

            // Пресеты
            presets: 'Пресеты',
            minimal: 'Минимальный',
            clean: 'Чистый',
            full: 'Полный',
            custom: 'Пользовательский',
            minimalDesc: 'Только самое необходимое. Тёмная тема.',
            cleanDesc: 'Чистый Google. Тёмная тема, кастомный логотип, удаление AI.',
            fullDesc: 'Полная кастомизация. Все функции включены.',
            customDesc: 'Пользовательские настройки. Вы изменили стандартные параметры.',

            // Стили поисковой строки (названия)
            searchstylegoogle: 'Google',
            searchstyleelgoogle: 'elGoogle',
            searchstyleminimaldark: 'Маленькая Темнота',
            searchstyleglassfrosted: 'Матовое Стекло',
            searchstyleroundedsoft: 'Округлый Мягкий',
            searchstyleshadowblurwhite: 'Белая Размытая Тень',
            searchstyleglassmorph: 'Стеклянный Morph',
            searchstyleliquidmetal: 'Жидкий Метал',
            searchstylemonochromecrt: 'Монохромный CRT',
            searchstylecyberpunkneon: 'Неоновый Киберпанк',

            // Тема панели
            searchStyle: 'Стиль строки поиска',
            theme: 'Тема панели',
            dark: 'Тёмная',
            light: 'Светлая',

            // Настройки панели
            panelSettings: 'Настройки панели',

            // Информация о версии
            currentVersion: 'Текущая версия:',
            latestVersion: 'Последняя версия:',
            status: 'Статус:',
            upToDate: 'У вас актуальная версия',
            updateAvailable: 'Доступна новая версия',
            checkFailed: 'Не удалось проверить',

            // Информация об авторе и проекте
            author: 'Автор:',
            technologies: 'Технологии:',
            repository: 'Репозиторий проекта',
            authorGitHub: 'Автор на GitHub',
            youtubeChannel: 'YouTube канал',
            supportAuthor: 'Поддержать автора',

            // Горячие клавиши и управление
            f2Menu: 'F2 - меню',
            checkingUpdates: 'Проверка обновлений...',
            checkNow: 'Проверить сейчас',
            checking: 'Проверка...',
            exportSettings: 'Экспорт настроек',
            importSettings: 'Импорт настроек',
            resetSettings: 'Сброс настроек',

            // Язык меню
            menuLanguage: 'Язык меню',
            languageDesc: 'Выбор языка интерфейса панели управления',
            russian: 'Русский',
            english: 'English',
            auto: 'Автоматически',
            autoDesc: 'Язык определяется автоматически на основе языка браузера',

            // Благодарности
            thanksForUsing: 'Спасибо за использование elGoogle! Если вам нравится скрипт, поставьте звезду на GitHub ⭐'
        },
        en: {
            // General section names and UI elements
            general: 'General',
            search: 'Search',
            menu: 'Menu',
            about: 'About',

            // Theme and appearance
            darkTheme: 'Dark Google Theme',
            darkThemeDesc: 'Full dark theme of the page',
            customLogo: 'Custom Logo',
            customLogoDesc: 'Replace Google logo',

            // Interface cleaning
            cleaninginterface: 'Clean up appearance',
            removeAI: 'Remove "AI Mode"',
            removeAIDesc: 'Hide AI search button',
            removeIcons: 'Remove Search Icons',
            removeIconsDesc: 'Hide voice search and camera',
            removeImages: 'Remove "Images"',
            removeImagesDesc: 'Hide image search link',
            removeMail: 'Remove "Mail"',
            removeMailDesc: 'Hide Gmail link',

            // Search bar styles
            searchStyleEnabled: 'Enable search customization',
            searchStyleEnabledDesc: 'Use custom search bar styles',

            // Compact mode and effects
            compactMode: 'Compact Mode',
            compactModeDesc: 'Reduce margins and sizes',
            glassEffect: 'Liquid Glass Effect',
            glassEffectDesc: 'Semi-transparent background with blur and roughness',

            // Presets
            presets: 'Presets',
            minimal: 'Minimal',
            clean: 'Clean',
            full: 'Full',
            custom: 'Custom',
            minimalDesc: 'Only the essentials. Dark theme.',
            cleanDesc: 'Clean Google. Dark theme, custom logo, AI removal.',
            fullDesc: 'Full customization. All features enabled.',
            customDesc: 'Custom settings. You have changed the default parameters.',

            // Search Bar Style names
            searchstylegoogle: 'Google',
            searchstyleelgoogle: 'elGoogle',
            searchstyleminimaldark: 'Minimal Dark',
            searchstyleglassfrosted: 'Glass Frosted',
            searchstyleroundedsoft: 'Rounded Soft',
            searchstyleshadowblurwhite: 'Shadow Blur White',
            searchstyleglassmorph: 'Glass Morph',
            searchstyleliquidmetal: 'Liquid Metal',
            searchstylemonochromecrt: 'Monochrome CRT',
            searchstylecyberpunkneon: 'Cyberpunk Neon',

            // Panel theme
            searchStyle: 'Search Bar Style',
            theme: 'Panel Theme',
            dark: 'Dark',
            light: 'Light',

            // Panel settings
            panelSettings: 'Panel Settings',

            // Version information
            currentVersion: 'Current version:',
            latestVersion: 'Latest version:',
            status: 'Status:',
            upToDate: '✅ You have the latest version',
            updateAvailable: '⚠️ New version available',
            checkFailed: 'Failed to check',

            // Author and project information
            author: 'Author:',
            technologies: 'Technologies:',
            repository: 'Project Repository',
            authorGitHub: 'Author on GitHub',
            youtubeChannel: 'YouTube Channel',
            supportAuthor: 'Support Author',

            // Hotkeys and controls
            f2Menu: 'F2 - menu',
            checkingUpdates: 'Checking updates...',
            checkNow: 'Check now',
            checking: 'Checking...',
            exportSettings: 'Export settings',
            importSettings: 'Import settings',
            resetSettings: 'Reset settings',

            // Menu language
            menuLanguage: 'Menu Language',
            languageDesc: 'Interface language selection for control panel',
            russian: 'Русский',
            english: 'English',
            auto: 'Auto',
            autoDesc: 'Language is automatically determined based on browser language',

            // Thanks
            thanksForUsing: 'Thank you for using elGoogle! If you like the script, give it a star on GitHub ⭐'
        }
    };

    // Определяем язык браузера
    const browserLang = navigator.language.startsWith('ru') ? 'ru' : 'en';

    // Инициализируем переводы с дефолтным языком (будет переопределено после загрузки конфига)
    let currentLang = browserLang;
    let t = LANGUAGES[currentLang];
    let tt = t;

    // ================== КОНСТАНТЫ И КОНФИГУРАЦИЯ ==================

    const SCRIPT_VERSION = GM_info?.script?.version || '1.3';
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
        lastVersionCheck: 0,
        menuLanguage: 'auto'  // По умолчанию автоматическое определение
    };

    const createSearchStyle = (rules, extraCss = '') => {
        const base = Object.entries(rules)
            .map(([prop, value]) => `${prop}:${value}!important;`)
            .join('');
        return `.RNNXgb{${base}}${extraCss}`;
    };

    const SEARCH_STYLES = {
        'google-default': {
            key: 'google',
            css: createSearchStyle({
                'border-radius': '24px',
                'background-color': 'transparent',
                border: '1px solid #5f6368',
                'box-shadow': 'none'
            })
        },
        'elgoogle-classic': {
            key: 'elgoogle',
            css: createSearchStyle({
                'border-radius': '34px 14px',
                'background-color': '#121212',
                border: '3px solid #1c1d1d',
                'box-shadow': '0 2px 8px rgba(0,0,0,0.3)'
            })
        },
        'minimal-dark': {
            key: 'minimaldark',
            css: createSearchStyle({
                'border-radius': '12px',
                'background-color': '#0a0a0a',
                border: '1px solid #2a2a2a',
                'box-shadow': '0 1px 3px rgba(0,0,0,0.2)'
            })
        },
        'glass-frosted': {
            key: 'glassfrosted',
            css: createSearchStyle({
                'border-radius': '20px',
                background: `linear-gradient(135deg,rgba(25,25,25,0.85)0%,rgba(35,35,35,0.8)100%),${NOISE_TEXTURE}`,
                'backdrop-filter': 'blur(12px) saturate(2)',
                '-webkit-backdrop-filter': 'blur(12px) saturate(2)',
                border: '1px solid rgba(255,255,255,0.2)',
                'box-shadow': '0 4px 20px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.15),inset 0 -1px 0 rgba(0,0,0,0.6)'
            }, `.RNNXgb::before{content:''!important;position:absolute!important;top:0!important;left:0!important;right:0!important;bottom:0!important;background:${NOISE_TEXTURE}!important;opacity:0.2!important;pointer-events:none!important;border-radius:inherit!important;mix-blend-mode:overlay!important;}`)
        },
        'rounded-soft': {
            key: 'roundedsoft',
            css: createSearchStyle({
                'border-radius': '28px',
                background: 'linear-gradient(135deg,#121212 0%,#1a1a1a 100%)',
                border: '2px solid #2d2d2d',
                'box-shadow': '0 6px 20px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.05)'
            })
        },
        'shadow-blur-white': {
            key: 'shadowblurwhite',
            css: createSearchStyle({
                'border-radius': '20px',
                'background-color': 'rgba(18, 18, 18, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                'box-shadow': '0 0 32px 8px rgba(255, 255, 255, 0.25)',
                'backdrop-filter': 'blur(10px)',
                '-webkit-backdrop-filter': 'blur(10px)',
                position: 'relative',
                overflow: 'hidden'
            }, `.RNNXgb::before{content:''!important;position:absolute!important;top:-8px!important;left:-8px!important;right:-8px!important;bottom:-8px!important;background:radial-gradient(circle at center,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.05) 40%,transparent 70%)!important;border-radius:28px!important;z-index:-1!important;pointer-events:none!important;filter:blur(16px)!important;}.RNNXgb::after{content:''!important;position:absolute!important;top:0!important;left:0!important;right:0!important;bottom:0!important;border-radius:20px!important;border:1px solid rgba(255,255,255,0.1)!important;pointer-events:none!important;box-shadow:inset 0 1px 0 rgba(255,255,255,0.05),inset 0 -1px 0 rgba(0,0,0,0.2)!important;}`)
        },
        'glass-morph': {
            key: 'glassmorph',
            css: createSearchStyle({
                background: 'rgba(255, 255, 255, 0.04)',
                'border-radius': '16px',
                'box-shadow': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'backdrop-filter': 'blur(5.9px)',
                '-webkit-backdrop-filter': 'blur(5.9px)',
                border: '1px solid rgba(255, 255, 255, 0.02)'
            })
        },
        'liquid-metal': {
            key: 'liquidmetal',
            css: createSearchStyle({
                'border-radius': '16px',
                background: 'linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 50%,#1a1a1a 100%)',
                border: '2px solid transparent',
                'box-shadow': 'inset 0 2px 10px rgba(255,255,255,0.1),inset 0 -2px 10px rgba(0,0,0,0.5),0 5px 30px rgba(0,0,0,0.6)',
                position: 'relative',
                overflow: 'hidden'
            }, `.RNNXgb::before{content:''!important;position:absolute!important;top:0!important;left:0!important;right:0!important;bottom:0!important;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.05) 50%,transparent 100%)!important;border-radius:16px!important;animation:metal-shine 4s ease-in-out infinite alternate!important;z-index:1!important;pointer-events:none!important;}.RNNXgb::after{content:''!important;position:absolute!important;top:2px!important;left:2px!important;right:2px!important;bottom:2px!important;background:radial-gradient(circle at 30% 30%,rgba(200,200,200,0.1) 0%,transparent 50%),radial-gradient(circle at 70% 70%,rgba(150,150,150,0.08) 0%,transparent 50%)!important;border-radius:14px!important;border:1px solid rgba(255,255,255,0.08)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,0.15),inset 0 -1px 0 rgba(0,0,0,0.3)!important;pointer-events:none!important;}.RNNXgb > div{position:relative!important;z-index:2!important;background:repeating-linear-gradient(45deg,transparent,transparent 1px,rgba(255,255,255,0.01) 1px,rgba(255,255,255,0.01) 2px)!important;border-radius:14px!important;}@keyframes metal-shine{0%{transform:translateX(-100%) rotate(45deg);opacity:0.3;}50%{opacity:0.6;}100%{transform:translateX(100%) rotate(45deg);opacity:0.3;}}.RNNXgb input{color:#e0e0e0!important;text-shadow:0 1px 0 rgba(0,0,0,0.5),0 -1px 0 rgba(255,255,255,0.1)!important;background:transparent!important;font-weight:500!important;}`)
        },
        'monochrome-crt': {
            key: 'monochromecrt',
            css: createSearchStyle({
                'border-radius': '4px',
                background: 'radial-gradient(ellipse at center,rgba(200,200,200,0.1) 0%,rgba(0,0,0,0.95) 100%)',
                border: '4px solid #b0b0b0',
                'box-shadow': 'inset 0 0 60px rgba(255,255,255,0.2),0 0 40px rgba(255,255,255,0.3),0 0 0 3px rgba(200,200,200,0.4),inset 0 0 100px rgba(0,0,0,0.8)',
                position: 'relative',
                overflow: 'hidden',
                'font-family': "'Courier New', monospace"
            }, `.RNNXgb::before{content:''!important;position:absolute!important;top:0!important;left:0!important;right:0!important;bottom:0!important;background:repeating-linear-gradient(0deg,rgba(255,255,255,0.08) 0px,rgba(255,255,255,0.08) 1px,transparent 1px,transparent 2px),repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 3px)!important;border-radius:4px!important;pointer-events:none!important;animation:scanlines 0.08s linear infinite!important;z-index:1!important;background-size:100% 3px,4px 100%!important;}.RNNXgb::after{content:''!important;position:absolute!important;top:0!important;left:0!important;right:0!important;bottom:0!important;background:radial-gradient(circle at 50% 0%,rgba(255,255,255,0.25) 0%,transparent 60%),radial-gradient(circle at 50% 100%,rgba(255,255,255,0.15) 0%,transparent 60%),radial-gradient(circle at 30% 50%,rgba(255,255,255,0.1) 0%,transparent 50%),radial-gradient(circle at 70% 50%,rgba(255,255,255,0.1) 0%,transparent 50%)!important;border-radius:4px!important;pointer-events:none!important;animation:crt-flicker 5s infinite!important;z-index:0!important;}.RNNXgb{border-style:outset!important;border-color:#808080 #404040 #404040 #808080!important;border-width:4px!important;}@keyframes scanlines{0%{transform:translateY(0);}100%{transform:translateY(3px);}}@keyframes crt-flicker{0%,100%{opacity:1;}1%{opacity:0.97;}2%{opacity:1;}10%{opacity:0.99;}11%{opacity:1;}20%{opacity:0.98;}21%{opacity:1;}30%{opacity:0.99;}31%{opacity:1;}40%{opacity:0.97;}41%{opacity:1;}50%{opacity:0.99;}51%{opacity:1;}60%{opacity:0.98;}61%{opacity:1;}70%{opacity:0.99;}71%{opacity:1;}80%{opacity:0.97;}81%{opacity:1;}90%{opacity:0.99;}91%{opacity:1;}}.RNNXgb input{text-shadow:0 0 8px rgba(255,255,255,0.9),0 0 15px rgba(255,255,255,0.6),0 0 25px rgba(255,255,255,0.3)!important;color:#ffffff!important;font-weight:bold!important;letter-spacing:1px!important;}.RNNXgb{background-image:radial-gradient(circle at 20% 30%,rgba(255,255,255,0.05) 1px,transparent 2px),radial-gradient(circle at 80% 70%,rgba(255,255,255,0.05) 1px,transparent 2px),radial-gradient(circle at 40% 60%,rgba(255,255,255,0.05) 1px,transparent 2px)!important;background-size:200px 200px,150px 150px,180px 180px!important;}`)
        },
        'cyberpunk-neon': {
            key: 'cyberpunkneon',
            css: createSearchStyle({
                'border-radius': '18px',
                background: 'linear-gradient(135deg,#0a0a0a 0%,#151515 100%)',
                border: '1px solid transparent',
                'box-shadow': '0 4px 25px rgba(0,0,0,0.7)',
                position: 'relative',
                overflow: 'hidden',
                isolation: 'isolate'
            }, `.RNNXgb::before{content:''!important;position:absolute!important;top:-4px!important;left:-4px!important;right:-4px!important;bottom:-4px!important;background:linear-gradient(45deg,#eb08da 0%,#5fa5fb 25%,#08ffa2 50%,#e0fe4e 75%,#eb08da 100%)!important;border-radius:22px!important;z-index:-1!important;animation:cyber-glow-4colors 3s linear infinite!important;background-size:300% 300%!important;filter:blur(12px)!important;opacity:0.85!important;}.RNNXgb::after{content:''!important;position:absolute!important;top:0!important;left:0!important;right:0!important;bottom:0!important;background:linear-gradient(90deg,rgba(235,8,218,0.1) 0%,rgba(95,165,251,0.08) 25%,rgba(8,255,162,0.06) 50%,rgba(224,254,78,0.04) 75%,rgba(235,8,218,0.02) 100%),radial-gradient(circle at 80% 20%,rgba(235,8,218,0.15) 0%,transparent 60%),radial-gradient(circle at 20% 80%,rgba(8,255,162,0.15) 0%,transparent 60%)!important;border-radius:18px!important;pointer-events:none!important;animation:gradient-shift 8s ease-in-out infinite alternate!important;mix-blend-mode:screen!important;}@keyframes cyber-glow-4colors{0%{background-position:0% 50%;opacity:0.7;}25%{background-position:50% 100%;opacity:0.9;}50%{background-position:100% 50%;opacity:0.7;}75%{background-position:50% 0%;opacity:0.9;}100%{background-position:0% 50%;opacity:0.7;}}@keyframes gradient-shift{0%{background-position:0% 0%,80% 20%,20% 80%;opacity:0.8;}33%{background-position:100% 100%,60% 40%,40% 60%;opacity:0.9;}66%{background-position:0% 100%,90% 30%,10% 70%;opacity:0.85;}100%{background-position:100% 0%,70% 10%,30% 90%;opacity:0.8;}}.RNNXgb input{color:#ffffff!important;text-shadow:0 0 10px rgba(235,8,218,0.5),0 0 20px rgba(95,165,251,0.3),0 0 30px rgba(8,255,162,0.2)!important;background:transparent!important;}`)
        }
    };


    const GM_API = {
        getValue: (typeof GM !== 'undefined' && typeof GM.getValue === 'function') ? GM.getValue.bind(GM) : null,
        setValue: (typeof GM !== 'undefined' && typeof GM.setValue === 'function') ? GM.setValue.bind(GM) : null,
        registerMenuCommand:
            (typeof GM !== 'undefined' && typeof GM.registerMenuCommand === 'function')
                ? GM.registerMenuCommand.bind(GM)
                : (typeof GM_registerMenuCommand === 'function' ? GM_registerMenuCommand : null),
        xmlHttpRequest: (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function') ? GM.xmlHttpRequest.bind(GM) : null
    };

    const PRESETS = {
        minimal: {
            name: 'minimal',
            values: { darkMode: true, customLogo: false, removeAI: false, removeIcons: false, removeImages: false, removeMail: false }
        },
        clean: {
            name: 'clean',
            values: { darkMode: true, customLogo: true, removeAI: true, removeIcons: false, removeImages: false, removeMail: false }
        },
        full: {
            name: 'full',
            values: { darkMode: true, customLogo: true, removeAI: true, removeIcons: true, removeImages: true, removeMail: true }
        },
        custom: {
            name: 'custom',
            values: null
        }
    };

    // Обновляем названия пресетов с учетом перевода
    function updatePresetNames() {
        if (t) {
            PRESETS.minimal.name = t.minimal;
            PRESETS.clean.name = t.clean;
            PRESETS.full.name = t.full;
            PRESETS.custom.name = t.custom;
        }
    }

    // ================== МЕНЕДЖЕР СТИЛЕЙ ==================

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
            exists(id) {
                return styles.has(id);
            },
            clear() {
                styles.forEach(style => style.remove());
                styles.clear();
            }
        };
    })();

    // ================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==================

    let CONFIG = { ...DEFAULT_CONFIG };
    const state = {
        panel: null,
        activeTab: 'general',
        lastReleaseInfo: null,
        isCheckingUpdate: false,
        logoApplied: false
    };


    function makeSafeTranslations(langPack) {
        const fallback = LANGUAGES.en || {};
        return new Proxy(langPack || {}, {
            get(target, prop) {
                if (typeof prop !== 'string') return target[prop];
                if (target[prop] !== undefined) return target[prop];
                if (fallback[prop] !== undefined) return fallback[prop];
                return prop;
            }
        });
    }


    function makeSafeTranslations(langPack) {
        const fallback = LANGUAGES.en || {};
        return new Proxy(langPack || {}, {
            get(target, prop) {
                if (typeof prop !== 'string') return target[prop];
                if (target[prop] !== undefined) return target[prop];
                if (fallback[prop] !== undefined) return fallback[prop];
                return prop;
            }
        });
    }

    // ================== ИНИЦИАЛИЗАЦИЯ ==================

    async function init() {
        await loadConfig();

        // Определяем активный язык на основе настроек
        updateActiveLanguage();

        // Обновляем переводы пресетов
        updatePresetNames();

        injectSVGSprite();
        applyAll();
        if (CONFIG.panelVisible) createControlPanel();
        setupMutationObserver();
        setupHotkeys();
        setupUserScriptMenu();
        checkForUpdates(true);

        console.log(`[elGoogle v${SCRIPT_VERSION}] Запущен (язык: ${currentLang})`);
    }

    // Функция для определения активного языка
    function updateActiveLanguage() {
        if (CONFIG.menuLanguage === 'auto') {
            currentLang = browserLang;
        } else if (CONFIG.menuLanguage === 'ru' || CONFIG.menuLanguage === 'en') {
            currentLang = CONFIG.menuLanguage;
        } else {
            currentLang = browserLang;
        }

        // Устанавливаем переводы
        t = LANGUAGES[currentLang] || LANGUAGES.en;
        tt = makeSafeTranslations(t);
        t = tt;
        window.t = tt;
    }

    async function loadConfig() {
        try {
            if (!GM_API.getValue) throw new Error('GM.getValue недоступен');
            const saved = await GM_API.getValue('elGoogle_config');
            if (saved) {
                CONFIG = { ...DEFAULT_CONFIG, ...saved };
                if (!PRESETS[CONFIG.preset]) {
                    CONFIG.preset = 'custom';
                }
            }
        } catch (e) {
            console.warn('[elGoogle] Ошибка загрузки настроек:', e);
        }
    }

    async function saveConfig() {
        try {
            if (!GM_API.setValue) throw new Error('GM.setValue недоступен');
            await GM_API.setValue('elGoogle_config', CONFIG);
        } catch (e) {
            console.warn('[elGoogle] Ошибка сохранения настроек:', e);
        }
    }

    // ================== ОПРЕДЕЛЕНИЕ ПРЕСЕТА ==================

    function updatePresetType() {
        const currentStr = JSON.stringify({
            darkMode: CONFIG.darkMode,
            customLogo: CONFIG.customLogo,
            removeAI: CONFIG.removeAI,
            removeIcons: CONFIG.removeIcons,
            removeImages: CONFIG.removeImages,
            removeMail: CONFIG.removeMail
        });

        for (const [presetKey, preset] of Object.entries(PRESETS)) {
            if (!preset?.values) continue;
            if (JSON.stringify(preset.values) === currentStr) {
                CONFIG.preset = presetKey;
                return;
            }
        }

        CONFIG.preset = 'custom';
    }

    function checkIfSettingsChanged() {
        updatePresetType();
        saveConfig();
    }

    // ================== ГЛАВНАЯ ФУНКЦИЯ ПРИМЕНЕНИЯ ==================

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

    // ================== ФУНКЦИИ ПРИМЕНЕНИЯ НАСТРОЕК ==================

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
        if (state.logoApplied && CONFIG.customLogo) return;

        StyleManager.remove('elgoogle-logo-style');
        const originalLogo = document.querySelector('.lnXdpd');
        if (originalLogo) {
            originalLogo.style.display = '';
            originalLogo.style.visibility = '';
        }

        document.querySelectorAll('.elgoogle-logo-container, .elgoogle-custom-logo').forEach(el => el.remove());

        if (CONFIG.customLogo) {
            StyleManager.apply('elgoogle-logo-style', `
                .elgoogle-logo-container {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    position: relative;
                    width: 272px !important;
                    height: 92px !important;
                }

                .elgoogle-custom-logo {
                    width: 100% !important;
                    height: 100% !important;
                    background-image: url('https://raw.githubusercontent.com/ellatuk/elGoogle/refs/heads/main/xlam/elgygal_logo.png') !important;
                    background-size: contain !important;
                    background-repeat: no-repeat !important;
                    background-position: center !important;
                    cursor: pointer;
                    transition: opacity 0.3s ease;
                }

                .elgoogle-custom-logo.fade-in {
                    animation: logoFadeIn 0.5s ease-out forwards;
                }

                @keyframes logoFadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `);

            setTimeout(() => {
                const logoElement = document.querySelector('.lnXdpd');
                if (logoElement && !document.querySelector('.elgoogle-custom-logo')) {
                    logoElement.style.display = 'none';
                    logoElement.style.visibility = 'hidden';

                    const logoContainer = document.createElement('div');
                    logoContainer.className = 'elgoogle-logo-container';

                    const customLogo = document.createElement('div');
                    customLogo.className = 'elgoogle-custom-logo fade-in';
                    customLogo.setAttribute('aria-label', 'Google');
                    customLogo.setAttribute('role', 'img');
                    customLogo.title = 'elGoogle Custom Logo';

                    logoContainer.appendChild(customLogo);
                    logoElement.parentNode.insertBefore(logoContainer, logoElement);

                    state.logoApplied = true;
                }
            }, 150);
        } else {
            state.logoApplied = false;
            if (originalLogo) {
                originalLogo.style.display = '';
                originalLogo.style.visibility = '';
            }
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
        if (state.panel) {
            state.panel.classList.remove('theme-dark', 'theme-light', 'theme-blue', 'theme-olive', 'theme-brown', 'theme-indigo');
            state.panel.classList.add(`theme-${CONFIG.menuTheme}`);
        }
    }

    function applyMenuGlass() {
        if (state.panel) {
            if (CONFIG.glassEffect) {
                state.panel.classList.add('glass');
                state.panel.classList.remove('no-glass');
            } else {
                state.panel.classList.add('no-glass');
                state.panel.classList.remove('glass');
            }
        }
    }

    function applyCompactMode() {
        if (state.panel) {
            state.panel.classList.toggle('compact', CONFIG.compactMode);
        }
    }

    function updateRemovedElements() {
        const aiButton = document.querySelector('button[jsname="B6rgad"]');
        if (aiButton) aiButton.style.display = CONFIG.removeAI ? 'none' : '';

        document.querySelectorAll('div[jsname="UdfVXc"].WC2Die').forEach(el => {
            el.style.display = CONFIG.removeIcons ? 'none' : '';
        });

        const imagesLink = document.querySelector('a.gb_Z[data-pid="2"], a[aria-label*="картинк" i], a[href*="imghp"]');
        if (imagesLink) {
            const parent = imagesLink.closest('div.gb_0') || imagesLink.parentElement;
            if (parent) parent.style.display = CONFIG.removeImages ? 'none' : '';
        }

        const mailLink = document.querySelector('a.gb_Z[data-pid="23"], a[aria-label*="почт" i], a[href*="mail.google.com"]');
        if (mailLink) {
            const parent = mailLink.closest('div.gb_0') || mailLink.parentElement;
            if (parent) parent.style.display = CONFIG.removeMail ? 'none' : '';
        }
    }

    // ================== SVG-СПРАЙТ ==================

    function injectSVGSprite() {
        if (document.getElementById('el-svg-sprite')) return;

        const sprite = document.createElement('div');
        sprite.id = 'el-svg-sprite';
        sprite.style.display = 'none';
        sprite.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg">
                <!-- Все символы SVG остаются без изменений -->
                <symbol id="i-javascript" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
                </symbol>

                <symbol id="i-simpleicons" viewBox="0 0 24 24">
                    <path d="M12 0C8.688 0 6 2.688 6 6s2.688 6 6 6c4.64-.001 7.526 5.039 5.176 9.04h1.68A7.507 7.507 0 0 0 12 10.5 4.502 4.502 0 0 1 7.5 6c0-2.484 2.016-4.5 4.5-4.5s4.5 2.016 4.5 4.5H18c0-3.312-2.688-6-6-6Zm0 3a3 3 0 0 0 0 6c4 0 4-6 0-6Zm0 1.5A1.5 1.5 0 0 1 13.5 6v.002c-.002 1.336-1.617 2.003-2.561 1.058C9.995 6.115 10.664 4.5 12 4.5ZM7.5 15v1.5H9v6H4.5V24h15v-1.5H15v-6h1.5V15Zm3 1.5h3v6h-3zm-6 1.47c0 1.09.216 2.109.644 3.069h1.684A5.957 5.957 0 0 1 6 17.97Z"/>
                </symbol>

                <symbol id="i-tampermonkey" viewBox="0 0 24 24">
                    <path d="M5.955.002C3-.071.275 2.386.043 5.335c-.069 3.32-.011 6.646-.03 9.969.06 1.87-.276 3.873.715 5.573 1.083 2.076 3.456 3.288 5.77 3.105 4.003-.011 8.008.022 12.011-.017 2.953-.156 5.478-2.815 5.482-5.772-.007-4.235.023-8.473-.015-12.708C23.82 2.533 21.16.007 18.205.003c-4.083-.005-8.167 0-12.25-.002zm.447 12.683c2.333-.046 4.506 1.805 4.83 4.116.412 2.287-1.056 4.716-3.274 5.411-2.187.783-4.825-.268-5.874-2.341-1.137-2.039-.52-4.827 1.37-6.197a4.896 4.896 0 012.948-.99zm11.245 0c2.333-.046 4.505 1.805 4.829 4.116.413 2.287-1.056 4.716-3.273 5.411-2.188.783-4.825-.268-5.875-2.341-1.136-2.039-.52-4.827 1.37-6.197a4.896 4.896 0 012.949-.99z"/>
                </symbol>

                <symbol id="i-lucide" viewBox="0 0 24 24">
                    <path d="M18.483 1.123a1.09 1.09 0 0 0-.752.362 1.09 1.09 0 0 0 .088 1.54 11.956 11.956 0 0 1 4 8.946 7.62 7.62 0 0 1-7.637 7.636 7.62 7.62 0 0 1-7.637-7.636 3.255 3.255 0 0 1 3.273-3.273c1.82 0 3.273 1.45 3.273 3.273a1.09 1.09 0 0 0 1.09 1.09 1.09 1.09 0 0 0 1.092-1.09c0-3-2.455-5.455-5.455-5.455s-5.454 2.455-5.454 5.455c0 5.408 4.408 9.818 9.818 9.818 5.41 0 9.818-4.41 9.818-9.818A14.16 14.16 0 0 0 19.272 1.4a1.09 1.09 0 0 0-.789-.277ZM9.818 2.15C4.408 2.151 0 6.561 0 11.97a14.16 14.16 0 0 0 4.8 10.637 1.09 1.09 0 0 0 1.54-.096 1.09 1.09 0 0 0-.095-1.54 11.957 11.957 0 0 1-4.063-9 7.62 7.62 0 0 1 7.636-7.637 7.62 7.62 0 0 1 7.637 7.636 3.256 3.256 0 0 1-3.273 3.273 3.256 3.256 0 0 1-3.273-3.273 1.09 1.09 0 0 0-1.09-1.09 1.09 1.09 0 0 0-1.092 1.09c0 3 2.455 5.455 5.455 5.455s5.454-2.455 5.454-5.455c0-5.408-4.408-9.818-9.818-9.818z"/>
                </symbol>

                <symbol id="i-sliders" viewBox="0 0 24 24">
                    <line x1="4" x2="4" y1="21" y2="14"/>
                    <line x1="4" x2="4" y1="10" y2="3"/>
                    <line x1="12" x2="12" y1="21" y2="12"/>
                    <line x1="12" x2="12" y1="8" y2="3"/>
                    <line x1="20" x2="20" y1="21" y2="16"/>
                    <line x1="20" x2="20" y1="12" y2="3"/>
                    <line x1="1" x2="7" y1="14" y2="14"/>
                    <line x1="9" x2="15" y1="8" y2="8"/>
                    <line x1="17" x2="23" y1="16" y2="16"/>
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
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
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

                <symbol id="i-settings-2" viewBox="0 0 24 24">
                    <path d="M20 7h-9"/>
                    <path d="M14 17H5"/>
                    <circle cx="17" cy="17" r="3"/>
                    <circle cx="7" cy="7" r="3"/>
                </symbol>

                <symbol id="i-layout-list" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <line x1="9" y1="8" x2="21" y2="8"/>
                    <line x1="9" y1="12" x2="21" y2="12"/>
                    <line x1="9" y1="16" x2="21" y2="16"/>
                    <line x1="5" y1="8" x2="7" y2="8"/>
                    <line x1="5" y1="12" x2="7" y2="12"/>
                    <line x1="5" y1="16" x2="7" y2="16"/>
                </symbol>

                <symbol id="i-brush-cleaning" viewBox="0 0 24 24">
                    <path d="M20 6.5a2.5 2.5 0 0 0-2.5-2.5"/>
                    <path d="M17.5 4a2.5 2.5 0 0 0-2.5 2.5"/>
                    <path d="m4 20 10-10"/>
                    <path d="M11 13 7 17l-3-1 1-3 4-4"/>
                    <path d="m14 10 6-6"/>
                    <path d="M9 21a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2H9Z"/>
                </symbol>

                <symbol id="i-house-heart" viewBox="0 0 24 24">
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <path d="M14 15h-4c-.5 0-1-.5-1-1s.5-1 1-1h4c.5 0 1 .5 1 1s-.5 1-1 1"/>
                    <path d="M16 11a3 3 0 0 0-6 0"/>
                </symbol>

                <symbol id="i-wrench" viewBox="0 0 24 24">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </symbol>

                <symbol id="i-leafy-green" viewBox="0 0 24 24">
                    <path d="M2 22c1.25-.987 2.27-1.975 3.9-2.2a5.56 5.56 0 0 1 3.8 1.5 4 4 0 0 0 6.187-2.353 3.5 3.5 0 0 0 3.69-5.116A3.5 3.5 0 0 0 20.95 8 3.5 3.5 0 1 0 16 3.05a3.5 3.5 0 0 0-5.831 1.373 3.5 3.5 0 0 0-5.116 3.69 4 4 0 0 0-2.348 6.155C3.499 15.42 4.409 16.712 4.2 18.1 3.926 19.743 3.014 20.732 2 22"/>
                    <path d="M2 22 17 7"/>
                </symbol>

                <symbol id="i-heart" viewBox="0 0 24 24">
                    <defs>
                        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#fe2a3e"/>
                            <stop offset="100%" stop-color="#ff6b7a"/>
                        </linearGradient>
                        <filter id="heartGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="blur"/>
                            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                        </filter>
                    </defs>
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-1.05 1.05-1.05-1.05a5.4 5.4 0 0 0-7.65 7.65l1.05 1.05 7.65 7.65 7.65-7.65 1.05-1.05a5.4 5.4 0 0 0 0-7.65z" fill="url(#heartGradient)" filter="url(#heartGlow)"/>
                </symbol>

                <symbol id="i-languages" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </symbol>
            </svg>
        `;
        document.body.appendChild(sprite);
    }

    // ================== ПАНЕЛЬ УПРАВЛЕНИЯ ==================

    function createControlPanel() {
        if (state.panel) state.panel.remove();

        state.panel = document.createElement('div');
        state.panel.className = `elgoogle-panel ${CONFIG.panelVisible ? '' : 'hidden'}`;
        state.panel.style.top = CONFIG.panelTop;
        state.panel.style.left = CONFIG.panelLeft;

        state.panel.innerHTML = `
            <div class="u-flex u-justify-between u-items-center u-px-5 u-py-4 u-border-b u-border-white-10 u-cursor-move u-shell-header" id="elgoogle-drag-handle">
                <div class="u-flex u-items-center u-gap-2-5">
                    <div class="logo-icon"></div>
                    <div class="u-flex u-items-baseline u-gap-1-5">
                        <span class="title-main u-font-semibold u-text-lg">elGoogle</span>
                        <span class="title-version u-text-xs u-opacity-60 u-font-normal u-tight">v${SCRIPT_VERSION}</span>
                    </div>
                </div>
                <button class="panel-close u-btn-icon u-rounded-full u-bg-white-10 hover:u-bg-white-20" title="Закрыть (Esc)">
                    <svg class="el-icon"><use href="#i-close"></use></svg>
                </button>
            </div>

            <div class="u-flex u-px-4 u-border-b u-border-white-10 u-bg-black-15 u-shell-tabs">
                <button class="u-tab-btn u-flex-1 u-flex u-items-center u-justify-center u-gap-2 u-px-4 u-py-3 ${state.activeTab === 'general' ? 'is-active' : ''}" data-tab="general">
                    <svg class="el-icon"><use href="#i-sliders"></use></svg>
                    ${tt.general}
                </button>
                <button class="u-tab-btn u-flex-1 u-flex u-items-center u-justify-center u-gap-2 u-px-4 u-py-3 ${state.activeTab === 'search' ? 'is-active' : ''}" data-tab="search">
                    <svg class="el-icon"><use href="#i-search"></use></svg>
                    ${tt.search}
                </button>
                <button class="u-tab-btn u-flex-1 u-flex u-items-center u-justify-center u-gap-2 u-px-4 u-py-3 ${state.activeTab === 'menu' ? 'is-active' : ''}" data-tab="menu">
                    <svg class="el-icon"><use href="#i-menu"></use></svg>
                    ${tt.menu}
                </button>
                <button class="u-tab-btn u-flex-1 u-flex u-items-center u-justify-center u-gap-2 u-px-4 u-py-3 ${state.activeTab === 'about' ? 'is-active' : ''}" data-tab="about">
                    <svg class="el-icon"><use href="#i-info"></use></svg>
                    <span class="tab-text">${tt.about}</span>
                </button>
            </div>

            <div class="tab-content" id="tabContent"></div>

            <div class="u-flex u-items-center u-px-5 u-py-3 u-border-t u-border-white-10 u-bg-black-10 u-shell-footer">
                <button class="u-btn-icon u-rounded-md u-bg-white-10 hover:u-bg-white-20 u-mr-2 u-footer-btn" id="exportBtn" title="${tt.exportSettings}">
                    <svg class="el-icon"><use href="#i-export"></use></svg>
                </button>
                <button class="u-btn-icon u-rounded-md u-bg-white-10 hover:u-bg-white-20 u-mr-2 u-footer-btn" id="importBtn" title="${tt.importSettings}">
                    <svg class="el-icon"><use href="#i-import"></use></svg>
                </button>
                <button class="u-btn-icon u-rounded-md u-bg-white-10 hover:u-bg-white-20 u-mr-2 u-footer-btn" id="resetBtn" title="${tt.resetSettings}">
                    <svg class="el-icon"><use href="#i-list-restart"></use></svg>
                </button>
                <div class="u-flex-1 u-text-right u-text-2xs u-opacity-70 u-footer-status">
                    ${state.isCheckingUpdate ? t.checkingUpdates : t.f2Menu}
                </div>
            </div>
        `;

        document.body.appendChild(state.panel);
        renderActiveTab();
        setupPanelEvents();
        makePanelDraggable();
        applyAll();
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

        renderers[state.activeTab]?.(content);
    }

    function renderGeneralTab(container) {
        container.innerHTML = `
            <div class="tab-section">
                <h3><svg class="el-icon section-icon"><use href="#i-settings-2"></use></svg>${tt.general}</h3>

                <div class="control-group">
                    <div class="u-control-row ${CONFIG.darkMode ? 'active' : ''}" data-action="toggleDark">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-theme"></use></svg>
                            <div>
                                <div class="control-title">${t.darkTheme}</div>
                                <div class="control-description">${t.darkThemeDesc}</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.darkMode ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="u-control-row ${CONFIG.customLogo ? 'active' : ''}" data-action="toggleLogo">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-wrench"></use></svg>
                            <div>
                                <div class="control-title">${t.customLogo}</div>
                                <div class="control-description">${t.customLogoDesc}</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.customLogo ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="control-group">
                    <h4><svg class="el-icon section-icon"><use href="#i-ai"></use></svg>${t.cleaninginterface}</h4>

                    <div class="u-control-row ${CONFIG.removeAI ? 'active' : ''}" data-action="toggleAI">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-ai"></use></svg>
                            <div>
                                <div class="control-title">${t.removeAI}</div>
                                <div class="control-description">${t.removeAIDesc}</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.removeAI ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="u-control-row ${CONFIG.removeIcons ? 'active' : ''}" data-action="toggleIcons">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-icon"></use></svg>
                            <div>
                                <div class="control-title">${t.removeIcons}</div>
                                <div class="control-description">${t.removeIconsDesc}</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.removeIcons ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="u-control-row ${CONFIG.removeImages ? 'active' : ''}" data-action="toggleImages">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-image-off"></use></svg>
                            <div>
                                <div class="control-title">${t.removeImages}</div>
                                <div class="control-description">${t.removeImagesDesc}</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.removeImages ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="u-control-row ${CONFIG.removeMail ? 'active' : ''}" data-action="toggleMail">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-mail-x"></use></svg>
                            <div>
                                <div class="control-title">${t.removeMail}</div>
                                <div class="control-description">${t.removeMailDesc}</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.removeMail ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="control-group">
                    <h4><svg class="el-icon section-icon"><use href="#i-layout-list"></use></svg>${t.presets}</h4>
                    <div class="preset-buttons">
                        <button class="preset-btn ${CONFIG.preset === 'minimal' ? 'active' : ''}" data-preset="minimal">
                            <svg class="el-icon preset-icon"><use href="#i-wrench"></use></svg>
                            ${PRESETS.minimal.name}
                        </button>
                        <button class="preset-btn ${CONFIG.preset === 'clean' ? 'active' : ''}" data-preset="clean">
                            <svg class="el-icon preset-icon"><use href="#i-brush-cleaning"></use></svg>
                            ${PRESETS.clean.name}
                        </button>
                        <button class="preset-btn ${CONFIG.preset === 'full' ? 'active' : ''}" data-preset="full">
                            <svg class="el-icon preset-icon"><use href="#i-house-heart"></use></svg>
                            ${PRESETS.full.name}
                        </button>
                        <button class="preset-btn custom-preset ${CONFIG.preset === 'custom' ? 'active' : ''}" data-preset="custom">
                            <svg class="el-icon preset-icon"><use href="#i-settings"></use></svg>
                            ${PRESETS.custom.name}
                        </button>
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
                <h3><svg class="el-icon section-icon"><use href="#i-search"></use></svg>${t.searchStyle}</h3>

                <div class="control-group">
                    <div class="u-control-row ${CONFIG.searchStyleEnabled ? 'active' : ''}" data-action="toggleSearchStyle">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-check"></use></svg>
                            <div>
                                <div class="control-title">${t.searchStyleEnabled}</div>
                                <div class="control-description">${t.searchStyleEnabledDesc}</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.searchStyleEnabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="control-group">
                    <h4><svg class="el-icon section-icon"><use href="#i-theme"></use></svg>${t.searchStyle}</h4>
                    <div class="style-preview-grid">
                        ${Object.entries(SEARCH_STYLES).map(([key, style]) => `
                            <div class="style-preview ${CONFIG.searchStyle === key ? 'active' : ''}" data-style="${key}">
                                <div class="preview-box" style="${getPreviewStyle(key)}"></div>
                                <span class="preview-label">${t[`searchstyle${style.key}`] || style.key}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        setupControlHandlers(container);
    }

    function renderMenuTab(container) {
        const isAuto = CONFIG.menuLanguage === 'auto';
        const isRu = CONFIG.menuLanguage === 'ru';
        const isEn = CONFIG.menuLanguage === 'en';

        container.innerHTML = `
            <div class="tab-section">
                <h3><svg class="el-icon section-icon"><use href="#i-menu"></use></svg>${tt.panelSettings}</h3>

                <div class="control-group">
                    <h4><svg class="el-icon section-icon"><use href="#i-theme"></use></svg>${tt.theme}</h4>
                    <div class="theme-buttons">
                        <button class="theme-btn ${CONFIG.menuTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                            <div class="theme-preview dark"></div>
                            ${tt.dark}
                        </button>
                        <button class="theme-btn ${CONFIG.menuTheme === 'light' ? 'active' : ''}" data-theme="light">
                            <div class="theme-preview light"></div>
                            ${tt.light}
                        </button>
                        <button class="theme-btn ${CONFIG.menuTheme === 'blue' ? 'active' : ''}" data-theme="blue">
                            <div class="theme-preview blue"></div>
                            Blue
                        </button>
                        <button class="theme-btn ${CONFIG.menuTheme === 'indigo' ? 'active' : ''}" data-theme="indigo">
                            <div class="theme-preview indigo"></div>
                            Indigo
                        </button>
                        <button class="theme-btn ${CONFIG.menuTheme === 'olive' ? 'active' : ''}" data-theme="olive">
                            <div class="theme-preview olive"></div>
                            Olive
                        </button>
                        <button class="theme-btn ${CONFIG.menuTheme === 'brown' ? 'active' : ''}" data-theme="brown">
                            <div class="theme-preview brown"></div>
                            Brown
                        </button>
                    </div>
                </div>

                <div class="control-group">
                    <h4><svg class="el-icon section-icon"><use href="#i-languages"></use></svg>${tt.menuLanguage}</h4>
                    <div class="language-buttons">
                        <button class="language-btn ${isAuto ? 'active' : ''}" data-language="auto">
                            ${tt.auto}
                        </button>
                        <button class="language-btn ${isRu ? 'active' : ''}" data-language="ru">
                            ${tt.russian}
                        </button>
                        <button class="language-btn ${isEn ? 'active' : ''}" data-language="en">
                            ${tt.english}
                        </button>
                    </div>
                    <div class="language-description">
                        ${isAuto ? t.autoDesc : (isRu ? 'Выбран русский язык интерфейса' : 'English interface language selected')}
                    </div>
                </div>

                <div class="control-group">
                    <div class="u-control-row ${CONFIG.compactMode ? 'active' : ''}" data-action="toggleCompact">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-check"></use></svg>
                            <div>
                                <div class="control-title">${tt.compactMode}</div>
                                <div class="control-description">${tt.compactModeDesc}</div>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.compactMode ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="u-control-row ${CONFIG.glassEffect ? 'active' : ''}" data-action="toggleGlass">
                        <div class="control-label">
                            <svg class="el-icon"><use href="#i-check"></use></svg>
                            <div>
                                <div class="control-title">${tt.glassEffect}</div>
                                <div class="control-description">${tt.glassEffectDesc}</div>
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
        let versionStatus = '';
        if (state.lastReleaseInfo) {
            if (compareVersions(SCRIPT_VERSION, state.lastReleaseInfo.version) >= 0) {
                versionStatus = `<span class="status-good">${t.upToDate}</span>`;
            } else {
                versionStatus = `<span class="status-warning">${t.updateAvailable} ${state.lastReleaseInfo.version}</span>`;
            }
        } else {
            versionStatus = `<span class="status-neutral">${t.checkFailed}</span>`;
        }

        container.innerHTML = `
            <div class="tab-section">
                <h3><svg class="el-icon section-icon"><use href="#i-info"></use></svg>${tt.about}</h3>

                <div class="about-info">
                    <div class="info-item">
                        <strong>${t.currentVersion}</strong> ${SCRIPT_VERSION}
                    </div>
                    <div class="info-item">
                        <strong>${t.latestVersion}</strong> ${state.lastReleaseInfo ? state.lastReleaseInfo.version : '...'}
                        <button class="check-update-btn" id="checkUpdateBtn" ${state.isCheckingUpdate ? 'disabled' : ''}>
                            ${state.isCheckingUpdate ? t.checking : t.checkNow}
                        </button>
                    </div>
                    <div class="info-item">
                        <strong>${t.status}</strong> ${versionStatus}
                    </div>

                    <div class="info-item author-info">
                        <strong>${t.author}</strong>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <svg class="el-icon" style="width: 16px; height: 16px; margin-right: 4px;"><use href="#i-leafy-green"></use></svg>
                            <span>ellatuk</span>
                        </div>
                    </div>

                    <div class="info-item tech-item">
                        <strong>${t.technologies}</strong>
                        <div class="tech-stack">
                            <a href="https://ecma-international.org/publications-and-standards/standards/ecma-262" target="_blank" class="tech-card" title="JavaScript (ECMAScript)">
                                <svg class="tech-icon"><use href="#i-javascript"></use></svg>
                                <span class="tech-name">JavaScript</span>
                            </a>
                            <a href="https://www.tampermonkey.net/documentation.php" target="_blank" class="tech-card" title="Tampermonkey API">
                                <svg class="tech-icon"><use href="#i-tampermonkey"></use></svg>
                                <span class="tech-name">Tampermonkey</span>
                            </a>
                            <a href="https://lucide.dev" target="_blank" class="tech-card" title="Lucide Icons">
                                <svg class="tech-icon"><use href="#i-lucide"></use></svg>
                                <span class="tech-name">Lucide</span>
                            </a>
                            <a href="https://simpleicons.org" target="_blank" class="tech-card" title="Simple Icons">
                                <svg class="tech-icon"><use href="#i-simpleicons"></use></svg>
                                <span class="tech-name">Simple Icons</span>
                            </a>
                            <a href="https://unocss.dev" target="_blank" class="tech-card" title="UnoCSS">
                                <svg class="tech-icon"><use href="#i-simpleicons"></use></svg>
                                <span class="tech-name">UnoCSS</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="links-grid">
                    <a href="https://github.com/ellatuk/elGoogle" target="_blank" class="link-card repository-link">
                        <svg class="el-icon"><use href="#i-github"></use></svg>
                        <span>${t.repository}</span>
                    </a>

                    <a href="https://github.com/ellatuk" target="_blank" class="link-card author-link">
                        <svg class="el-icon"><use href="#i-user"></use></svg>
                        <span>${t.authorGitHub}</span>
                    </a>

                    <a href="https://www.youtube.com/@ellatuk" target="_blank" class="link-card youtube-link">
                        <svg class="el-icon"><use href="#i-youtube"></use></svg>
                        <span>${t.youtubeChannel}</span>
                    </a>

                    <a href="https://boosty.to/ellatuk" target="_blank" class="link-card support-link">
                        <svg class="el-icon"><use href="#i-heart"></use></svg>
                        <span>${t.supportAuthor}</span>
                    </a>
                </div>

                <div class="about-footer">
                    <p>${t.thanksForUsing}</p>
                </div>
            </div>
        `;

        container.querySelector('#checkUpdateBtn')?.addEventListener('click', () => checkForUpdates());
    }

    // ================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==================

    function getPresetDescription(preset) {
        const descriptions = {
            minimal: t.minimalDesc,
            clean: t.cleanDesc,
            full: t.fullDesc,
            custom: t.customDesc
        };
        return descriptions[preset] || '';
    }

    function getPreviewStyle(styleKey) {
        const styles = {
            'google-default': 'border-radius:24px;border:1px solid #5f6368;background:transparent;',
            'elgoogle-classic': 'border-radius:34px 14px;background:#121212;border:3px solid #1c1d1d;',
            'minimal-dark': 'border-radius:12px;background:#0a0a0a;border:1px solid #2a2a2a;',
            'glass-frosted': `border-radius:20px;background:linear-gradient(135deg,rgba(25,25,25,0.85)0%,rgba(35,35,35,0.8)100%),${NOISE_TEXTURE};backdrop-filter:blur(12px) saturate(2);border:1px solid rgba(255,255,255,0.2);`,
            'rounded-soft': 'border-radius:28px;background:linear-gradient(135deg,#121212 0%,#1a1a1a 100%);border:2px solid #2d2d2d;',
            'shadow-blur-white': 'border-radius:20px;background:rgba(18,18,18,0.95);border:1px solid rgba(255,255,255,0.15);box-shadow:0 0 32px 8px rgba(255,255,255,0.25);backdrop-filter:blur(10px);',
            'glass-morph': 'background:rgba(255,255,255,0.04);border-radius:16px;border:1px solid rgba(255,255,255,0.02);backdrop-filter:blur(5.9px);',
            'liquid-metal': 'border-radius:16px;background:linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 50%,#1a1a1a 100%);border:2px solid transparent;box-shadow:inset 0 2px 10px rgba(255,255,255,0.1),inset 0 -2px 10px rgba(0,0,0,0.5),0 5px 30px rgba(0,0,0,0.6);',
            'monochrome-crt': 'border-radius:4px;background:radial-gradient(ellipse at center,rgba(200,200,200,0.1)0%,rgba(0,0,0,0.95)100%);border:4px solid #b0b0b0;box-shadow:inset 0 0 60px rgba(255,255,255,0.2),0 0 40px rgba(255,255,255,0.3),0 0 0 3px rgba(200,200,200,0.4),inset 0 0 100px rgba(0,0,0,0.8);',
            'cyberpunk-neon': 'border-radius:18px;background:linear-gradient(135deg,#0a0a0a 0%,#151515 100%);border:1px solid transparent;box-shadow:0 4px 25px rgba(0,0,0,0.7);position:relative;'
        };
        return styles[styleKey] || '';
    }

    function setupControlHandlers(container) {
        const actions = {
            toggleDark: (value) => { CONFIG.darkMode = value; },
            toggleLogo: (value) => {
                CONFIG.customLogo = value;
                state.logoApplied = false;
            },
            toggleAI: (value) => { CONFIG.removeAI = value; },
            toggleIcons: (value) => { CONFIG.removeIcons = value; },
            toggleImages: (value) => { CONFIG.removeImages = value; },
            toggleMail: (value) => { CONFIG.removeMail = value; },
            toggleSearchStyle: (value) => { CONFIG.searchStyleEnabled = value; },
            toggleCompact: (value) => { CONFIG.compactMode = value; },
            toggleGlass: (value) => { CONFIG.glassEffect = value; }
        };

        container.querySelectorAll('[data-action]').forEach(row => {
            const action = row.dataset.action;
            const checkbox = row.querySelector('input[type="checkbox"]');

            checkbox?.addEventListener('change', async (e) => {
                const value = e.target.checked;
                actions[action]?.(value);

                await saveConfig();
                checkIfSettingsChanged();
                applyAll();
                renderActiveTab();
            });
        });

        container.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const preset = btn.dataset.preset;
                CONFIG.preset = preset;

                if (preset !== 'custom') {
                    Object.assign(CONFIG, PRESETS[preset].values);
                }

                await saveConfig();
                applyAll();
                renderActiveTab();
            });
        });

        container.querySelectorAll('.style-preview').forEach(preview => {
            preview.addEventListener('click', async () => {
                CONFIG.searchStyle = preview.dataset.style;
                await saveConfig();
                applySearchStyles();
                renderActiveTab();
            });
        });

        container.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                CONFIG.menuTheme = btn.dataset.theme;
                await saveConfig();
                applyMenuTheme();
                renderActiveTab();
            });
        });

        // Обработчики для кнопок выбора языка
        container.querySelectorAll('.language-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const lang = btn.dataset.language;
                if (CONFIG.menuLanguage !== lang) {
                    CONFIG.menuLanguage = lang;
                    await saveConfig();

                    // Обновляем активный язык и перерисовываем панель
                    updateActiveLanguage();
                    updatePresetNames();
                    renderActiveTab();

                    updateUILanguage();
                }
            });
        });
    }

    function updateUILanguage() {
        if (!state.panel) return;

        state.panel.querySelectorAll('[data-tab]').forEach(tab => {
            const tabName = tab.dataset.tab;
            if (tabName === 'general') {
                tab.innerHTML = `<svg class="el-icon"><use href="#i-sliders"></use></svg>${tt.general}`;
            } else if (tabName === 'search') {
                tab.innerHTML = `<svg class="el-icon"><use href="#i-search"></use></svg>${tt.search}`;
            } else if (tabName === 'menu') {
                tab.innerHTML = `<svg class="el-icon"><use href="#i-menu"></use></svg>${tt.menu}`;
            } else if (tabName === 'about') {
                tab.innerHTML = `<svg class="el-icon"><use href="#i-info"></use></svg><span class="tab-text">${tt.about}</span>`;
            }
        });

        const status = state.panel.querySelector('.u-footer-status');
        if (status) status.textContent = state.isCheckingUpdate ? tt.checkingUpdates : tt.f2Menu;

        const exportBtn = state.panel.querySelector('#exportBtn');
        const importBtn = state.panel.querySelector('#importBtn');
        const resetBtn = state.panel.querySelector('#resetBtn');
        if (exportBtn) exportBtn.title = tt.exportSettings;
        if (importBtn) importBtn.title = tt.importSettings;
        if (resetBtn) resetBtn.title = tt.resetSettings;
    }

    // ================== СОБЫТИЯ ПАНЕЛИ ==================

    function setupPanelEvents() {
        state.panel.querySelector('.panel-close').addEventListener('click', togglePanel);

        state.panel.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', () => {
                state.activeTab = tab.dataset.tab;
                state.panel.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('is-active'));
                tab.classList.add('is-active');

                const content = document.getElementById('tabContent');
                if (!content) {
                    renderActiveTab();
                    return;
                }

                content.classList.add('fade-out');
                setTimeout(() => {
                    renderActiveTab();
                    content.classList.remove('fade-out');
                }, 170);
            });
        });

        state.panel.querySelector('#exportBtn').addEventListener('click', exportSettings);
        state.panel.querySelector('#importBtn').addEventListener('click', importSettings);
        state.panel.querySelector('#resetBtn').addEventListener('click', resetSettings);

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && !state.panel.classList.contains('hidden')) {
                togglePanel();
            }
        });
    }

    function makePanelDraggable() {
        const dragHandle = state.panel.querySelector('#elgoogle-drag-handle');
        let isDragging = false;
        let offsetX, offsetY;
        let rafId = null;

        dragHandle.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            if (e.target.closest('button')) return;
            isDragging = true;
            const rect = state.panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
            state.panel.style.transition = 'none';
            e.preventDefault();
        }

        function onDrag(e) {
            if (!isDragging) return;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                const maxX = window.innerWidth - state.panel.offsetWidth;
                const maxY = window.innerHeight - state.panel.offsetHeight;
                state.panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
                state.panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
                rafId = null;
            });
        }

        function stopDrag() {
            if (!isDragging) return;
            isDragging = false;
            state.panel.style.transition = '';
            CONFIG.panelTop = state.panel.style.top;
            CONFIG.panelLeft = state.panel.style.left;
            saveConfig();
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }

    function togglePanel() {
        if (!state.panel) {
            CONFIG.panelVisible = true;
            createControlPanel();
            saveConfig();
            return;
        }

        const isHidden = state.panel.classList.contains('hidden');
        state.panel.classList.toggle('hidden', !isHidden);
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
                    updatePresetType();
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
            CONFIG.preset = 'full';
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
                if (CONFIG.customLogo && !state.logoApplied) {
                    applyLogo();
                }
            }, 300);
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });
        setTimeout(updateRemovedElements, 2000);
    }

    function setupHotkeys() {
        document.addEventListener('keydown', async e => {
            const key = e.key.toLowerCase();

            if (e.key === 'F2' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                togglePanel();
                return;
            }

            if (e.ctrlKey && e.altKey && key === 'r') {
                e.preventDefault();
                location.reload();
                return;
            }

            if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
                if (key === 'd') {
                    e.preventDefault();
                    CONFIG.darkMode = !CONFIG.darkMode;
                    await saveConfig();
                    applyAll();
                    if (state.panel && !state.panel.classList.contains('hidden')) renderActiveTab();
                    return;
                }

                if (key === 'l') {
                    e.preventDefault();
                    CONFIG.customLogo = !CONFIG.customLogo;
                    await saveConfig();
                    applyAll();
                    if (state.panel && !state.panel.classList.contains('hidden')) renderActiveTab();
                    return;
                }

                if (key === 'r') {
                    e.preventDefault();
                    resetSettings();
                }
            }
        });
    }

    function setupUserScriptMenu() {
        if (!GM_API.registerMenuCommand) {
            console.warn('[elGoogle] GM.registerMenuCommand недоступен, меню скрипта отключено');
            return;
        }
        try {
            GM_API.registerMenuCommand('🎨 Открыть панель elGoogle', togglePanel, 'f2');
            GM_API.registerMenuCommand('🔄 Проверить обновления', () => checkForUpdates());
            GM_API.registerMenuCommand('📋 Экспорт настроек', exportSettings);
            GM_API.registerMenuCommand('🗑️ Сбросить все настройки', resetSettings);
        } catch (e) {
            console.warn('[elGoogle] Ошибка создания меню:', e);
        }
    }

    // ================== ПРОВЕРКА ОБНОВЛЕНИЙ ==================

    async function checkForUpdates(silent = false) {
        if (state.isCheckingUpdate) return;

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (!silent && (now - CONFIG.lastVersionCheck < oneDay)) {
            if (!silent) alert('Проверка обновлений доступна раз в сутки');
            return;
        }

        state.isCheckingUpdate = true;

        try {
            const latestRelease = await getLatestRelease();
            state.lastReleaseInfo = latestRelease;
            CONFIG.lastVersionCheck = now;
            await saveConfig();

            if (!silent) renderAboutTab(document.getElementById('tabContent'));
        } catch (error) {
            console.warn('[elGoogle] Ошибка проверки обновлений:', error);
            if (!silent) alert('Не удалось проверить обновления. Попробуйте позже.');
        } finally {
            state.isCheckingUpdate = false;
        }
    }

    function getLatestRelease() {
        return new Promise((resolve, reject) => {
            if (!GM_API.xmlHttpRequest) {
                reject(new Error('GM.xmlHttpRequest недоступен в этом окружении'));
                return;
            }

            GM_API.xmlHttpRequest({
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

    function getUtilityStyles() {
        const spacing = { 2: '8px', 3: '12px', 4: '16px', 5: '20px' };
        const spacingCss = Object.entries(spacing).map(([k, v]) => `
            .u-px-${k} { padding-left: ${v}; padding-right: ${v}; }
            .u-py-${k} { padding-top: ${v}; padding-bottom: ${v}; }
        `).join('');

        return `
            .u-flex { display: flex; }
            .u-flex-1 { flex: 1; }
            .u-items-center { align-items: center; }
            .u-items-baseline { align-items: baseline; }
            .u-justify-between { justify-content: space-between; }
            .u-justify-center { justify-content: center; }
            .u-gap-2 { gap: 8px; }
            .u-gap-2-5 { gap: 10px; }
            .u-gap-1-5 { gap: 6px; }
            ${spacingCss}
            .u-border-b { border-bottom-width: 1px; border-bottom-style: solid; }
            .u-border-t { border-top-width: 1px; border-top-style: solid; }
            .u-border-white-10 { border-color: rgba(255, 255, 255, 0.1); }
            .u-cursor-move { cursor: move; }
            .u-font-semibold { font-weight: 600; }
            .u-font-normal { font-weight: 400; }
            .u-text-lg { font-size: 18px; }
            .u-text-xs { font-size: 13px; }
            .u-text-2xs { font-size: 12px; }
            .u-text-right { text-align: right; }
            .u-opacity-60 { opacity: 0.6; }
            .u-opacity-70 { opacity: 0.7; }
            .u-tight { letter-spacing: -0.2px; }
            .u-rounded-full { border-radius: 50%; }
            .u-rounded-md { border-radius: 6px; }
            .u-bg-white-10 { background: rgba(255, 255, 255, 0.1); }
            .u-bg-black-15 { background: rgba(0, 0, 0, 0.15); }
            .u-bg-black-10 { background: rgba(0, 0, 0, 0.1); }
            .u-mr-2 { margin-right: 8px; }
            .u-btn-icon {
                border: none;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s;
            }
            .hover\:u-bg-white-20:hover { background: rgba(255, 255, 255, 0.2); }
        `;
    }

    function getPanelStyles() {
        return `
            /* Мини-утилиты в стиле UnoCSS */
            ${getUtilityStyles()}

            .elgoogle-panel {
                --panel-bg: rgba(25, 25, 25, 0.95);
                --panel-text: #ffffff;
                --panel-border: rgba(255, 255, 255, 0.1);
                --panel-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                --accent-color: #3b82f6;

                position: fixed; z-index: 999999;
                min-width: 400px; max-width: 500px;
                font-family: 'Segoe UI', system-ui, sans-serif;
                user-select: none; border-radius: 16px;
                transition: opacity 0.3s ease, transform 0.3s ease;
                overflow: hidden;
                background: var(--panel-bg);
                color: var(--panel-text);
                border: 1px solid var(--panel-border);
                box-shadow: var(--panel-shadow);
            }

            .elgoogle-panel.hidden {
                opacity: 0; transform: translateY(-10px);
                pointer-events: none;
            }

            .elgoogle-panel.theme-dark {
                --panel-bg: rgba(25, 25, 25, 0.95);
                --panel-text: #ffffff;
                --panel-border: rgba(255, 255, 255, 0.1);
                --panel-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                --accent-color: #3b82f6;
            }

            .elgoogle-panel.theme-light {
                --panel-bg: rgba(248, 250, 255, 0.96);
                --panel-text: #111827;
                --panel-border: rgba(0, 0, 0, 0.08);
                --panel-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
                --accent-color: #2563eb;
            }

            .elgoogle-panel.theme-blue {
                --panel-bg: linear-gradient(145deg, #1a2a4a, #0f1a2f);
                --panel-text: #e0f0ff;
                --panel-border: rgba(100, 180, 255, 0.3);
                --panel-shadow: 0 10px 40px rgba(0, 40, 80, 0.4);
                --accent-color: #3b82f6;
            }

            .elgoogle-panel.theme-indigo {
                --panel-bg: linear-gradient(145deg, #2b1f5a, #1a1440);
                --panel-text: #ece8ff;
                --panel-border: rgba(167, 139, 250, 0.35);
                --panel-shadow: 0 10px 40px rgba(34, 20, 80, 0.45);
                --accent-color: #a78bfa;
            }

            .elgoogle-panel.theme-olive {
                --panel-bg: linear-gradient(145deg, #2d3e2d, #1e2a1e);
                --panel-text: #f0f5e0;
                --panel-border: rgba(180, 200, 100, 0.3);
                --panel-shadow: 0 10px 40px rgba(40, 60, 0, 0.4);
                --accent-color: #84cc16;
            }

            .elgoogle-panel.theme-brown {
                --panel-bg: linear-gradient(145deg, #3e2e1e, #2a1e12);
                --panel-text: #f5e8d0;
                --panel-border: rgba(200, 150, 100, 0.3);
                --panel-shadow: 0 10px 40px rgba(80, 40, 0, 0.4);
                --accent-color: #d97706;
            }

            .elgoogle-panel.glass {
                backdrop-filter: blur(18px) saturate(1.12) contrast(0.94) !important;
                -webkit-backdrop-filter: blur(18px) saturate(1.12) contrast(0.94) !important;
                border-color: color-mix(in srgb, var(--panel-border) 65%, white 18%) !important;
                box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45),
                           inset 0 1px 0 rgba(255, 255, 255, 0.08),
                           inset 0 -1px 0 rgba(0, 0, 0, 0.25) !important;
            }

            .elgoogle-panel.theme-dark.glass::before {
                content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: ${NOISE_TEXTURE}; opacity: 0.25; pointer-events: none;
                mix-blend-mode: overlay; z-index: -1; border-radius: inherit;
            }

            .elgoogle-panel.theme-light.glass {
                border-color: rgba(255, 255, 255, 0.35) !important;
            }

            .elgoogle-panel.theme-light.glass::before {
                content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: ${NOISE_TEXTURE}; opacity: 0.15; pointer-events: none;
                mix-blend-mode: multiply; z-index: -1; border-radius: inherit;
            }

            .elgoogle-panel.no-glass {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25) !important;
            }

            .elgoogle-panel.compact {
                min-width: 320px; max-width: 380px;
            }

            .elgoogle-panel.compact .u-px-5 { padding-left: 16px; padding-right: 16px; }
            .elgoogle-panel.compact .u-px-4 { padding-left: 12px; padding-right: 12px; }
            .elgoogle-panel.compact .u-tab-btn { padding: 8px 12px; font-size: 13px; }
            .elgoogle-panel.compact .tab-content { padding: 16px; }

            .theme-light .u-shell-header {
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .logo-icon {
                width: 40px !important; height: 40px !important;
                background-image: url('https://raw.githubusercontent.com/ellatuk/elGoogle/refs/heads/main/xlam/elGoogleLogoVector.svg');
                background-size: contain; background-repeat: no-repeat;
                background-position: center;
                filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
                transition: transform 0.3s ease, filter 0.3s ease;
            }

            .u-shell-header:hover .logo-icon {
                transform: scale(1.1);
                filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
            }

            .theme-light .logo-icon {
                filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3));
            }

            .theme-light .panel-close { background: rgba(0, 0, 0, 0.1); }
            .panel-close:hover {
                transform: scale(1.05);
            }
            .theme-light .panel-close:hover { background: rgba(0, 0, 0, 0.2); }

            .u-shell-tabs { border-radius: 16px 16px 0 0; }

            .theme-light .u-shell-tabs {
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                background: rgba(0, 0, 0, 0.05);
            }

            .u-tab-btn {
                background: none; border: none; color: inherit;
                cursor: pointer; font-size: 14px; transition: all 0.2s;
                border-bottom: 2px solid transparent; opacity: 0.7;
                white-space: nowrap;
            }

            .tab-text {
                display: inline-block;
            }

            .u-tab-btn:hover {
                opacity: 1; background: rgba(255, 255, 255, 0.08);
                transform: translateY(-1px);
            }

            .theme-light .u-tab-btn:hover { background: rgba(0, 0, 0, 0.08); }

            .u-tab-btn.is-active {
                opacity: 1; border-bottom-color: var(--accent-color, #1a73e8);
                background: color-mix(in srgb, var(--accent-color, #1a73e8) 18%, transparent);
            }

            .tab-content {
                padding: 20px; max-height: 60vh; overflow-y: auto;
                transition: opacity 0.2s ease, transform 0.2s ease;
            }
            .tab-content.fade-out {
                opacity: 0;
                transform: translateY(4px);
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

            .u-control-row {
                display: flex; justify-content: space-between;
                align-items: center; padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                transition: background .15s, transform .12s;
                cursor: pointer; border-radius: 8px; margin: 2px 0;
                padding-left: 12px; padding-right: 12px;
            }

            .theme-light .u-control-row {
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            }

            .u-control-row:hover {
                background: rgba(255, 255, 255, 0.08);
                transform: translateX(2px);
            }

            .theme-light .u-control-row:hover {
                background: rgba(0, 0, 0, 0.08);
            }

            .u-control-row.active {
                background: color-mix(in srgb, var(--accent-color, #1a73e8) 18%, transparent);
            }

            .control-label {
                display: flex; align-items: center; gap: 10px;
                flex: 1;
            }

            .control-title {
                font-size: 14px; color: inherit;
            }

            .control-description {
                font-size: 13px; opacity: 0.75; margin-top: 4px;
            }

            .el-icon {
                width: 18px; height: 18px;
                stroke: currentColor; fill: none;
                stroke-width: 2; stroke-linecap: round;
                stroke-linejoin: round;
                flex-shrink: 0;
            }

            .tech-icon {
                width: 30px; height: 30px;
                fill: currentColor;
                stroke: none;
            }

            .tech-name {
                font-size: 10px;
                text-align: center;
                white-space: normal;
                word-break: break-word;
                width: 100%;
                line-height: 1.3;
            }

            .section-icon {
                width: 20px; height: 20px; opacity: 0.9;
            }

            .preset-icon {
                width: 16px; height: 16px;
                margin-right: 6px;
            }

            .author-info {
                display: flex; align-items: center;
                justify-content: space-between;
            }

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

            input:checked + .slider { background-color: var(--accent-color, #1a73e8); }

            input:checked + .slider:before {
                transform: translateX(26px);
            }

            .preset-buttons {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-bottom: 12px;
            }

            .custom-preset {
                grid-column: 1 / -1;
                justify-self: stretch;
                width: 100%;
                max-width: 100%;
                min-width: 0;
            }

            .preset-btn {
                padding: 10px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: inherit; cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .theme-light .preset-btn {
                background: rgba(0, 0, 0, 0.05);
                border-color: rgba(0, 0, 0, 0.1);
            }

            .preset-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }

            .theme-light .preset-btn:hover {
                background: rgba(0, 0, 0, 0.1);
            }

            .preset-btn.active {
                background: var(--accent-color, #1a73e8);
                border-color: var(--accent-color, #1a73e8);
                color: white;
                box-shadow: 0 4px 12px color-mix(in srgb, var(--accent-color, #1a73e8) 45%, transparent);
            }

            .preset-description {
                font-size: 13px;
                opacity: 0.8;
                padding: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                border-left: 3px solid var(--accent-color, #1a73e8);
            }

            .theme-light .preset-description {
                background: rgba(0, 0, 0, 0.05);
                border-left: 3px solid color-mix(in srgb, var(--accent-color, #1a73e8) 55%, transparent);
            }

            .style-preview-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 12px; }
            .style-preview {
                cursor: pointer; border: 2px solid transparent; border-radius: 10px;
                padding: 12px; transition: all 0.2s; background: rgba(255, 255, 255, 0.05);
            }
            .theme-light .style-preview { background: rgba(0, 0, 0, 0.05); }
            .style-preview:hover {
                background: rgba(255, 255, 255, 0.1); transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            .theme-light .style-preview:hover { background: rgba(0, 0, 0, 0.1); }
            .style-preview.active {
                border-color: var(--accent-color, #1a73e8); background: color-mix(in srgb, var(--accent-color, #1a73e8) 12%, transparent);
                box-shadow: 0 4px 12px color-mix(in srgb, var(--accent-color, #1a73e8) 35%, transparent);
            }
            .preview-box {
                width: 100%; height: 40px; border-radius: 8px;
                margin-bottom: 8px; transition: all 0.3s;
                position: relative; overflow: hidden;
            }
            .preview-label {
                display: block; text-align: center; font-size: 13px;
                opacity: 0.9; font-weight: 500;
            }

            .theme-buttons {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 12px;
                margin-top: 12px;
            }
            .theme-btn {
                width: 100%;
                display: flex; flex-direction: column;
                align-items: center; gap: 8px; padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid transparent; border-radius: 10px;
                cursor: pointer; transition: all 0.2s;
            }
            .theme-light .theme-btn { background: rgba(0, 0, 0, 0.05); }
            .theme-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px);
            }
            .theme-light .theme-btn:hover { background: rgba(0, 0, 0, 0.1); }
            .theme-btn.active {
                border-color: var(--accent-color, #1a73e8); background: color-mix(in srgb, var(--accent-color, #1a73e8) 12%, transparent);
                box-shadow: 0 4px 12px color-mix(in srgb, var(--accent-color, #1a73e8) 35%, transparent);
            }
            .theme-preview { width: 60px; height: 40px; border-radius: 6px; }
            .theme-preview.dark { background: #1a1a1a; border: 1px solid #333; }
            .theme-preview.light { background: #f5f5f5; border: 1px solid #ddd; }
            .theme-preview.blue { background: linear-gradient(145deg, #1a2a4a, #0f1a2f); border: 1px solid rgba(100, 180, 255, 0.35); }
            .theme-preview.indigo { background: linear-gradient(145deg, #2b1f5a, #1a1440); border: 1px solid rgba(167, 139, 250, 0.4); }
            .theme-preview.olive { background: linear-gradient(145deg, #2d3e2d, #1e2a1e); border: 1px solid rgba(180, 200, 100, 0.35); }
            .theme-preview.brown { background: linear-gradient(145deg, #3e2e1e, #2a1e12); border: 1px solid rgba(200, 150, 100, 0.35); }

            .language-buttons {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-top: 12px;
            }

            .language-btn {
                padding: 10px 8px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid transparent;
                border-radius: 8px;
                color: inherit;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 13px;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .theme-light .language-btn {
                background: rgba(0, 0, 0, 0.05);
            }

            .language-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px);
            }

            .theme-light .language-btn:hover {
                background: rgba(0, 0, 0, 0.1);
            }

            .language-btn.active {
                border-color: var(--accent-color, #1a73e8);
                background: color-mix(in srgb, var(--accent-color, #1a73e8) 12%, transparent);
                box-shadow: 0 4px 12px color-mix(in srgb, var(--accent-color, #1a73e8) 35%, transparent);
            }

            .language-description {
                font-size: 13px;
                opacity: 0.8;
                padding: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                border-left: 3px solid var(--accent-color, #1a73e8);
                margin-top: 8px;
            }

            .theme-light .language-description {
                background: rgba(0, 0, 0, 0.05);
                border-left: 3px solid color-mix(in srgb, var(--accent-color, #1a73e8) 55%, transparent);
            }

            .about-info {
                background: rgba(255, 255, 255, 0.05); border-radius: 10px;
                padding: 20px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.1);
                color: #fff !important;
            }

            .theme-light .about-info {
                background: rgba(0, 0, 0, 0.05);
                border: 1px solid rgba(0, 0, 0, 0.1);
                color: #333 !important;
            }

            .about-info * {
                color: inherit !important;
            }

            .info-item {
                display: flex; justify-content: flex-start;
                align-items: center; padding: 10px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                gap: 10px;
            }
            .theme-light .info-item {
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            }
            .info-item:last-child { border-bottom: none; }

            .tech-item {
                display: block;
                margin-top: 15px;
            }

            .tech-item strong {
                display: block;
                margin-bottom: 12px;
                font-size: 14px;
                opacity: 0.9;
            }

            .tech-stack {
                display: grid;
                grid-template-columns: repeat(5, minmax(0, 1fr));
                gap: 12px;
                margin-top: 10px;
            }

            .tech-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 12px 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                text-decoration: none;
                color: #fff !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid rgba(255, 255, 255, 0.1);
                min-height: 80px;
                position: relative;
                overflow: hidden;
            }

            .tech-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                transition: left 0.6s ease;
            }

            .tech-card:hover::before {
                left: 100%;
            }

            .theme-light .tech-card {
                background: rgba(0, 0, 0, 0.05);
                border: 1px solid rgba(0, 0, 0, 0.1);
                color: #333 !important;
            }

            .tech-card:hover {
                transform: translateY(-4px) scale(1.05);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
                text-decoration: none;
                z-index: 2;
            }

            .tech-card:nth-child(1) {
                border-color: rgba(247, 223, 30, 0.3);
            }

            .tech-card:nth-child(1):hover {
                background: rgba(247, 223, 30, 0.2);
                border-color: rgba(247, 223, 30, 0.6);
                box-shadow: 0 8px 32px rgba(247, 223, 30, 0.4);
            }

            .tech-card:nth-child(2) {
                border-color: rgba(0, 72, 91, 0.3);
            }

            .tech-card:nth-child(2):hover {
                background: rgba(0, 72, 91, 0.2);
                border-color: rgba(0, 72, 91, 0.8);
                box-shadow: 0 8px 32px rgba(0, 72, 91, 0.5);
            }

            .tech-card:nth-child(3) {
                border-color: rgba(254, 42, 62, 0.3);
            }

            .tech-card:nth-child(3):hover {
                background: rgba(254, 42, 62, 0.2);
                border-color: rgba(254, 42, 62, 0.8);
                box-shadow: 0 8px 32px rgba(254, 42, 62, 0.5);
            }

            .tech-card:nth-child(4) {
                border-color: rgba(0, 0, 0, 0.3);
            }

            .tech-card:nth-child(4):hover {
                background: rgba(0, 0, 0, 0.2);
                border-color: rgba(0, 0, 0, 0.8);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            }

            .tech-card:nth-child(5) {
                border-color: rgba(167, 139, 250, 0.35);
            }

            .tech-card:nth-child(5):hover {
                background: rgba(167, 139, 250, 0.2);
                border-color: rgba(167, 139, 250, 0.8);
                box-shadow: 0 8px 32px rgba(167, 139, 250, 0.45);
            }

            .check-update-btn {
                padding: 4px 12px; background: rgba(26, 115, 232, 0.2);
                border: 1px solid #1a73e8; border-radius: 6px;
                color: inherit; cursor: pointer; font-size: 12px;
                transition: background 0.2s;
            }
            .check-update-btn:hover:not(:disabled) {
                background: rgba(26, 115, 232, 0.3);
                transform: scale(1.05);
            }
            .check-update-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            .status-good { color: #34a853 !important; }
            .status-warning { color: #fbbc05 !important; }
            .status-neutral { opacity: 0.7; }

            .links-grid {
                display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 20px 0;
            }
            .link-card {
                display: flex; flex-direction: column; align-items: center;
                gap: 10px; padding: 16px; border-radius: 10px;
                text-decoration: none; color: #fff !important;
                transition: all 0.2s; border: 1px solid rgba(255, 255, 255, 0.1);
                position: relative; overflow: hidden;
            }

            .link-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                transition: left 0.6s ease;
            }

            .link-card:hover::before {
                left: 100%;
            }

            .theme-light .link-card {
                color: #333 !important;
                border: 1px solid rgba(0, 0, 0, 0.1);
            }

            .link-card:hover {
                transform: translateY(-2px); text-decoration: none;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }

            .link-card .el-icon { width: 24px; height: 24px; }
            .link-card span { font-size: 13px; text-align: center; opacity: 0.9; }

            .repository-link {
                background: rgba(255, 255, 255, 0.05) !important;
                border-color: rgba(255, 255, 255, 0.2) !important;
            }
            .repository-link:hover {
                background: rgba(255, 255, 255, 0.15) !important;
                border-color: #ffffff !important;
            }

            .author-link {
                background: rgba(57, 100, 254, 0.1) !important;
                border-color: rgba(57, 100, 254, 0.3) !important;
            }
            .author-link:hover {
                background: rgba(57, 100, 254, 0.2) !important;
                border-color: #3964fe !important;
            }

            .youtube-link {
                background: rgba(254, 0, 50, 0.1) !important;
                border-color: rgba(254, 0, 50, 0.3) !important;
            }
            .youtube-link:hover {
                background: rgba(254, 0, 50, 0.2) !important;
                border-color: #fe0032 !important;
            }

            .support-link {
                background: rgba(254, 42, 62, 0.1) !important;
                border-color: rgba(254, 42, 62, 0.3) !important;
            }
            .support-link:hover {
                background: rgba(254, 42, 62, 0.2) !important;
                border-color: #fe2a3e !important;
            }

            .theme-light .repository-link {
                background: rgba(0, 0, 0, 0.05) !important;
                border-color: rgba(0, 0, 0, 0.2) !important;
            }
            .theme-light .author-link {
                background: rgba(57, 100, 254, 0.08) !important;
                border-color: rgba(57, 100, 254, 0.2) !important;
            }
            .theme-light .youtube-link {
                background: rgba(254, 0, 50, 0.08) !important;
                border-color: rgba(254, 0, 50, 0.2) !important;
            }
            .theme-light .support-link {
                background: rgba(254, 42, 62, 0.08) !important;
                border-color: rgba(254, 42, 62, 0.2) !important;
            }

            .about-footer {
                margin-top: 20px; padding-top: 16px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 13px; opacity: 0.8; text-align: center;
            }
            .theme-light .about-footer { border-top: 1px solid rgba(0, 0, 0, 0.1); }

            .u-shell-footer { border-radius: 0 0 16px 16px; }
            .theme-light .u-shell-footer {
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                background: rgba(0, 0, 0, 0.05);
            }
            .theme-light .u-footer-btn { background: rgba(0, 0, 0, 0.1); }
            .u-footer-btn:hover {
                transform: scale(1.05);
            }
            .theme-light .u-footer-btn:hover { background: rgba(0, 0, 0, 0.2); }

            /* Стили полосы прокрутки */
            .tab-content::-webkit-scrollbar {
                width: 8px;
            }

            .tab-content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }

            .tab-content::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
            }

            .tab-content::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .tab-content {
                scrollbar-width: thin;
                scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
            }

            .theme-light .tab-content::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.05);
            }

            .theme-light .tab-content::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.2);
            }

            .theme-light .tab-content::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.3);
            }

            .theme-light .tab-content {
                scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05);
            }


            @media (max-width: 640px) {
                .elgoogle-panel {
                    min-width: min(90vw, 360px);
                    max-width: 90vw;
                    left: 5vw !important;
                }

                .tab-content {
                    max-height: 50vh;
                }

                .u-tab-btn {
                    font-size: 12px;
                    padding: 8px 10px;
                    gap: 6px;
                }
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
