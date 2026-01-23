// ==UserScript==
// @name              elGoogle beta
// @name:ru-RU        elГугал beta
// @namespace         https://github.com/ellatuk/elGoogle
// @version           2.1
// @description       Улучшение интерфейса Google
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

(async function () {
  'use strict';

  /* =========================
     CONFIG
  ========================= */

  const DEFAULT_CONFIG = {
    search: {
      enabled: true,
      style: 'classic'
    },
    menu: {
      theme: 'dark',
      glass: false,
      compact: false,
      accent: '#1a73e8'
    }
  };

  let CONFIG = await GM.getValue('elGoogleConfig', DEFAULT_CONFIG);

  async function saveConfig() {
    await GM.setValue('elGoogleConfig', CONFIG);
  }

  /* =========================
     STATE
  ========================= */

  const UI = {
    open: false,
    tab: 'search'
  };

  /* =========================
     SEARCH STYLES
  ========================= */

  const SEARCH_STYLES = [
    { id: 'native', label: 'Google (родной)' },
    { id: 'classic', label: 'elGoogle Classic' },
    { id: 'minimal', label: 'Minimal Dark' },
    { id: 'glass', label: 'Glass' },
    { id: 'soft', label: 'Soft UI' }
  ];

  function applySearch() {
    document.body.classList.remove(
      'el-search-classic',
      'el-search-minimal',
      'el-search-glass',
      'el-search-soft'
    );

    if (!CONFIG.search.enabled || CONFIG.search.style === 'native') return;

    document.body.classList.add(`el-search-${CONFIG.search.style}`);
  }

  /* =========================
     PANEL
  ========================= */

  const panel = document.createElement('div');
  panel.className = 'el-panel dark';
  document.body.append(panel);

  function togglePanel() {
    UI.open = !UI.open;
    panel.style.display = UI.open ? 'block' : 'none';
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'F2') {
      e.preventDefault();
      togglePanel();
    }
  });

  GM.registerMenuCommand('Открыть elGoogle (F2)', togglePanel);

  /* =========================
     RENDER
  ========================= */

  function render() {
    panel.innerHTML = `
      <div class="el-tabs">
        ${tabBtn('search', 'Поиск')}
        ${tabBtn('menu', 'Меню')}
        ${tabBtn('about', 'О плагине')}
      </div>
      <div class="el-content">
        ${UI.tab === 'search' ? renderSearch() : ''}
        ${UI.tab === 'menu' ? renderMenu() : ''}
        ${UI.tab === 'about' ? renderAbout() : ''}
      </div>
    `;
  }

  function tabBtn(id, label) {
    return `<button class="${UI.tab === id ? 'active' : ''}" data-tab="${id}">${label}</button>`;
  }

  panel.addEventListener('click', async e => {
    const tab = e.target.dataset.tab;
    if (tab) {
      UI.tab = tab;
      render();
    }
  });

  /* =========================
     SEARCH TAB
  ========================= */

  function renderSearch() {
    return `
      <h3>Поиск</h3>
      <label>
        <input type="checkbox" ${CONFIG.search.enabled ? 'checked' : ''} id="searchEnabled">
        Включить стили поиска
      </label>
      <div class="el-grid">
        ${SEARCH_STYLES.map(s => `
          <div class="el-card ${CONFIG.search.style === s.id ? 'active' : ''}" data-style="${s.id}">
            <div class="preview ${s.id}"></div>
            ${s.label}
          </div>
        `).join('')}
      </div>
    `;
  }

  /* =========================
     MENU TAB
  ========================= */

  function renderMenu() {
    return `
      <h3>Меню</h3>
      <label><input type="checkbox" ${CONFIG.menu.theme === 'dark' ? 'checked' : ''} id="theme"> Тёмная тема</label><br>
      <label><input type="checkbox" ${CONFIG.menu.glass ? 'checked' : ''} id="glass"> Жидкое стекло</label><br>
      <label><input type="checkbox" ${CONFIG.menu.compact ? 'checked' : ''} id="compact"> Compact mode</label><br><br>

      <button id="export">Экспорт настроек</button>
      <button id="import">Импорт настроек</button>
      <button id="reset">Сброс</button>
    `;
  }

  /* =========================
     ABOUT TAB
  ========================= */

  function renderAbout() {
    return `
      <h3>О плагине</h3>
      <p>Автор: <b>ellatuk</b></p>
      <p><a href="https://github.com/ellatuk/elGoogle" target="_blank">GitHub проекта</a></p>
      <p><a href="https://github.com/ellatuk" target="_blank">GitHub автора</a></p>
      <p><a href="https://www.youtube.com/@ellatuk" target="_blank">YouTube канал</a></p>
      <p>Иконки: <a href="https://lucide.dev" target="_blank">Lucide</a></p>
      <p>Язык: JavaScript</p>
      <p>Версия: ${GM_info.script.version}</p>
      <p><a href="https://boosty.to/ellatuk" target="_blank">Поддержать автора</a></p>
    `;
  }

  /* =========================
     EVENTS
  ========================= */

  panel.addEventListener('change', async e => {
    if (e.target.id === 'searchEnabled') {
      CONFIG.search.enabled = e.target.checked;
    }
    if (e.target.id === 'theme') {
      CONFIG.menu.theme = e.target.checked ? 'dark' : 'light';
      panel.classList.toggle('dark', CONFIG.menu.theme === 'dark');
    }
    if (e.target.id === 'glass') CONFIG.menu.glass = e.target.checked;
    if (e.target.id === 'compact') CONFIG.menu.compact = e.target.checked;

    await saveConfig();
    applySearch();
    render();
  });

  panel.addEventListener('click', async e => {
    const card = e.target.closest('.el-card');
    if (card) {
      CONFIG.search.style = card.dataset.style;
      await saveConfig();
      applySearch();
      render();
    }

    if (e.target.id === 'reset') {
      CONFIG = structuredClone(DEFAULT_CONFIG);
      await saveConfig();
      applySearch();
      render();
    }
  });

  /* =========================
     STYLES
  ========================= */

  const style = document.createElement('style');
  style.textContent = `
.el-panel {
  position:fixed;
  top:80px;
  right:20px;
  width:320px;
  background:#111;
  color:#fff;
  border-radius:16px;
  padding:14px;
  z-index:9999;
  display:none;
  box-shadow:0 20px 60px rgba(0,0,0,.4);
}
.el-panel.light { background:#fff; color:#000; }
.el-tabs { display:flex; gap:6px; margin-bottom:10px; }
.el-tabs button { flex:1; border:none; padding:6px; border-radius:8px; cursor:pointer; }
.el-tabs .active { background:#1a73e8; color:#fff; }
.el-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.el-card {
  padding:8px;
  border-radius:12px;
  cursor:pointer;
  background:rgba(255,255,255,.05);
}
.el-card.active { outline:2px solid #1a73e8; }
.preview { height:24px; border-radius:999px; margin-bottom:6px; background:#ccc; }
`;
  document.head.append(style);

  /* =========================
     INIT
  ========================= */

  applySearch();
  render();

})();