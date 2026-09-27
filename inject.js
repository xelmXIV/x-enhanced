// Fightcade x-enhance 
// by --sexe.xelm 

const fs = require('fs');
const path = require('path');

// CONFIGURATION
const CONFIG = {
    addMorePlayerInfoToChat: true,
    showThemeButtons: true,
    showFavoritesButton: true,
    showFavoriteNavigationButtons: true,
    startupTheme: "MX",
    themes: [
        "Default",
        "Souvenir",
        "Sortilège",
        "Grincheux",
        "Coucher de soleil",
        "Luciérnaga",
        "Niebla",
        "Luz de luna",
        "Cantina",
        "MX",
        "Cauchemar"
    ],
};

// FULL COLOR DEFINITIONS FOR ALL THEMES
const THEME_COLORS = {
    "MX": { mainColor: "#0a1f18", accentColor: "#ce1126", accentColor2: "#00e676", errorColor: "#ff0031", stateOnline: "#00e676", stateAway: "#ef9f00", patreonColor: "#f5b50e", devColor: "#ce1126" },
    "Cauchemar": { mainColor: "#120924", accentColor: "#a855f7", accentColor2: "#ec4899", errorColor: "#ef4444", stateOnline: "#10b981", stateAway: "#f59e0b", patreonColor: "#f5b50e", devColor: "#a855f7" },
    "Default": { mainColor: "#18181b", accentColor: "#3b82f6", accentColor2: "#60a5fa", errorColor: "#ef4444", stateOnline: "#10b981", stateAway: "#f59e0b", patreonColor: "#f5b50e", devColor: "#3b82f6" },
    "Souvenir": { mainColor: "#1c1917", accentColor: "#f97316", accentColor2: "#fb923c", errorColor: "#ef4444", stateOnline: "#10b981", stateAway: "#f59e0b", patreonColor: "#f5b50e", devColor: "#f97316" },
    "Sortilège": { mainColor: "#0f172a", accentColor: "#8b5cf6", accentColor2: "#a78bfa", errorColor: "#ef4444", stateOnline: "#10b981", stateAway: "#f59e0b", patreonColor: "#f5b50e", devColor: "#8b5cf6" },
    "Grincheux": { mainColor: "#1f2937", accentColor: "#ef4444", accentColor2: "#f87171", errorColor: "#dc2626", stateOnline: "#10b981", stateAway: "#f59e0b", patreonColor: "#f5b50e", devColor: "#ef4444" },
    "Coucher de soleil": { mainColor: "#2a1215", accentColor: "#f43f5e", accentColor2: "#fb7185", errorColor: "#e11d48", stateOnline: "#10b981", stateAway: "#f59e0b", patreonColor: "#f5b50e", devColor: "#f43f5e" },
    "Luciérnaga": { mainColor: "#062016", accentColor: "#10b981", accentColor2: "#34d399", errorColor: "#ef4444", stateOnline: "#059669", stateAway: "#f59e0b", patreonColor: "#f5b50e", devColor: "#10b981" },
    "Niebla": { mainColor: "#182232", accentColor: "#06b6d4", accentColor2: "#38bdf8", errorColor: "#ef4444", stateOnline: "#10b981", stateAway: "#f59e0b", patreonColor: "#f5b50e", devColor: "#06b6d4" },
    "Luz de luna": { mainColor: "#0f172a", accentColor: "#6366f1", accentColor2: "#818cf8", errorColor: "#ef4444", stateOnline: "#10b981", stateAway: "#f59e0b", patreonColor: "#f5b50e", devColor: "#6366f1" },
    "Cantina": { mainColor: "#271a12", accentColor: "#eab308", accentColor2: "#facc15", errorColor: "#ff0031", stateOnline: "#10b981", stateAway: "#ef9f00", patreonColor: "#f5b50e", devColor: "#eab308" }
};

// UNIFIED FILE SYSTEM STORAGE
const STORAGE_FILE_PATH = path.join(__dirname, 'fightcade_themes.json');

