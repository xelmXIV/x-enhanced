/**
 * Fightcade x-Enhance
 * Original by --sexe.xelm
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// ==========================================
// CONFIGURATION & PRESETS
// ==========================================

const CONFIG = {
    addMorePlayerInfoToChat: true,
    showThemeButtons: true,
    showFavoritesButton: true,
    showFavoriteNavigationButtons: true,
    startupTheme: "Default",
};

const DEFAULT_PRESETS = {
    "Default": { mainColor: "#18181b", accentColor: "#3b82f6", accentColor2: "#60a5fa", errorColor: "#ef4444", stateOnline: "#10b981", stateAway: "#f59e0b", patreonColor: "#f5b50e", devColor: "#3b82f6" },
    "MX": { mainColor: "#0f172a", accentColor: "#38bdf8", accentColor2: "#818cf8", errorColor: "#f43f5e", stateOnline: "#22c55e", stateAway: "#eab308", patreonColor: "#f5b50e", devColor: "#38bdf8" },
    "Cauchemar": { mainColor: "#180f24", accentColor: "#d946ef", accentColor2: "#a855f7", errorColor: "#fb7185", stateOnline: "#34d399", stateAway: "#fbbf24", patreonColor: "#f5b50e", devColor: "#d946ef" },
    "Souvenir": { mainColor: "#1c140c", accentColor: "#f97316", accentColor2: "#fbbf24", errorColor: "#f87171", stateOnline: "#4ade80", stateAway: "#facc15", patreonColor: "#f5b50e", devColor: "#f97316" },
    "Sortilège": { mainColor: "#091e18", accentColor: "#2dd4bf", accentColor2: "#38bdf8", errorColor: "#fb7185", stateOnline: "#2dd4bf", stateAway: "#fbbf24", patreonColor: "#f5b50e", devColor: "#2dd4bf" },
    "Grincheux": { mainColor: "#1a1110", accentColor: "#ea580c", accentColor2: "#facc15", errorColor: "#ef4444", stateOnline: "#10b981", stateAway: "#fbbf24", patreonColor: "#f5b50e", devColor: "#ea580c" },
    "Coucher de soleil": { mainColor: "#200f18", accentColor: "#f43f5e", accentColor2: "#fb7185", errorColor: "#fb7185", stateOnline: "#34d399", stateAway: "#f59e0b", patreonColor: "#f5b50e", devColor: "#f43f5e" },
    "Luciérnaga": { mainColor: "#041f12", accentColor: "#4ade80", accentColor2: "#acc12d", errorColor: "#fb7185", stateOnline: "#22c55e", stateAway: "#facc15", patreonColor: "#f5b50e", devColor: "#4ade80" },
    "Niebla": { mainColor: "#0a192f", accentColor: "#64ffda", accentColor2: "#68d391", errorColor: "#f43f5e", stateOnline: "#64ffda", stateAway: "#f6ad55", patreonColor: "#f5b50e", devColor: "#64ffda" },
    "Luz de luna": { mainColor: "#0b0c16", accentColor: "#818cf8", accentColor2: "#e879f9", errorColor: "#f87171", stateOnline: "#2dd4bf", stateAway: "#fbbf24", patreonColor: "#f5b50e", devColor: "#818cf8" },
    "Cantina": { mainColor: "#1e130c", accentColor: "#eab308", accentColor2: "#f97316", errorColor: "#f87171", stateOnline: "#34d399", stateAway: "#facc15", patreonColor: "#f5b50e", devColor: "#eab308" }
};

// ==========================================
// STORAGE & PATH CONFIGURATION
// ==========================================

const STORAGE_FILE_PATH = path.join(__dirname, 'fightcade_themes.json');
const SESSION_UNDO_LOG_PATH = path.join(os.tmpdir(), 'fightcade_enhance_undo_session.json');

let storageCache = null;

const getUndoStack = () => {
    try {
        if (fs.existsSync(SESSION_UNDO_LOG_PATH)) {
            const data = fs.readFileSync(SESSION_UNDO_LOG_PATH, 'utf8');
            return JSON.parse(data) || [];
        }
    } catch (error) {
        console.warn("Failed to retrieve undo stack:", error);
    }
    return [];
};

const saveUndoStack = (stack) => {
    try {
        fs.writeFileSync(SESSION_UNDO_LOG_PATH, JSON.stringify(stack, null, 2), 'utf8');
    } catch (error) {
        console.warn("Failed to save undo stack:", error);
    }
};

const pushUndoState = (themesData, activeThemeName, defaultThemeName, deletedPresetsList) => {
    try {
        const stateSnapshot = JSON.parse(JSON.stringify({
            themes: themesData,
            activeTheme: activeThemeName,
            defaultTheme: defaultThemeName,
            deletedPresets: deletedPresetsList
        }));
        saveUndoStack([stateSnapshot]);
    } catch (error) {
        console.warn("Failed to push undo state:", error);
    }
};

const sanitizeThemeKey = (name) => 'theme-' + String(name || '').replace(/[^a-zA-Z0-9_-]/g, '_');

const loadStorageData = () => {
    if (storageCache) return storageCache; 

    try {
        if (fs.existsSync(STORAGE_FILE_PATH)) {
            const raw = fs.readFileSync(STORAGE_FILE_PATH, 'utf8').trim();
            if (raw) {
                const data = JSON.parse(raw);
                let themes = data.themes || { ...DEFAULT_PRESETS };
                let deletedPresets = data.deletedPresets || [];
                let updated = false;

                for (let [k, v] of Object.entries(DEFAULT_PRESETS)) {
                    if (!themes[k] && !deletedPresets.includes(k)) {
                        themes[k] = v;
                        updated = true;
                    }
                }

                storageCache = { 
                    themes, 
                    activeTheme: data.activeTheme || data.defaultTheme || "Default", 
                    defaultTheme: data.defaultTheme || "Default", 
                    deletedPresets 
                };

                if (updated || !data.themes || !data.defaultTheme) {
                    saveStorageData(storageCache.themes, storageCache.activeTheme, storageCache.defaultTheme, storageCache.deletedPresets, false);
                }
                return storageCache;
            }
        }
    } catch (error) {
        console.warn("Storage reset to defaults due to error:", error);
    }

    storageCache = { themes: { ...DEFAULT_PRESETS }, activeTheme: "Default", defaultTheme: "Default", deletedPresets: [] };
    saveStorageData(storageCache.themes, storageCache.activeTheme, storageCache.defaultTheme, storageCache.deletedPresets, false);
    return storageCache;
};

const saveStorageData = (themes, activeTheme, defaultTheme, deletedPresets, recordUndo = true) => {
    try {
        if (recordUndo && storageCache?.themes) {
            pushUndoState(storageCache.themes, activeTheme || storageCache.activeTheme, storageCache.defaultTheme, storageCache.deletedPresets);
        }

        storageCache = {
            defaultTheme: defaultTheme || storageCache?.defaultTheme || "Default",
            activeTheme: activeTheme || storageCache?.activeTheme || defaultTheme || "Default",
            deletedPresets: deletedPresets || storageCache?.deletedPresets || [],
            themes: themes || storageCache?.themes || { ...DEFAULT_PRESETS }
        };
        
        fs.writeFileSync(STORAGE_FILE_PATH, JSON.stringify(storageCache, null, 2), 'utf8');
    } catch (error) {
        console.error("Critical: Failed to save storage data:", error);
    }
};

const getCustomThemes = () => loadStorageData().themes;
const saveCustomThemes = (customThemes, activeTheme) => {
    const current = loadStorageData();
    saveStorageData(customThemes, activeTheme || current.activeTheme, current.defaultTheme, current.deletedPresets, true);
};
const setDefaultThemeOnDisk = (themeName) => {
    const current = loadStorageData();
    saveStorageData(current.themes, themeName, themeName, current.deletedPresets, true);
};
const getDefaultTheme = () => loadStorageData().defaultTheme || "Default";

// ==========================================
// COLOR UTILITIES
// ==========================================

const adjustColor = (hex, percent) => {
    if (!hex || typeof hex !== 'string') hex = '#18181b';
    let num = parseInt(hex.replace('#', ''), 16),
        amt = Math.round(2.55 * percent),
        R = Math.min(255, Math.max(0, (num >> 16) + amt)),
        G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt)),
        B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

const hexToRgba = (hex, alpha) => {
    if (!hex || typeof hex !== 'string') hex = '#18181b';
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    let num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
};

const getRandomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

// ==========================================
// STYLES & DYNAMIC THEME INJECTION
// ==========================================

const addGlobalStyles = () => {
    let style = document.getElementById('fc-enhanced-styles');
    if (!style) {
        style = document.createElement('style');
        style.id = 'fc-enhanced-styles';
        document.head.appendChild(style);
    }

    const customThemes = getCustomThemes();
    let dynamicCSS = '';

    Object.entries(customThemes).forEach(([name, colors]) => {
        const className = sanitizeThemeKey(name);
        const main = colors.mainColor || '#0a1f18';
        const accent = colors.accentColor || '#ce1126';
        const accent2 = colors.accentColor2 || '#00e676';
        const error = colors.errorColor || '#ff0031';
        const online = colors.stateOnline || '#59b240';
        const away = colors.stateAway || '#ef9f00';
        const patreon = colors.patreonColor || '#f5b50e';
        const dev = colors.devColor || '#f5b50e';
        const escapedName = name.replace(/"/g, '\\"');

        dynamicCSS += `
            .${className} {
                --mainColor: ${main} !important;
                --accentColor: ${accent} !important;
                --accentColor2: ${accent2} !important;
                --errorColor: ${error} !important;
                --state-online: ${online} !important;
                --state-away: ${away} !important;
                --patreonUserColor: ${patreon} !important;
                --devUserColor: ${dev} !important;
                --mainColor-light: ${adjustColor(main, 10)} !important;
                --mainColor-dark: ${adjustColor(main, -10)} !important;
                --mainColor-lighter: ${adjustColor(main, 20)} !important;
                --mainColor-lightest: ${adjustColor(main, 80)} !important;
                --mainColor-darker: ${adjustColor(main, -20)} !important;
                --mainColor-lightest-trans-hi: ${hexToRgba(adjustColor(main, 80), 0.7)} !important;
                --mainColor-lightest-trans-md: ${hexToRgba(adjustColor(main, 80), 0.5)} !important;
                --mainColor-dark-trans-lo: ${hexToRgba(adjustColor(main, -10), 0.3)} !important;
                --mainColor-darker-trans-hi: ${hexToRgba(adjustColor(main, -20), 0.7)} !important;
                --mainColor-darker-trans-lo: ${hexToRgba(adjustColor(main, -20), 0.3)} !important;
            }
            body.${className}, body.${className} #app { background-color: var(--mainColor) !important; }
            body.${className} .mainToolbarWrapper, body.${className} .channelsList, body.${className} .chatWrapper, body.${className} .contentWrapper { background-color: var(--mainColor) !important; }
            body.${className} .channelsList .channelItem.router-link-active, body.${className} .channelsList .channelItem:hover { background-color: var(--errorColor) !important; border-color: var(--errorColor) !important; }
            .custom-theme-btn[data-active-theme="${escapedName}"] { background: var(--accentColor) !important; color: #ffffff !important; border: 2px solid #ffffff !important; box-shadow: 0 0 8px var(--accentColor) !important; }
        `;
    });

    style.innerHTML = `
        .star-icon { fill: none; stroke: rgba(255, 255, 255, 0.3); stroke-width: 2; transition: fill 0.3s ease, stroke 0.3s ease; cursor: pointer; }
        .star-icon:hover { stroke: white; }
        .logo { display: none !important; }
        .channelsList .channelIcon, .channelsList .channelLogo, .channelsList a img, .channelsList a .icon, .channelItem .iconWrapper, .channelItem img { border-radius: 50% !important; overflow: hidden !important; }
        .custom-theme-btn { padding: 5px 8px !important; border-radius: 4px !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; cursor: pointer !important; background: rgba(0, 0, 0, 0.4) !important; color: rgba(255, 255, 255, 0.7) !important; font-family: inherit !important; font-size: 11px !important; font-weight: 500 !important; width: 100% !important; text-align: left !important; transition: all 0.2s ease !important; }
        .custom-theme-btn:hover { background: rgba(255, 255, 255, 0.1) !important; color: #ffffff !important; border-color: rgba(255, 255, 255, 0.3) !important; }
        .theme-action-bar { display: flex; justify-content: space-around; align-items: center; background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 4px; padding: 4px 6px; margin-bottom: 6px; }
        .theme-action-icon { width: 14px; height: 14px; cursor: pointer; fill: rgba(255, 255, 255, 0.5); transition: fill 0.2s ease; pointer-events: auto; }
        .theme-action-icon path { pointer-events: none; }
        .theme-action-icon:hover { fill: #ffffff; }
        .fc-context-menu { position: absolute; z-index: 10000; background: #18181b; border: 1px solid #3f3f46; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); padding: 4px 0; min-width: 130px; }
        .fc-context-menu-item { padding: 6px 12px; font-size: 11px; color: #d4d4d8; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .fc-context-menu-item:hover { background: #27272a; color: #ffffff; }
        .fc-modal-box { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #18181b; border: 1px solid #3f3f46; border-radius: 8px; padding: 20px; width: 320px; max-height: 85vh; overflow-y: auto; box-shadow: 0 8px 24px rgba(0,0,0,0.8); color: #ffffff; font-family: inherit; z-index: 9999; resize: both; }
        .fc-modal-header { cursor: move; user-select: none; margin: -20px -20px 12px -20px; padding: 12px 20px; background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid #3f3f46; font-weight: bold; font-size: 14px; }
        .fc-modal-field { margin-bottom: 10px; }
        .fc-modal-field label { display: block; font-size: 13.5px; font-weight: 700; color: #ffffff; -webkit-text-stroke: 0.5px #000000; paint-order: stroke fill; margin-bottom: 4px; }
        .fc-modal-field input[type="text"] { width: 100%; background: #27272a; border: 1px solid #3f3f46; border-radius: 4px; color: #fff; padding: 6px 8px; box-sizing: border-box; user-select: text !important; -webkit-user-select: text !important; }
        .fc-modal-field input[type="text"]:focus { outline: 1px solid #f5b50e; border-color: #f5b50e; }
        .fc-color-row { display: flex; gap: 8px; align-items: center; }
        .fc-color-preview-bar { width: 60px; height: 26px; border-radius: 4px; border: 1px solid #3f3f46; cursor: pointer; position: relative; flex-shrink: 0; }
        .fc-color-preview-bar input[type="color"] { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; }
        .fc-color-text-input { flex-grow: 1; background: #27272a; border: 1px solid #3f3f46; border-radius: 4px; color: #b5b5ba; padding: 4px 8px; font-size: 11.5px; box-sizing: border-box; user-select: text !important; -webkit-user-select: text !important; }
        .fc-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
        .fc-modal-btn { padding: 6px 12px; border-radius: 4px; border: none; cursor: pointer; font-size: 11px; font-weight: bold; }
        .fc-modal-btn-save { background: #16a34a; color: white; }
        .fc-modal-btn-cancel { background: #3f3f46; color: white; }
        .fc-modal-btn-danger { background: #ef4444; color: white; }
        ${dynamicCSS}
    `;
};

// ==========================================
// POPUP DIALOGS & MODALS
// ==========================================

const showCustomAlert = (message, title = "Notice") => {
    const existing = document.getElementById('fc-custom-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.id = 'fc-custom-popup';
    popup.className = 'fc-modal-box';
    popup.style.width = '280px';
    popup.innerHTML = `
        <div class="fc-modal-header">${title}</div>
        <div style="font-size: 13px; color: #d4d4d8; margin-bottom: 16px; line-height: 1.4;">${message}</div>
        <div class="fc-modal-actions"><button class="fc-modal-btn fc-modal-btn-save" id="fc-popup-ok">OK</button></div>
    `;
    document.body.appendChild(popup);
    document.getElementById('fc-popup-ok').onclick = () => popup.remove();
};

const showCustomConfirm = (message, onConfirm, title = "Confirm") => {
    const existing = document.getElementById('fc-custom-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.id = 'fc-custom-popup';
    popup.className = 'fc-modal-box';
    popup.style.width = '280px';
    popup.innerHTML = `
        <div class="fc-modal-header">${title}</div>
        <div style="font-size: 13px; color: #d4d4d8; margin-bottom: 16px; line-height: 1.4;">${message}</div>
        <div class="fc-modal-actions">
            <button class="fc-modal-btn fc-modal-btn-cancel" id="fc-popup-cancel">Cancel</button>
            <button class="fc-modal-btn fc-modal-btn-danger" id="fc-popup-confirm">Confirm</button>
        </div>
    `;
    document.body.appendChild(popup);

    document.getElementById('fc-popup-cancel').onclick = () => popup.remove();
    document.getElementById('fc-popup-confirm').onclick = () => { popup.remove(); onConfirm(); };
};

// ==========================================
// UI HELPER BUILDERS
// ==========================================

const addStyledLink = (targetElement, callback, tooltip, svgHTML) => {
    const link = document.createElement('a');
    link.classList.add('buttonItemWrapper');
    link.title = tooltip;
    link.style.cssText = 'display: block; margin-left: 0px; padding: 5px; width: 100%; margin-top: 15px; cursor: pointer;';

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.classList.add('star-icon');
    svgElement.setAttribute("width", "40");
    svgElement.setAttribute("height", "40");
    svgElement.innerHTML = svgHTML;

    link.appendChild(svgElement);
    link.addEventListener('click', callback);
    targetElement.parentNode.insertBefore(link, targetElement.nextSibling);
};

const addNavigationButtons = (targetElement, prevCallback, nextCallback) => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; justify-content: space-between; margin: 15px 0; width: 100%;';

    const buttons = [
        { title: 'Go to previous favorite channel', svg: '<polygon points="10,0 10,20 0,10" />', callback: prevCallback },
        { title: 'Go to next favorite channel', svg: '<polygon points="0,0 10,10 0,20" />', callback: nextCallback },
    ];

    buttons.forEach(({ title, svg, callback }) => {
        const button = document.createElement('a');
        button.title = title;
        button.style.cssText = 'display: inline-block; width: 50%; cursor: pointer;';

        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.classList.add('star-icon');
        svgElement.setAttribute("width", "20");
        svgElement.setAttribute("height", "20");
        svgElement.innerHTML = svg;

        button.appendChild(svgElement);
        button.addEventListener('click', callback);
        container.appendChild(button);
    });

    targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
};

const createFlagElement = (country) => {
    const el = document.createElement('span');
    el.className = 'flagWrapper fc-enhanced-element';
    const iso = country?.iso_code ? country.iso_code.toLowerCase() : 'unknown';
    el.style.cssText = `width: 20px; display: inline-block; height: 14px; background-image: url('static/flags/${iso}.png'); background-size: contain; margin-left: 5px;`;
    el.title = country?.full_name || '';
    return el;
};

const createPingElement = (src, title) => {
    const el = document.createElement('span');
    el.className = 'pingWrapper fc-enhanced-element';
    el.style.cssText = `width: 15px; display: inline-block; height: 15px; background-image: url('${src}'); background-size: contain; margin-left: 5px;`;
    el.title = title || '';
    return el;
};

const createRankElement = (src, title) => {
    const el = document.createElement('span');
    el.className = 'rankWrapper fc-enhanced-element';
    el.style.cssText = `width: 15px; display: inline-block; height: 15px; background-image: url('${src}'); background-size: contain; margin-left: 5px;`;
    el.title = title || '';
    return el;
};

const createStatusElement = (isAway) => {
    const el = document.createElement('div');
    el.className = 'statusWrapper fc-enhanced-element';
    el.title = isAway ? 'Away' : 'Online';
    el.style.cssText = `width: 10px; display: inline-block; height: 10px; border-radius: 50%; background-color: ${isAway ? 'orange' : 'green'}; margin-left: 5px;`;
    return el;
};

// ==========================================
// MESSAGE PROCESSING & CHAT ENHANCEMENTS
// ==========================================

const processMessages = (FCADE, mutations = []) => {
    if (!CONFIG.addMorePlayerInfoToChat || !FCADE) return;

    const globalUsers = FCADE.globalUsers || {};
    let newMessages = [];

    if (mutations.length > 0) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { 
                    if (node.classList.contains('message') && !node.dataset.hasFlag) {
                        newMessages.push(node);
                    }
                    if (node.querySelectorAll) {
                        newMessages.push(...node.querySelectorAll('.message:not([data-has-flag])'));
                    }
                }
            }
        }
    } else {
        newMessages = Array.from(document.querySelectorAll('#app div.message:not([data-has-flag])'));
    }

    if (newMessages.length === 0) return;

    const activeChannelId = FCADE.activeChannelId;
    const usersListChildren = FCADE.$refs?.[activeChannelId]?.[0]?.$refs?.usersList?.$children || [];
    const channelUsersMap = new Map();
    for (const child of usersListChildren) {
        if (child?.user?.id) channelUsersMap.set(child.user.id, child);
    }

    for (const messageElement of newMessages) {
        const authorElement = messageElement.querySelector('span.author');
        if (!authorElement) continue;

        const userKey = authorElement.innerText.trim();
        const globalUser = globalUsers[userKey];

        if (globalUser?.country) {
            const userFound = channelUsersMap.get(userKey);

            if (!messageElement.querySelector('.fc-enhanced-element')) {
                if (authorElement.parentElement) {
                    authorElement.parentElement.insertBefore(createStatusElement(globalUser?.away), authorElement);
                }
                authorElement.appendChild(createFlagElement(globalUser.country));

                if (userFound?.rankSrc) {
                    authorElement.appendChild(createRankElement(userFound.rankSrc, userFound.rankTitle));
                }

                let pingSrc = userFound?.pingSrc;
                let pingTitle = userFound?.pingTitle;
                if (!pingSrc && globalUser?.ping !== undefined) {
                    const p = globalUser.ping;
                    if (p < 100) {
                        pingSrc = 'static/img/ping3.png';
                        pingTitle = `Good ping (~${p} ms)`;
                    } else if (p < 200) {
                        pingSrc = 'static/img/ping2.png';
                        pingTitle = `Fair ping (~${p} ms)`;
                    } else {
                        pingSrc = 'static/img/ping1.png';
                        pingTitle = `Poor ping (~${p} ms)`;
                    }
                }
                if (pingSrc) {
                    authorElement.appendChild(createPingElement(pingSrc, pingTitle));
                }

                if (globalUser?.ping !== undefined) {
                    const pingText = document.createElement('span');
                    pingText.className = 'pingText fc-enhanced-element';
                    pingText.style.cssText = 'font-size: small; margin-left: 5px; font-weight: normal; opacity: 0.8;';
                    pingText.innerHTML = `(ping: ~${globalUser.ping} ms)`;
                    authorElement.appendChild(pingText);
                }
            }
            messageElement.dataset.hasFlag = "true";
        }
    }
};

const waitForVue = (callback) => {
    const appElement = document.querySelector('#app');
    if (appElement?.__vue__?._data?.global?.setTheme) {
        callback(appElement.__vue__);
    } else {
        setTimeout(() => waitForVue(callback), 300);
    }
};

// ==========================================
// MAIN PLUGIN LOGIC
// ==========================================

let activeSelectedTheme = null;
let currentActiveModalBox = null;
let previousThemeBeforeModal = null;

const fightcadePlugins = (fcWindow) => {
    fcWindow.currentChannel = 0;

    waitForVue((FCADE) => {
        const setTheme = (theme, skipLiveModalUpdate = false) => {
            activeSelectedTheme = theme;
            const app = document.querySelector('#app');

            [document.body, app].forEach(el => {
                if (!el) return;
                el.classList.forEach(cls => { if (cls.startsWith('theme-')) el.classList.remove(cls); });
                el.classList.add(sanitizeThemeKey(theme));
                el.style.backgroundColor = '';
            });

            try { FCADE?._data?.global?.setTheme?.('default'); } catch (error) {}

            document.querySelectorAll('.custom-theme-btn').forEach(btn => {
                if (btn.getAttribute('data-theme') === theme) btn.setAttribute('data-active-theme', theme);
                else btn.removeAttribute('data-active-theme');
            });

            if (currentActiveModalBox && !skipLiveModalUpdate) {
                const header = currentActiveModalBox.querySelector('.fc-modal-header');
                if (header && (header.textContent.startsWith('Edit Theme') || header.textContent.startsWith('New Theme'))) {
                    const existing = getCustomThemes()[theme] || {};
                    const setFieldVal = (id, val) => {
                        const targetVal = val || '#ffffff';
                        const col = document.getElementById(`fc-theme-${id}`);
                        const txt = document.getElementById(`fc-text-${id}`);
                        const bar = document.getElementById(`bar-${id}`);
                        if (col) col.value = targetVal;
                        if (txt) txt.value = targetVal;
                        if (bar) bar.style.background = targetVal;
                    };

                    const nameInput = document.getElementById('fc-theme-name');
                    if (nameInput) nameInput.value = theme;

                    ['main', 'accent', 'accent2', 'error', 'online', 'away', 'patreon', 'dev'].forEach(k => {
                        setFieldVal(k, existing[k === 'main' ? 'mainColor' : k === 'accent' ? 'accentColor' : k === 'accent2' ? 'accentColor2' : k === 'error' ? 'errorColor' : k === 'online' ? 'stateOnline' : k === 'away' ? 'stateAway' : k === 'patreon' ? 'patreonColor' : 'devColor']);
                    });
                    currentActiveModalBox.dataset.editingTheme = theme;
                }
            }
        };

        const cleanUpLivePreview = () => {
            const body = document.body;
            const app = document.querySelector('#app');
            const elementsToClean = [body, app, ...document.querySelectorAll('.mainToolbarWrapper, .channelsList, .chatWrapper, .contentWrapper')];
            
            elementsToClean.forEach(el => {
                if (!el) return;
                ['background-color', '--mainColor', '--accentColor', '--accentColor2', '--errorColor', 
                 '--state-online', '--state-away', '--patreonUserColor', '--devUserColor', 
                 '--mainColor-light', '--mainColor-dark', '--mainColor-lighter', '--mainColor-lightest', 
                 '--mainColor-darker', '--mainColor-lightest-trans-hi', '--mainColor-lightest-trans-md', 
                 '--mainColor-dark-trans-lo', '--mainColor-darker-trans-hi', '--mainColor-darker-trans-lo'
                ].forEach(prop => el.style.removeProperty(prop));
            });
        };

        const updateSingleColorPreview = (key, colorValue) => {
            const body = document.body;
            const app = document.querySelector('#app');
            
            const varMap = {
                main: '--mainColor',
                accent: '--accentColor',
                accent2: '--accentColor2',
                error: '--errorColor',
                online: '--state-online',
                away: '--state-away',
                patreon: '--patreonUserColor',
                dev: '--devUserColor'
            };

            const cssVar = varMap[key];
            if (!cssVar) return;

            [body, app].forEach(el => { if(el) el.style.setProperty(cssVar, colorValue, 'important'); });

            if (key === 'main') {
                [body, app].forEach(el => { if(el) el.style.setProperty('background-color', colorValue, 'important'); });
                document.querySelectorAll('.mainToolbarWrapper, .channelsList, .chatWrapper, .contentWrapper').forEach(el => {
                    el.style.setProperty('background-color', colorValue, 'important');
                });

                [body, app].forEach(el => {
                    if (!el) return;
                    el.style.setProperty('--mainColor-light', adjustColor(colorValue, 10), 'important');
                    el.style.setProperty('--mainColor-dark', adjustColor(colorValue, -10), 'important');
                    el.style.setProperty('--mainColor-lighter', adjustColor(colorValue, 20), 'important');
                    el.style.setProperty('--mainColor-lightest', adjustColor(colorValue, 80), 'important');
                    el.style.setProperty('--mainColor-darker', adjustColor(colorValue, -20), 'important');
                    el.style.setProperty('--mainColor-lightest-trans-hi', hexToRgba(adjustColor(colorValue, 80), 0.7), 'important');
                    el.style.setProperty('--mainColor-lightest-trans-md', hexToRgba(adjustColor(colorValue, 80), 0.5), 'important');
                    el.style.setProperty('--mainColor-dark-trans-lo', hexToRgba(adjustColor(colorValue, -10), 0.3), 'important');
                    el.style.setProperty('--mainColor-darker-trans-hi', hexToRgba(adjustColor(colorValue, -20), 0.7), 'important');
                    el.style.setProperty('--mainColor-darker-trans-lo', hexToRgba(adjustColor(colorValue, -20), 0.3), 'important');
                });
            }
        };

        const openThemeModal = (editName = null) => {
            if (currentActiveModalBox) currentActiveModalBox.remove();
            previousThemeBeforeModal = activeSelectedTheme;

            const isEdit = Boolean(editName);
            const customThemes = getCustomThemes();
            let themeName = editName;

            if (!isEdit) {
                let counter = 1;
                themeName = "new";
                while (customThemes[themeName]) {
                    themeName = `new${counter++}`;
                }
            }

            const existing = isEdit ? (customThemes[editName] || {}) : {};
            const getCol = (key, fallback) => existing[key] || (isEdit ? '#ffffff' : fallback);

            const colors = {
                main: getCol('mainColor', getRandomHex()),
                accent: getCol('accentColor', getRandomHex()),
                accent2: getCol('accentColor2', getRandomHex()),
                error: getCol('errorColor', getRandomHex()),
                online: getCol('stateOnline', getRandomHex()),
                away: getCol('stateAway', getRandomHex()),
                patreon: getCol('patreonColor', getRandomHex()),
                dev: getCol('devColor', getRandomHex())
            };

            const modalBox = document.createElement('div');
            modalBox.className = 'fc-modal-box';
            currentActiveModalBox = modalBox;
            modalBox.dataset.editingTheme = themeName;

            let fieldsHTML = `
                <div class="fc-modal-header">${isEdit ? 'Edit Theme' : 'New Theme'}</div>
                <div class="fc-modal-field">
                    <label>Theme Name</label>
                    <input type="text" id="fc-theme-name" value="${themeName}">
                </div>
            `;

            const colorLabels = {
                main: 'Background', accent: 'Primary accent', accent2: 'Secondary accent',
                error: 'Lobby border', online: 'Online status', away: 'Away/busy status',
                patreon: 'Patreon badge color', dev: 'Dev badge color'
            };

            Object.entries(colorLabels).forEach(([key, label]) => {
                fieldsHTML += `
                    <div class="fc-modal-field">
                        <label>${label}</label>
                        <div class="fc-color-row">
                            <div class="fc-color-preview-bar" id="bar-${key}" style="background: ${colors[key]};">
                                <input type="color" id="fc-theme-${key}" value="${colors[key]}">
                            </div>
                            <input type="text" class="fc-color-text-input" id="fc-text-${key}" value="${colors[key]}">
                        </div>
                    </div>
                `;
            });

            fieldsHTML += `
                <div class="fc-modal-actions">
                    <button class="fc-modal-btn fc-modal-btn-cancel" id="fc-modal-cancel">Cancel</button>
                    <button class="fc-modal-btn fc-modal-btn-save" id="fc-modal-save">Save</button>
                </div>
            `;

            modalBox.innerHTML = fieldsHTML;
            document.body.appendChild(modalBox);

            Object.keys(colorLabels).forEach(key => {
                const colorInput = document.getElementById(`fc-theme-${key}`);
                const textInput = document.getElementById(`fc-text-${key}`);
                const bar = document.getElementById(`bar-${key}`);

                if (!colorInput || !textInput || !bar) return;

                colorInput.oninput = (e) => {
                    const val = e.target.value;
                    textInput.value = val;
                    bar.style.background = val;
                    updateSingleColorPreview(key, val); 
                };

                textInput.oninput = (e) => {
                    const val = e.target.value.trim();
                    if (val.startsWith('#') && [4, 7].includes(val.length)) {
                        colorInput.value = val;
                        bar.style.background = val;
                        updateSingleColorPreview(key, val);
                    }
                };

                ['keydown', 'mousedown'].forEach(ev => {
                    textInput.addEventListener(ev, (e) => {
                        e.stopPropagation();
                        if (ev === 'keydown' && e.ctrlKey && e.key.toLowerCase() === 'z') document.execCommand('undo');
                    });
                });
            });

            const header = modalBox.querySelector('.fc-modal-header');
            let isDragging = false, startX, startY, initialLeft, initialTop;

            header.onmousedown = (e) => {
                isDragging = true;
                startX = e.clientX; startY = e.clientY;
                const rect = modalBox.getBoundingClientRect();
                modalBox.style.transform = 'none';
                modalBox.style.left = `${rect.left}px`;
                modalBox.style.top = `${rect.top}px`;
                initialLeft = rect.left; initialTop = rect.top;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            const onMouseMove = (e) => {
                if (!isDragging) return;
                modalBox.style.left = `${initialLeft + (e.clientX - startX)}px`;
                modalBox.style.top = `${initialTop + (e.clientY - startY)}px`;
            };

            const onMouseUp = () => {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            const nameInput = document.getElementById('fc-theme-name');
            if (nameInput) {
                nameInput.focus();
                nameInput.select();
                nameInput.oninput = () => { modalBox.dataset.editingTheme = nameInput.value.trim(); };
                nameInput.addEventListener('keydown', (e) => {
                    e.stopPropagation();
                    if (e.ctrlKey && e.key.toLowerCase() === 'z') document.execCommand('undo');
                });
            }

            const closeModalAndRevert = () => {
                document.removeEventListener('keydown', handleEscapeKey);
                modalBox.remove();
                currentActiveModalBox = null;
                cleanUpLivePreview();
                if (previousThemeBeforeModal) {
                    addGlobalStyles();
                    setTheme(previousThemeBeforeModal, true);
                    renderThemeButtons();
                }
            };

            const handleEscapeKey = (e) => { if (e.key === 'Escape') closeModalAndRevert(); };
            document.addEventListener('keydown', handleEscapeKey);
            document.getElementById('fc-modal-cancel').onclick = closeModalAndRevert;

            document.getElementById('fc-modal-save').onclick = () => {
                document.removeEventListener('keydown', handleEscapeKey);
                const newName = nameInput ? nameInput.value.trim() : '';
                if (!newName) {
                    showCustomAlert('Please enter a valid theme name.', 'Error');
                    return;
                }

                const themes = getCustomThemes();
                if (editName && editName !== newName && themes[editName]) delete themes[editName];

                themes[newName] = {
                    mainColor: document.getElementById('fc-text-main')?.value.trim() || document.getElementById('fc-theme-main')?.value,
                    accentColor: document.getElementById('fc-text-accent')?.value.trim() || document.getElementById('fc-theme-accent')?.value,
                    accentColor2: document.getElementById('fc-text-accent2')?.value.trim() || document.getElementById('fc-theme-accent2')?.value,
                    errorColor: document.getElementById('fc-text-error')?.value.trim() || document.getElementById('fc-theme-error')?.value,
                    stateOnline: document.getElementById('fc-text-online')?.value.trim() || document.getElementById('fc-theme-online')?.value,
                    stateAway: document.getElementById('fc-text-away')?.value.trim() || document.getElementById('fc-theme-away')?.value,
                    patreonColor: document.getElementById('fc-text-patreon')?.value.trim() || document.getElementById('fc-theme-patreon')?.value,
                    devColor: document.getElementById('fc-text-dev')?.value.trim() || document.getElementById('fc-theme-dev')?.value
                };

                saveCustomThemes(themes, newName);
                cleanUpLivePreview();
                addGlobalStyles();
                renderThemeButtons();
                setTheme(newName, true);
                modalBox.remove();
                currentActiveModalBox = null;
            };
        };

        const undoLastAction = () => {
            const stack = getUndoStack();
            if (stack.length === 0) {
                showCustomAlert('No recent actions to undo.', 'Undo');
                return;
            }

            const previousState = stack.pop();
            saveUndoStack(stack);
            if (!previousState) return;

            try {
                const restoredActive = previousState.activeTheme || activeSelectedTheme || "Default";
                saveStorageData(previousState.themes, restoredActive, previousState.defaultTheme, previousState.deletedPresets, false);
                addGlobalStyles();
                renderThemeButtons();
                setTheme(restoredActive);
            } catch (error) {
                showCustomAlert('Failed to perform undo operation.', 'Error');
            }
        };

        const deleteTheme = (name = activeSelectedTheme) => {
            if (!name) {
                showCustomAlert('Please select a theme to delete.', 'Error');
                return;
            }
            if (name === 'Default') {
                showCustomAlert('Cannot delete the Default theme.', 'Error');
                return;
            }
            
            showCustomConfirm(`Delete theme "${name}"?`, () => {
                const storage = loadStorageData();
                const customThemes = storage.themes;
                const deletedPresets = storage.deletedPresets || [];
                const currentDefault = storage.defaultTheme;

                if (customThemes[name]) delete customThemes[name];
                if (DEFAULT_PRESETS[name] && !deletedPresets.includes(name)) deletedPresets.push(name);

                let newDefault = currentDefault === name ? "Default" : currentDefault;
                saveStorageData(customThemes, newDefault, newDefault, deletedPresets, true);

                addGlobalStyles();
                renderThemeButtons();
                setTheme(newDefault);
            }, "Delete Theme");
        };

        const resetThemeToDefaultPreset = (name = activeSelectedTheme) => {
            if (!name) {
                showCustomAlert('Please select a theme to reset.', 'Error');
                return;
            }

            showCustomConfirm(`Reset theme "${name}" to default preset?`, () => {
                const themes = getCustomThemes();
                if (!themes[name]) return;

                const presetKeys = Object.keys(DEFAULT_PRESETS).filter(k => k !== "Default");
                const idx = typeof themes[name].presetCycleIndex === 'number' ? themes[name].presetCycleIndex : 0;
                themes[name] = { ...DEFAULT_PRESETS[presetKeys[idx % presetKeys.length]], presetCycleIndex: idx + 1 };

                saveCustomThemes(themes, name);
                addGlobalStyles();
                renderThemeButtons();
                setTheme(name);
            }, "Reset to Default Preset");
        };

        const showContextMenu = (e, themeName) => {
            e.preventDefault();
            activeSelectedTheme = themeName;
            document.querySelector('.fc-context-menu')?.remove();

            const menu = document.createElement('div');
            menu.className = 'fc-context-menu';
            menu.style.top = `${e.pageY}px`;
            menu.style.left = `${e.pageX}px`;

            const isDefaultText = getDefaultTheme() === themeName ? "✓ Set as default" : "Set as default";
            menu.innerHTML = `
                <div class="fc-context-menu-item" id="ctx-setdefault">${isDefaultText}</div>
                <div class="fc-context-menu-item" id="ctx-edit">Edit</div>
                <div class="fc-context-menu-item" id="ctx-reset">Reset to default preset</div>
                <div class="fc-context-menu-item" id="ctx-delete" style="color: #ef4444;">Delete</div>
            `;
            document.body.appendChild(menu);

            setTimeout(() => window.addEventListener('click', () => menu.remove(), { once: true }), 10);

            document.getElementById('ctx-setdefault').onclick = () => { setDefaultThemeOnDisk(themeName); setTheme(themeName); renderThemeButtons(); };
            document.getElementById('ctx-edit').onclick = () => openThemeModal(themeName);
            document.getElementById('ctx-reset').onclick = () => resetThemeToDefaultPreset(themeName);
            document.getElementById('ctx-delete').onclick = () => deleteTheme(themeName);
        };

        let themeContainer = null;
        const renderThemeButtons = () => {
            if (!themeContainer) return;
            themeContainer.innerHTML = '';

            const actionBar = document.createElement('div');
            actionBar.className = 'theme-action-bar';
            actionBar.innerHTML = `
                <svg class="theme-action-icon" id="act-add" viewBox="0 0 24 24"><title>Create new theme</title><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                <svg class="theme-action-icon" id="act-rename" viewBox="0 0 24 24"><title>Edit theme</title><path d="M18.41 5.8L17.2 4.59c-.78-.78-2.05-.78-2.83 0l-2.68 2.68 3.95 3.95 2.77-2.77c.79-.78.79-2.05 0-2.65zM2 17.25V21h3.75L15.42 11.33l-3.75-3.75L2 17.25z"/></svg>
                <svg class="theme-action-icon" id="act-undo" viewBox="0 0 24 24"><title>Undo last action</title><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C20.08 11.51 16.62 8 12.5 8z"/></svg>
                <svg class="theme-action-icon" id="act-delete" viewBox="0 0 24 24"><title>Delete</title><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            `;
            themeContainer.appendChild(actionBar);

            document.getElementById('act-add').onclick = () => openThemeModal();
            document.getElementById('act-rename').onclick = () => openThemeModal(activeSelectedTheme);
            document.getElementById('act-undo').onclick = undoLastAction;
            document.getElementById('act-delete').onclick = () => deleteTheme();

            const customThemes = getCustomThemes();
            const currentDefault = getDefaultTheme();

            Object.keys(customThemes).sort((a, b) => (a === currentDefault ? -1 : b === currentDefault ? 1 : a.localeCompare(b))).forEach((theme) => {
                const button = document.createElement('button');
                button.textContent = theme;
                button.className = 'custom-theme-btn';
                button.setAttribute('data-theme', theme);
                if (theme === activeSelectedTheme) button.setAttribute('data-active-theme', theme);
                button.onclick = () => setTheme(theme);
                button.oncontextmenu = (e) => showContextMenu(e, theme);
                themeContainer.appendChild(button);
            });
        };

        const showFavorites = () => {
            const searchChannel = FCADE?.$children?.find((child) => child?.$options?.name === 'search-channel');
            if (searchChannel) {
                Object.assign(searchChannel, { yearFilter: 0, genreFilter: 0, systemFilter: 0, rankedFilter: 0, textFilter: '', favorites: true });
                if (FCADE.activeChannelId !== 'search-channel') FCADE.gotoChannel('search-channel');
                if (typeof searchChannel.requestChannels === 'function') searchChannel.requestChannels();
            }
        };

        const changeChannel = (direction) => {
            const favorites = FCADE?.global?.localUser?.favoritesChannels || [];
            if (favorites.length === 0) return;
            const currentChannel = fcWindow.currentChannel || 0;
            const nextIndex = (currentChannel + direction + favorites.length) % favorites.length;
            const nextChannel = favorites[nextIndex];
            fcWindow.currentChannel = nextIndex;

            const loadedChannels = (FCADE.channels || []).filter((c) => c.emulator).map((c) => c.id);
            const channelToRemove = favorites.find((c) => loadedChannels.includes(c));
            if (channelToRemove && typeof FCADE.leaveChannel === 'function') FCADE.leaveChannel(channelToRemove);

            if (typeof FCADE.joinChannel === 'function') FCADE.joinChannel(nextChannel);
            setTimeout(() => { if (typeof FCADE.gotoChannel === 'function') FCADE.gotoChannel(nextChannel); }, 1000);
        };

        const initUIElements = () => {
            const targetElement = fcWindow.document.querySelector('#app > div.mainToolbarWrapper > div.mainToolbar > div.channelsList > a');
            if (!targetElement) {
                setTimeout(initUIElements, 300);
                return;
            }

            if (!fcWindow.document.querySelector('.star-icon')) {
                if (CONFIG.showFavoriteNavigationButtons) {
                    addNavigationButtons(targetElement, () => changeChannel(-1), () => changeChannel(1));
                }
                if (CONFIG.showFavoritesButton) {
                    addStyledLink(targetElement, showFavorites, 'Show Favorites', '<polygon points="18,3 23,14 33,14 26,21 29,32 18,26 8,32 11,21 3,14 14,14" /><title>Show Favorites</title>');
                }
            }

            if (CONFIG.showThemeButtons && !themeContainer) {
                themeContainer = document.createElement('div');
                themeContainer.style.cssText = 'display: flex; flex-direction: column; gap: 4px; margin-top: 15px; width: 100%; padding: 0 5px; box-sizing: border-box;';
                targetElement.parentNode.insertBefore(themeContainer, targetElement.nextSibling);
                renderThemeButtons();
            }

            setTheme(getDefaultTheme());
        };

        initUIElements();

        // ==========================================
        // OPTIMIZED MUTATION OBSERVER (rAF Batched)
        // ==========================================
        const appContainer = fcWindow.document.querySelector('#app');
        if (appContainer) {
            let mutationQueue = [];
            let isRafScheduled = false;

            const optimizedObserver = new MutationObserver((mutations) => {
                mutationQueue.push(...mutations);
                if (!isRafScheduled) {
                    isRafScheduled = true;
                    requestAnimationFrame(() => {
                        const currentMutations = mutationQueue;
                        mutationQueue = [];
                        isRafScheduled = false;
                        processMessages(FCADE, currentMutations);
                    });
                }
            });

            optimizedObserver.observe(appContainer, { childList: true, subtree: true });
        }
    });
};

const setupInjectBridge = (fcWindow) => {
    fcWindow.__FC_ENHANCE_BRIDGE = {
        getConfig: () => CONFIG,
        getThemes: () => getCustomThemes(),
        saveTheme: (name, colors) => {
            const themes = getCustomThemes();
            themes[name] = colors;
            saveCustomThemes(themes, name);
            addGlobalStyles();
        },
        deleteThemeBridge: (name) => {
            const storage = loadStorageData();
            const themes = storage.themes;
            const deletedPresets = storage.deletedPresets || [];
            if (themes[name]) {
                delete themes[name];
                if (DEFAULT_PRESETS[name] && !deletedPresets.includes(name)) deletedPresets.push(name);
                saveStorageData(themes, 'Default', 'Default', deletedPresets, true);
                addGlobalStyles();
            }
        }
    };
};

addGlobalStyles();
setupInjectBridge(window);
fightcadePlugins(window);