const loadStorageData = () => {
    try {
        if (fs.existsSync(STORAGE_FILE_PATH)) {
            const data = JSON.parse(fs.readFileSync(STORAGE_FILE_PATH, 'utf8'));
            let storedThemes = data.themes || { ...THEME_COLORS };
            let updated = false;

            for (let [k, v] of Object.entries(THEME_COLORS)) {
                if (!storedThemes[k]) {
                    storedThemes[k] = v;
                    updated = true;
                }
            }

            const activeTheme = data.activeTheme || CONFIG.startupTheme;

            if (updated || !data.themes) {
                saveStorageData(storedThemes, activeTheme);
            }

            return { themes: storedThemes, activeTheme };
        }
    } catch (e) {}

    const initialData = { themes: { ...THEME_COLORS }, activeTheme: CONFIG.startupTheme };
    saveStorageData(initialData.themes, initialData.activeTheme);
    return initialData;
};

const saveStorageData = (themes, activeTheme) => {
    try {
        const payload = {
            activeTheme: activeTheme || CONFIG.startupTheme,
            themes: themes
        };
        fs.writeFileSync(STORAGE_FILE_PATH, JSON.stringify(payload, null, 2), 'utf8');
    } catch (e) {
        console.error("Failed to save storage data to disk:", e);
    }
};

const getCustomThemes = () => {
    return loadStorageData().themes;
};

const saveCustomThemes = (customThemes, activeTheme) => {
    const current = loadStorageData();
    saveStorageData(customThemes, activeTheme || current.activeTheme);
};

const getLastSelectedTheme = () => {
    return loadStorageData().activeTheme;
};

const saveLastSelectedTheme = (themeName) => {
    const current = loadStorageData();
    saveStorageData(current.themes, themeName);
};

// COLOR UTILITIES
const adjustColor = (hex, percent) => {
    let num = parseInt(hex.replace('#', ''), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
};

const hexToRgba = (hex, alpha) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    let num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
};

// GLOBAL STYLES & DYNAMIC THEME INJECTION
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
        const className = `theme-${name.replace(/\s+/g, '_')}`;
        const main = colors.mainColor || '#0a1f18';
        const accent = colors.accentColor || '#ce1126';
        const accent2 = colors.accentColor2 || '#00e676';
        const error = colors.errorColor || '#ff0031';
        const online = colors.stateOnline || '#59b240';
        const away = colors.stateAway || '#ef9f00';
        const patreon = colors.patreonColor || '#f5b50e';
        const dev = colors.devColor || '#f5b50e';

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
            body.${className} .channelsList .channelItem.router-link-active,
            body.${className} .channelsList .channelItem:hover {
                background-color: ${error} !important;
                border-color: ${error} !important;
            }
            .custom-theme-btn[data-active-theme="${name}"] {
                background: ${accent} !important;
                color: #ffffff !important;
                border-color: rgba(255, 255, 255, 0.4) !important;
            }
        `;
    });

    style.innerHTML = `
        .star-icon {
            fill: none;
            stroke: rgba(255, 255, 255, 0.3);
            stroke-width: 2;
            transition: fill 0.3s ease, stroke 0.3s ease;
            cursor: pointer;
        }
        .star-icon:hover { stroke: white; }
        .logo { display: none !important; }

        .channelsList .channelIcon,
        .channelsList .channelLogo,
        .channelsList a img,
        .channelsList a .icon,
        .channelItem .iconWrapper,
        .channelItem img {
            border-radius: 50% !important;
            overflow: hidden !important;
        }

        .custom-theme-btn {
            padding: 5px 8px !important;
            border-radius: 4px !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            cursor: pointer !important;
            background: rgba(0, 0, 0, 0.4) !important;
            color: rgba(255, 255, 255, 0.7) !important;
            font-family: inherit !important;
            font-size: 11px !important;
            font-weight: 500 !important;
            width: 100% !important;
            text-align: left !important;
            transition: all 0.2s ease !important;
        }
        .custom-theme-btn:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            color: #ffffff !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
        }

        .theme-action-bar {
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 4px;
            padding: 4px 6px;
            margin-bottom: 6px;
        }
        .theme-action-icon {
            width: 14px;
            height: 14px;
            cursor: pointer;
            fill: rgba(255, 255, 255, 0.5);
            transition: fill 0.2s ease;
            pointer-events: auto;
        }
        .theme-action-icon path { pointer-events: none; }
        .theme-action-icon:hover { fill: #ffffff; }

        .fc-context-menu {
            position: absolute;
            z-index: 10000;
            background: #18181b;
            border: 1px solid #3f3f46;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            padding: 4px 0;
            min-width: 120px;
        }
        .fc-context-menu-item {
            padding: 6px 12px;
            font-size: 11px;
            color: #d4d4d8;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .fc-context-menu-item:hover {
            background: #27272a;
            color: #ffffff;
        }

        .fc-modal-box {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #18181b;
            border: 1px solid #3f3f46;
            border-radius: 8px;
            padding: 20px;
            width: 320px;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 8px 24px rgba(0,0,0,0.8);
            color: #ffffff;
            font-family: inherit;
            z-index: 9999;
            resize: both;
            overflow: auto;
        }
        .fc-modal-header {
            cursor: move;
            user-select: none;
            margin: -20px -20px 12px -20px;
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid #3f3f46;
            font-weight: bold;
            font-size: 14px;
        }
        .fc-modal-field { margin-bottom: 10px; }
        .fc-modal-field label {
            display: block;
            font-size: 13.5px;
            font-weight: 700;
            color: #ffffff;
            -webkit-text-stroke: 0.5px #000000;
            paint-order: stroke fill;
            margin-bottom: 4px;
        }
        .fc-modal-field input[type="text"] {
            width: 100%;
            background: #27272a;
            border: 1px solid #3f3f46;
            border-radius: 4px;
            color: #fff;
            padding: 6px 8px;
            box-sizing: border-box;
            user-select: text !important;
            -webkit-user-select: text !important;
        }
        .fc-modal-field input[type="text"]::selection {
            background: #0078d7 !important;
            color: #ffffff !important;
        }
        .fc-modal-field input[type="text"]::-moz-selection {
            background: #0078d7 !important;
            color: #ffffff !important;
        }

        .fc-color-row {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .fc-color-preview-bar {
            width: 60px;
            height: 26px;
            border-radius: 4px;
            border: 1px solid #3f3f46;
            cursor: pointer;
            position: relative;
            flex-shrink: 0;
        }
        .fc-color-preview-bar input[type="color"] {
            position: absolute;
            opacity: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
        .fc-color-text-input {
            flex-grow: 1;
            background: #27272a;
            border: 1px solid #3f3f46;
            border-radius: 4px;
            color: #b5b5ba;
            padding: 4px 8px;
            font-size: 11.5px;
            box-sizing: border-box;
            user-select: text !important;
            -webkit-user-select: text !important;
        }
        .fc-color-text-input::selection {
            background: #0078d7 !important;
            color: #ffffff !important;
        }
        .fc-color-text-input::-moz-selection {
            background: #0078d7 !important;
            color: #ffffff !important;
        }

        .fc-modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 14px;
        }
        .fc-modal-btn {
            padding: 6px 12px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
        }
        .fc-modal-btn-save { background: #16a34a; color: white; }
        .fc-modal-btn-cancel { background: #3f3f46; color: white; }
        ${dynamicCSS}
    `;
};

// HELPERS
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
    container.style.cssText = 'display: flex; justify-content: space-between; margin-top: 15px; margin-bottom: 15px; width: 100%;';

    const buttons = [
        { title: 'Go to previous fav channel', svg: '<polygon points="10,0 10,20 0,10" />', callback: prevCallback },
        { title: 'Go to next fav channel', svg: '<polygon points="0,0 10,10 0,20" />', callback: nextCallback },
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

function createFlagElement(country) {
    const flagWrapper = document.createElement('span');
    flagWrapper.className = 'flagWrapper fc-enhanced-element';
    flagWrapper.style.cssText = `width: 20px; display: inline-block; height: 14px; background-image: url('static/flags/${country.iso_code.toLowerCase()}.png'); background-size: contain; margin-left: 5px;`;
    flagWrapper.title = country.full_name || '';
    return flagWrapper;
}

function createPingElement(pingSrc, title) {
    const pingWrapper = document.createElement('span');
    pingWrapper.className = 'pingWrapper fc-enhanced-element';
    pingWrapper.style.cssText = `width: 15px; display: inline-block; height: 15px; background-image: url('${pingSrc}'); background-size: contain; margin-left: 5px;`;
    pingWrapper.title = title || '';
    return pingWrapper;
}

function createRankElement(rankSrc, title) {
    const rankWrapper = document.createElement('span');
    rankWrapper.className = 'rankWrapper fc-enhanced-element';
    rankWrapper.style.cssText = `width: 15px; display: inline-block; height: 15px; background-image: url('${rankSrc}'); background-size: contain; margin-left: 5px;`;
    rankWrapper.title = title || '';
    return rankWrapper;
}

function createStatusElement(isAway) {
    const statusWrapper = document.createElement('div');
    statusWrapper.className = 'statusWrapper fc-enhanced-element';
    statusWrapper.title = isAway ? 'Away' : 'Online';
    statusWrapper.style.cssText = `width: 10px; display: inline-block; height: 10px; border-radius: 50%; background-color: ${isAway ? 'orange' : 'green'}; margin-left: 5px;`;
    return statusWrapper;
}

const processMessages = (FCADE) => {
    if (!CONFIG.addMorePlayerInfoToChat) return;

    const globalUsers = FCADE.globalUsers;
    const messageElements = document.querySelectorAll('#app div.message:not([data-has-flag])');

    messageElements.forEach(messageElement => {
        const authorElement = messageElement.querySelector('span.author');
        if (!authorElement) return;

        const userKey = authorElement.innerText.trim();
        const globalUser = globalUsers[userKey];

        if (globalUser && globalUser.country) {
            const countryData = globalUser.country;
            const activeChannelId = FCADE.activeChannelId;
            const usersList = FCADE.$refs[activeChannelId]?.[0]?.$refs?.usersList || [];
            const userFound = (usersList.$children || []).find(child => child?.user?.id === userKey);

            const pingImg = userFound?.pingSrc;
            const rankImg = userFound?.rankSrc;
            const ping = globalUser?.ping;

            if (!messageElement.querySelector('.fc-enhanced-element')) {
                const statusElement = createStatusElement(globalUser?.away);
                const flagElement = createFlagElement(countryData);

                authorElement.parentElement.insertBefore(statusElement, authorElement);
                authorElement.appendChild(flagElement);

                if (rankImg) authorElement.appendChild(createRankElement(rankImg, userFound?.rankTitle));
                if (pingImg) authorElement.appendChild(createPingElement(pingImg, userFound?.pingTitle));

                if (ping !== undefined) {
                    const pingTextElement = document.createElement('span');
                    pingTextElement.className = 'pingText fc-enhanced-element';
                    pingTextElement.style.cssText = 'font-size: small; margin-left: 5px; font-weight: normal;';
                    pingTextElement.innerHTML = `(ping: ~${ping} ms)`;
                    authorElement.appendChild(pingTextElement);
                }
            }
            messageElement.dataset.hasFlag = "true";
        }
    });
};

const waitForVue = (callback) => {
    const appElement = document.querySelector('#app');
    if (appElement?.__vue__?._data?.global?.setTheme) {
        callback(appElement.__vue__);
    } else {
        setTimeout(() => waitForVue(callback), 300);
    }
};

// MAIN INITIALIZATION
let activeSelectedTheme = null;
let currentActiveModalBox = null;

const fightcadePlugins = (fcWindow) => {
    fcWindow.currentChannel = 0;

    waitForVue((FCADE) => {
        const setTheme = (theme, skipLiveModalUpdate = false) => {
            activeSelectedTheme = theme;
            saveLastSelectedTheme(theme);
            
            const app = document.querySelector('#app');
            const targets = [document.body, app].filter(Boolean);

            targets.forEach(el => {
                el.classList.forEach(cls => {
                    if (cls.startsWith('theme-')) el.classList.remove(cls);
                });
                el.classList.add(`theme-${theme.replace(/\s+/g, '_')}`);
            });

            try {
                FCADE._data.global.setTheme('default');
            } catch (e) {}

            document.querySelectorAll('.custom-theme-btn').forEach(btn => {
                if (btn.getAttribute('data-theme') === theme) {
                    btn.setAttribute('data-active-theme', theme);
                } else {
                    btn.removeAttribute('data-active-theme');
                }
            });

            if (currentActiveModalBox && !skipLiveModalBoxUpdate) {
                const headerTitle = currentActiveModalBox.querySelector('.fc-modal-header');
                if (headerTitle && headerTitle.textContent.startsWith('Edit Theme')) {
                    const customThemes = getCustomThemes();
                    const existing = customThemes[theme] || {};

                    const setFieldVal = (idPrefix, val) => {
                        const colIn = document.getElementById(`fc-theme-${idPrefix}`);
                        const txtIn = document.getElementById(`fc-text-${idPrefix}`);
                        const barIn = document.getElementById(`bar-${idPrefix}`);
                        const targetVal = val || '#ffffff';
                        if (colIn) colIn.value = targetVal;
                        if (txtIn) txtIn.value = targetVal;
                        if (barIn) barIn.style.background = targetVal;
                    };

                    const nameInput = document.getElementById('fc-theme-name');
                    if (nameInput) nameInput.value = theme;

                    setFieldVal('main', existing.mainColor);
                    setFieldVal('accent', existing.accentColor);
                    setFieldVal('accent2', existing.accentColor2);
                    setFieldVal('error', existing.errorColor);
                    setFieldVal('online', existing.stateOnline);
                    setFieldVal('away', existing.stateAway);
                    setFieldVal('patreon', existing.patreonColor);
                    setFieldVal('dev', existing.devColor);

                    currentActiveModalBox.dataset.editingTheme = theme;
                }
            }
        };

        let skipLiveModalBoxUpdate = false;

        const openNewThemeModal = () => {
            if (currentActiveModalBox) currentActiveModalBox.remove();
            
            const customThemes = getCustomThemes();
            let newThemeName = "new";
            let counter = 1;
            while (customThemes[newThemeName] || CONFIG.themes.includes(newThemeName)) {
                newThemeName = `new${counter}`;
                counter++;
            }

            const whiteHex = "#ffffff";

            const modalBox = document.createElement('div');
            modalBox.className = 'fc-modal-box';
            currentActiveModalBox = modalBox;
            modalBox.dataset.editingTheme = "";

            modalBox.innerHTML = `
                <div class="fc-modal-header">New Theme</div>
                <div class="fc-modal-field">
                    <label>Theme Name</label>
                    <input type="text" id="fc-theme-name" value="${newThemeName}">
                </div>
                
                <div class="fc-modal-field">
                    <label>Background</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-main" style="background: ${whiteHex};">
                            <input type="color" id="fc-theme-main" value="${whiteHex}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-main" value="${whiteHex}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Primary accent</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-accent" style="background: ${whiteHex};">
                            <input type="color" id="fc-theme-accent" value="${whiteHex}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-accent" value="${whiteHex}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Secondary accent</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-accent2" style="background: ${whiteHex};">
                            <input type="color" id="fc-theme-accent2" value="${whiteHex}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-accent2" value="${whiteHex}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Lobby border</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-error" style="background: ${whiteHex};">
                            <input type="color" id="fc-theme-error" value="${whiteHex}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-error" value="${whiteHex}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Online status</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-online" style="background: ${whiteHex};">
                            <input type="color" id="fc-theme-online" value="${whiteHex}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-online" value="${whiteHex}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Away/busy status</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-away" style="background: ${whiteHex};">
                            <input type="color" id="fc-theme-away" value="${whiteHex}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-away" value="${whiteHex}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Patreon badge color</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-patreon" style="background: ${whiteHex};">
                            <input type="color" id="fc-theme-patreon" value="${whiteHex}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-patreon" value="${whiteHex}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Dev badge color</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-dev" style="background: ${whiteHex};">
                            <input type="color" id="fc-theme-dev" value="${whiteHex}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-dev" value="${whiteHex}">
                    </div>
                </div>

                <div class="fc-modal-actions">
                    <button class="fc-modal-btn fc-modal-btn-cancel" id="fc-modal-cancel">Cancel</button>
                    <button class="fc-modal-btn fc-modal-btn-save" id="fc-modal-save">Save</button>
                </div>
            `;
            document.body.appendChild(modalBox);

            setupModalInteractivity(modalBox, null);
        };

        const openEditThemeModal = (editName) => {
            if (currentActiveModalBox) currentActiveModalBox.remove();

            const customThemes = getCustomThemes();
            const existing = customThemes[editName] || {};

            const mainCol = existing.mainColor || '#ffffff';
            const accentCol = existing.accentColor || '#ffffff';
            const accent2Col = existing.accentColor2 || '#ffffff';
            const errorCol = existing.errorColor || '#ffffff';
            const onlineCol = existing.stateOnline || '#ffffff';
            const awayCol = existing.stateAway || '#ffffff';
            const patreonCol = existing.patreonColor || '#ffffff';
            const devCol = existing.devColor || '#ffffff';

            const modalBox = document.createElement('div');
            modalBox.className = 'fc-modal-box';
            currentActiveModalBox = modalBox;
            modalBox.dataset.editingTheme = editName;

            modalBox.innerHTML = `
                <div class="fc-modal-header">Edit Theme</div>
                <div class="fc-modal-field">
                    <label>Theme Name</label>
                    <input type="text" id="fc-theme-name" value="${editName}">
                </div>
                
                <div class="fc-modal-field">
                    <label>Background</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-main" style="background: ${mainCol};">
                            <input type="color" id="fc-theme-main" value="${mainCol}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-main" value="${mainCol}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Primary accent</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-accent" style="background: ${accentCol};">
                            <input type="color" id="fc-theme-accent" value="${accentCol}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-accent" value="${accentCol}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Secondary accent</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-accent2" style="background: ${accent2Col};">
                            <input type="color" id="fc-theme-accent2" value="${accent2Col}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-accent2" value="${accent2Col}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Lobby border</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-error" style="background: ${errorCol};">
                            <input type="color" id="fc-theme-error" value="${errorCol}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-error" value="${errorCol}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Online status</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-online" style="background: ${onlineCol};">
                            <input type="color" id="fc-theme-online" value="${onlineCol}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-online" value="${onlineCol}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Away/busy status</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-away" style="background: ${awayCol};">
                            <input type="color" id="fc-theme-away" value="${awayCol}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-away" value="${awayCol}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Patreon badge color</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-patreon" style="background: ${patreonCol};">
                            <input type="color" id="fc-theme-patreon" value="${patreonCol}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-patreon" value="${patreonCol}">
                    </div>
                </div>

                <div class="fc-modal-field">
                    <label>Dev badge color</label>
                    <div class="fc-color-row">
                        <div class="fc-color-preview-bar" id="bar-dev" style="background: ${devCol};">
                            <input type="color" id="fc-theme-dev" value="${devCol}">
                        </div>
                        <input type="text" class="fc-color-text-input" id="fc-text-dev" value="${devCol}">
                    </div>
                </div>

                <div class="fc-modal-actions">
                    <button class="fc-modal-btn fc-modal-btn-cancel" id="fc-modal-cancel">Cancel</button>
                    <button class="fc-modal-btn fc-modal-btn-save" id="fc-modal-save">Save</button>
                </div>
            `;
            document.body.appendChild(modalBox);

            setupModalInteractivity(modalBox, editName);
        };

        const setupModalInteractivity = (modalBox, originalEditName) => {
            const bindColorSync = (colorId, textId, barId) => {
                const colorInput = document.getElementById(colorId);
                const textInput = document.getElementById(textId);
                const bar = document.getElementById(barId);

                colorInput.oninput = (e) => {
                    const val = e.target.value;
                    textInput.value = val;
                    bar.style.background = val;
                };

                textInput.oninput = (e) => {
                    const val = e.target.value.trim();
                    if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
                        colorInput.value = val;
                        bar.style.background = val;
                    }
                };

                textInput.addEventListener('keydown', (e) => {
                    e.stopPropagation();
                    if (e.ctrlKey && e.key.toLowerCase() === 'z') {
                        document.execCommand('undo');
                    }
                });
                textInput.addEventListener('mousedown', (e) => { e.stopPropagation(); });
            };

            bindColorSync('fc-theme-main', 'fc-text-main', 'bar-main');
            bindColorSync('fc-theme-accent', 'fc-text-accent', 'bar-accent');
            bindColorSync('fc-theme-accent2', 'fc-text-accent2', 'bar-accent2');
            bindColorSync('fc-theme-error', 'fc-text-error', 'bar-error');
            bindColorSync('fc-theme-online', 'fc-text-online', 'bar-online');
            bindColorSync('fc-theme-away', 'fc-text-away', 'bar-away');
            bindColorSync('fc-theme-patreon', 'fc-text-patreon', 'bar-patreon');
            bindColorSync('fc-theme-dev', 'fc-text-dev', 'bar-dev');

            const header = modalBox.querySelector('.fc-modal-header');
            let isDragging = false, startX, startY, initialLeft, initialTop;

            header.onmousedown = (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = modalBox.getBoundingClientRect();
                modalBox.style.transform = 'none';
                modalBox.style.left = `${rect.left}px`;
                modalBox.style.top = `${rect.top}px`;
                initialLeft = rect.left;
                initialTop = rect.top;
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
            nameInput.focus();
            nameInput.select();
            
            nameInput.oninput = () => {
                modalBox.dataset.editingTheme = nameInput.value.trim();
            };

            nameInput.addEventListener('keydown', (e) => {
                e.stopPropagation();
                if (e.ctrlKey && e.key.toLowerCase() === 'z') {
                    document.execCommand('undo');
                }
            });

            document.getElementById('fc-modal-cancel').onclick = () => {
                modalBox.remove();
                currentActiveModalBox = null;
            };

            document.getElementById('fc-modal-save').onclick = () => {
                const targetEditName = modalBox.dataset.editingTheme || originalEditName;
                const newName = nameInput.value.trim();
                if (!newName) return alert('Please enter a theme name.');

                const themes = getCustomThemes();

                if (targetEditName && targetEditName !== newName && themes[targetEditName]) {
                    delete themes[targetEditName];
                    const cfgIdx = CONFIG.themes.indexOf(targetEditName);
                    if (cfgIdx > -1) CONFIG.themes.splice(cfgIdx, 1);
                }

                themes[newName] = {
                    mainColor: document.getElementById('fc-text-main').value.trim() || document.getElementById('fc-theme-main').value,
                    accentColor: document.getElementById('fc-text-accent').value.trim() || document.getElementById('fc-theme-accent').value,
                    accentColor2: document.getElementById('fc-text-accent2').value.trim() || document.getElementById('fc-theme-accent2').value,
                    errorColor: document.getElementById('fc-text-error').value.trim() || document.getElementById('fc-theme-error').value,
                    stateOnline: document.getElementById('fc-text-online').value.trim() || document.getElementById('fc-theme-online').value,
                    stateAway: document.getElementById('fc-text-away').value.trim() || document.getElementById('fc-theme-away').value,
                    patreonColor: document.getElementById('fc-text-patreon').value.trim() || document.getElementById('fc-theme-patreon').value,
                    devColor: document.getElementById('fc-text-dev').value.trim() || document.getElementById('fc-theme-dev').value
                };

                if (!CONFIG.themes.includes(newName)) {
                    CONFIG.themes.push(newName);
                }

                saveCustomThemes(themes, newName);
                addGlobalStyles();
                renderThemeButtons();
                
                skipLiveModalBoxUpdate = true;
                setTheme(newName);
                skipLiveModalBoxUpdate = false;

                modalBox.remove();
                currentActiveModalBox = null;
            };
        };

        const deleteTheme = (name = activeSelectedTheme) => {
            if (!name) return alert('Please select a theme to delete.');
            const customThemes = getCustomThemes();
            if (confirm(`Delete theme "${name}"?`)) {
                if (customThemes[name]) {
                    delete customThemes[name];
                }
                saveCustomThemes(customThemes, 'Default');
                
                const configIndex = CONFIG.themes.indexOf(name);
                if (configIndex > -1) CONFIG.themes.splice(configIndex, 1);

                addGlobalStyles();
                renderThemeButtons();
                setTheme('Default');
            }
        };

        const showContextMenu = (e, themeName) => {
            e.preventDefault();
            activeSelectedTheme = themeName;
            const existing = document.querySelector('.fc-context-menu');
            if (existing) existing.remove();

            const menu = document.createElement('div');
            menu.className = 'fc-context-menu';
            menu.style.top = `${e.pageY}px`;
            menu.style.left = `${e.pageX}px`;

            menu.innerHTML = `
                <div class="fc-context-menu-item" id="ctx-edit" title="Edit">Edit</div>
                <div class="fc-context-menu-item" id="ctx-delete" title="delete" style="color: #ef4444;">delete</div>
            `;

            document.body.appendChild(menu);

            const removeMenu = () => menu.remove();
            setTimeout(() => window.addEventListener('click', removeMenu, { once: true }), 10);

            document.getElementById('ctx-edit').onclick = () => openEditThemeModal(themeName);
            document.getElementById('ctx-delete').onclick = () => deleteTheme(themeName);
        };

        let themeContainer = null;

        const renderThemeButtons = () => {
            if (!themeContainer) return;
            themeContainer.innerHTML = '';

            const actionBar = document.createElement('div');
            actionBar.className = 'theme-action-bar';
            actionBar.innerHTML = `
                <svg class="theme-action-icon" id="act-add" title="New" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                <svg class="theme-action-icon" id="act-rename" title="Edit" viewBox="0 0 24 24"><path d="M18.41 5.8L17.2 4.59c-.78-.78-2.05-.78-2.83 0l-2.68 2.68 3.95 3.95 2.77-2.77c.79-.78.79-2.05 0-2.65zM2 17.25V21h3.75L15.42 11.33l-3.75-3.75L2 17.25z"/></svg>
                <svg class="theme-action-icon" id="act-delete" title="delete" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            `;
            themeContainer.appendChild(actionBar);

            document.getElementById('act-add').onclick = () => openNewThemeModal();
            document.getElementById('act-rename').onclick = () => openEditThemeModal(activeSelectedTheme);
            document.getElementById('act-delete').onclick = () => deleteTheme();

            const customThemes = getCustomThemes();
            Object.keys(customThemes).forEach(t => {
                if (!CONFIG.themes.includes(t)) {
                    CONFIG.themes.push(t);
                }
            });

            CONFIG.themes.forEach((theme) => {
                const button = document.createElement('button');
                button.textContent = theme;
                button.className = 'custom-theme-btn';
                button.setAttribute('data-theme', theme);
                if (theme === activeSelectedTheme) {
                    button.setAttribute('data-active-theme', theme);
                }
                button.addEventListener('click', () => setTheme(theme));
                button.addEventListener('contextmenu', (e) => showContextMenu(e, theme));
                themeContainer.appendChild(button);
            });
        };

        const showFavorites = () => {
            const searchChannel = FCADE.$children.find((child) => child.$options.name === 'search-channel');
            if (searchChannel) {
                Object.assign(searchChannel, {
                    yearFilter: 0,
                    genreFilter: 0,
                    systemFilter: 0,
                    rankedFilter: 0,
                    textFilter: '',
                    favorites: true,
                });

                if (FCADE.activeChannelId !== 'search-channel') FCADE.gotoChannel('search-channel');
                searchChannel.requestChannels();
            }
        };

        const changeChannel = (direction) => {
            const favorites = FCADE.global.localUser.favoritesChannels;
            const currentChannel = fcWindow.currentChannel;

            const nextIndex = (currentChannel + direction + favorites.length) % favorites.length;
            const nextChannel = favorites[nextIndex];

            fcWindow.currentChannel = nextIndex;

            const loadedChannels = FCADE.channels.filter((c) => c.emulator).map((c) => c.id);
            const channelToRemove = favorites.find((c) => loadedChannels.includes(c));
            if (channelToRemove) FCADE.leaveChannel(channelToRemove);

            FCADE.joinChannel(nextChannel);
            setTimeout(() => FCADE.gotoChannel(nextChannel), 1000);
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
                    addStyledLink(targetElement, showFavorites, 'Show Favorites', '<polygon points="18,3 23,14 33,14 26,21 29,32 18,26 8,32 11,21 3,14 14,14" />');
                }
            }

            if (CONFIG.showThemeButtons && !themeContainer) {
                themeContainer = document.createElement('div');
                themeContainer.style.cssText = 'display: flex; flex-direction: column; gap: 4px; margin-top: 15px; width: 100%; padding: 0 5px; box-sizing: border-box;';
                targetElement.parentNode.insertBefore(themeContainer, targetElement.nextSibling);
                renderThemeButtons();
            }

            const initialTheme = getLastSelectedTheme();
            setTheme(initialTheme);
        };

        initUIElements();

        const appContainer = fcWindow.document.querySelector('#app');
        if (appContainer) {
            const observer = new MutationObserver(() => processMessages(FCADE));
            observer.observe(appContainer, { childList: true, subtree: true });
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
            if (!CONFIG.themes.includes(name)) CONFIG.themes.push(name);
            saveCustomThemes(themes, name);
            addGlobalStyles();
        },
        deleteThemeBridge: (name) => {
            const themes = getCustomThemes();
            if (themes[name]) {
                delete themes[name];
                saveCustomThemes(themes, 'Default');
                const idx = CONFIG.themes.indexOf(name);
                if (idx > -1) CONFIG.themes.splice(idx, 1);
                addGlobalStyles();
            }
        }
    };
};

addGlobalStyles();
setupInjectBridge(window);
fightcadePlugins(window);