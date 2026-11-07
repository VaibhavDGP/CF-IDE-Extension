const ICONS = {
    code: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 18 2 12 8 6"></polyline><polyline points="16 6 22 12 16 18"></polyline></svg>`,
    close: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    play: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 21 12 6 21 6 3"></polygon></svg>`,
    playOutline: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 21 12 6 21 6 3"></polygon></svg>`,
    pause: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="4" x2="9" y2="20"></line><line x1="15" y1="4" x2="15" y2="20"></line></svg>`,
    reset: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,
    clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15.5 14"></polyline></svg>`,
    check: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    cross: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    alert: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 1 21h22L12 2z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    spinner: `<svg class="cpeasy-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 3a9 9 0 1 1-9 9"></path></svg>`,
};

(() => {
    if (window.location.href.includes('/submit')) {
       let handoff = null;

try {
    const key = "cpeasy_submission_handoff";
    const raw = sessionStorage.getItem(key);

    if (raw) {
        const candidate = JSON.parse(raw);
        const currentPath = window.location.pathname.replace(/\/$/, "");
        const age = Date.now() - candidate.createdAt;

        const valid =
            typeof candidate.code === "string" &&
            candidate.code.trim().length > 0 &&
            typeof candidate.language === "string" &&
            candidate.language.length > 0 &&
            typeof candidate.problem === "string" &&
            candidate.problem.length > 0 &&
            Number.isFinite(candidate.createdAt) &&
            age >= 0 &&
            age <= 10 * 60 * 1000 &&
            candidate.targetPath === currentPath;

        // Consume before autofill begins. The saved solution draft remains.
        sessionStorage.removeItem(key);

        if (valid) {
            handoff = candidate;
        }
    }
} catch (error) {
    console.warn("cpeasy: Could not read submission handoff:", error);
}

const pendingCode = handoff?.code;
const pendingLang = handoff?.language;
const pendingLangLabels = Array.isArray(handoff?.languageLabels)
    ? handoff.languageLabels
    : [];
const pendingProblem = handoff?.problem;
        

        if (pendingCode) {
            let fillAttempts = 0;
            const maxFillAttempts = 80;

            let editorSyncPending = false;
let editorSynced = false;

            const tryAutoFill = () => {
                fillAttempts++;

                const sourceTextarea = document.getElementById('sourceCodeTextarea');
                const langSelect = document.querySelector('select[name="programTypeId"]');
                const problemInput = document.querySelector('input[name="submittedProblemCode"]');
                const problemIndexSelect = document.querySelector('select[name="submittedProblemIndex"]');

                const problemField = problemInput || problemIndexSelect;

if (!sourceTextarea || !langSelect || !problemField) {
    if (fillAttempts >= maxFillAttempts) {
        clearInterval(fillTimer);
        console.warn(
            "cpeasy: Submission form did not finish loading. Saved code was kept."
        );
    }
    return;
}

if (sourceTextarea && langSelect && problemField) {
                    if (langSelect && pendingLang && pendingLang !== "undefined") {
                        const options = Array.from(langSelect.options)
    .filter(option => !option.disabled && option.value);

// Always try the precise language ID first.
let matchingOption = options.find(
    option => option.value === pendingLang
);

// Use a label only when it identifies exactly one available option.
// Multiple compiler versions require the user to choose explicitly.
if (!matchingOption) {
    const labels = Array.isArray(pendingLangLabels)
        ? pendingLangLabels.filter(
            label => typeof label === "string" && label.trim()
        )
        : [];

    const candidates = options.filter(option => {
        const text = option.textContent.toLowerCase();

        return labels.some(label =>
            text.includes(label.toLowerCase())
        );
    });

    if (candidates.length === 1) {
        matchingOption = candidates[0];
    }
}

if (!matchingOption) {
    clearInterval(fillTimer);
    console.warn(
        "cpeasy: Could not select a language unambiguously. " +
        "Saved code was kept. Select the language and paste your code manually."
    );
    return;
}

                        if (matchingOption && langSelect.value !== matchingOption.value) {
                            langSelect.value = matchingOption.value;
                            langSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }

                    if (problemInput && pendingProblem && pendingProblem !== "undefined") {
                        if (problemInput.value !== pendingProblem) {
                            problemInput.value = pendingProblem;
                            problemInput.dispatchEvent(new Event('input', { bubbles: true }));
                            problemInput.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }

                    if (problemIndexSelect && pendingProblem && pendingProblem !== "undefined") {
                        const targetIndex = pendingProblem.replace(/^[0-9]+/, '').toUpperCase();
                        for (let option of problemIndexSelect.options) {
                            if (option.value.toUpperCase() === targetIndex) {
                                if (problemIndexSelect.value !== option.value) {
                                    problemIndexSelect.value = option.value;
                                    problemIndexSelect.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                                break;
                            }
                        }
                    }

                    if (sourceTextarea) {
                        sourceTextarea.value = pendingCode;
                        sourceTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                        sourceTextarea.dispatchEvent(new Event('change', { bubbles: true }));

                        if (!editorSyncPending && !editorSynced) {
    editorSyncPending = true;

    chrome.runtime.sendMessage(
        {
            action: "syncSubmissionEditor",
            code: pendingCode
        },
        (response) => {
            editorSyncPending = false;

            if (chrome.runtime.lastError) {
                console.warn(
                    "cpeasy: Editor sync failed:",
                    chrome.runtime.lastError.message
                );
                return;
            }

            editorSynced = response?.success === true;

            if (response?.error) {
                console.warn("cpeasy: Editor sync failed:", response.error);
            }
        }
    );
}
                    }

                    const expectedProblemIndex = (pendingProblem || "")
    .replace(/^[0-9]+/, "")
    .toUpperCase();

const problemFilled = problemInput
    ? problemInput.value === pendingProblem
    : problemIndexSelect.value.toUpperCase() === expectedProblemIndex;

const sourceFilled =
    editorSynced && sourceTextarea.value === pendingCode;
const languageFilled = Boolean(langSelect.value);

// The temporary handoff was consumed when this page loaded.
// The solution remains saved independently in extension storage.
if (sourceFilled && languageFilled && problemFilled) {
    clearInterval(fillTimer);
} else if (fillAttempts >= maxFillAttempts) {
    clearInterval(fillTimer);
    console.warn(
        "cpeasy: Autofill could not finish. Saved code was kept."
    );
}
                } else if (fillAttempts >= maxFillAttempts) {
                    clearInterval(fillTimer);
                }
            };

            const fillTimer = setInterval(tryAutoFill, 100);
            tryAutoFill();
        }
    }
    let attempts = 0;
    const mount = () => {
        attempts++;
        if (mountLaunchButton() || attempts >= 25) {
            clearInterval(mountTimer);
        }
    };

    const mountTimer = setInterval(mount, 200);
    mount();
})();

function mountLaunchButton() {
    const problemTitle = document.querySelector('.problem-statement .header .title');
    if (!problemTitle || document.querySelector('.cpeasy-inject-btn')) return false;

    const actionBtn = document.createElement('button');
    actionBtn.type = "button";
    actionBtn.innerHTML = `<span class="cpeasy-inject-icon">${ICONS.code}</span><span>Open cpeasy IDE</span>`;
    actionBtn.className = "cpeasy-inject-btn";
    problemTitle.appendChild(actionBtn);

    actionBtn.addEventListener('click', () => {
        if (document.getElementById('cpeasy-ide-container')) return;
        openCpeasyIde(actionBtn);
    });
    return true;
}

function openCpeasyIde(actionBtn) {
    actionBtn.style.setProperty('display', 'none', 'important');

    const body = document.body;
    body.classList.add('cpeasy-split-body');
    body.style.setProperty('display', 'flex', 'important');
    body.style.setProperty('width', '100vw', 'important');
    body.style.setProperty('height', '100vh', 'important');
    body.style.setProperty('overflow', 'hidden', 'important');
    body.style.setProperty('margin', '0', 'important');

    const mainContent = document.querySelector('#body') || document.querySelector('#pageContent') || body.children[0];
    if (mainContent) {
        mainContent.classList.add('cpeasy-left-content');
        mainContent.style.setProperty('flex', '1', 'important');
        mainContent.style.setProperty('min-width', '0', 'important');
        mainContent.style.setProperty('overflow-x', 'auto', 'important');
        mainContent.style.setProperty('overflow-y', 'auto', 'important');
        mainContent.style.setProperty('height', '100vh', 'important');
        mainContent.style.setProperty('box-sizing', 'border-box', 'important');
    }

    const rightPane = document.createElement('aside');
    rightPane.id = 'cpeasy-ide-container';
    rightPane.innerHTML = `
    <div
        id="cpeasy-resizer-x"
        class="cpeasy-resizer-x"
        aria-label="Resize editor width"
    ></div>

    <div class="cpeasy-shell">
        <header class="cpeasy-topbar">
            <div class="cpeasy-brand">
                <span class="cpeasy-logo">cp</span>
                <span class="cpeasy-title">cpeasy</span>
            </div>

            <details class="cpeasy-settings">
                <summary title="Editor settings">Settings</summary>

                <div class="cpeasy-settings-panel">
                    <div class="cpeasy-settings-heading">
                        Editor settings
                    </div>

                    <div class="cpeasy-setting-row">
                        <span>Font size</span>
                        <span id="cpeasy-font-size-slot"></span>
                    </div>

                    <button
                        id="cpeasy-reset-template-btn"
                        class="cpeasy-secondary-btn"
                        type="button"
                        title="Reset code to the C++ template"
                    >
                        ${ICONS.reset}
                        <span>Reset code</span>
                    </button>
                </div>
            </details>

            <button
                id="close-cpeasy-ide"
                class="cpeasy-icon-btn cpeasy-close-btn"
                type="button"
                title="Close IDE"
                aria-label="Close IDE"
            >${ICONS.close}</button>
        </header>

        <section class="cpeasy-toolbar" aria-label="Editor controls">
            <div class="cpeasy-file-tab">
                <span class="cpeasy-file-icon">C++</span>
                <span>main.cpp</span>
            </div>

            <div class="cpeasy-toolbar-spacer"></div>

            <div class="cpeasy-timer" title="Practice timer">
                <span
                    id="cpeasy-timer-dot"
                    class="cpeasy-timer-dot"
                ></span>

                <span
                    id="cpeasy-stopwatch-display"
                    class="cpeasy-time-text"
                >00:00</span>

                <button
                    id="cpeasy-timer-toggle"
                    class="cpeasy-icon-btn cpeasy-icon-btn-sm"
                    type="button"
                    title="Pause timer"
                    aria-label="Pause timer"
                >${ICONS.pause}</button>

                <button
                    id="cpeasy-timer-reset"
                    class="cpeasy-icon-btn cpeasy-icon-btn-sm"
                    type="button"
                    title="Reset timer"
                    aria-label="Reset timer"
                >${ICONS.reset}</button>
            </div>

            <button
                id="cpeasy-run-btn"
                class="cpeasy-primary-btn"
                type="button"
            >${ICONS.play}<span>Run</span></button>

            <button
                id="cpeasy-submit-btn"
                class="cpeasy-submit-btn"
                type="button"
                title="Open the Codeforces submission page"
            >Submit ↗</button>
        </section>

        <main class="cpeasy-workspace">
            <section
                id="cpeasy-editor-wrapper"
                class="cpeasy-editor-panel"
                aria-label="C++ code editor"
            >
                <textarea id="cpeasy-textarea-editor"></textarea>
            </section>

            <div
                id="cpeasy-resizer-y"
                class="cpeasy-resizer-y"
                aria-label="Resize output panel"
            >
                <span class="cpeasy-resizer-grip"></span>
            </div>

            <section
                id="cpeasy-console-wrapper"
                class="cpeasy-console-panel"
                aria-label="Test results"
            >
                <div class="cpeasy-console-head">
                    <div class="cpeasy-console-title">Tests</div>
                    <div
                        id="cpeasy-run-timing"
                        class="cpeasy-run-timing"
                    ></div>
                </div>

                <div
                    id="cpeasy-console-output"
                    class="cpeasy-console-output"
                >
                    <div class="cpeasy-empty-state">
                        <strong>Ready to run.</strong>
                        <span>Run the samples or try a custom input.</span>
                    </div>
                </div>
            </section>
        </main>

        <footer class="cpeasy-footer">
            <select
                id="cpeasy-lang-select"
                class="cpeasy-select"
                aria-label="Editor language: C++"
                title="C++"
                disabled
            >
                <option value="text/x-c++src">C++</option>
            </select>
        </footer>
    </div>
`;
    body.appendChild(rightPane);

    initializeCpeasyIde({ rightPane, body, mainContent, actionBtn })
    .catch(error => {
        console.error("cpeasy: Initialization failed:", error);
        window.alert(
            "Could not load your saved solution. Please refresh the page " +
            "and try again. Existing drafts have not been deleted."
        );
    });
}

async function initializeCpeasyIde({ rightPane, body, mainContent, actionBtn }) {
    let stopwatchInterval = null;
    
    let activeTabIndex = 0;
    let previousMode = null;
    let latestCases = [];
    let latestResults = [];

    const targetTextArea = document.getElementById('cpeasy-textarea-editor');
    const langSelect = document.getElementById('cpeasy-lang-select');
    const runBtn = document.getElementById('cpeasy-run-btn');
    const consoleOutput = document.getElementById('cpeasy-console-output');
    const submitBtn = document.getElementById('cpeasy-submit-btn');

    const baseKey = 'cpeasy_code_' + window.location.pathname.replace(/\/$/, "");
    const customInputKey = 'cpeasy_custom_input_' + window.location.pathname.replace(/\/$/, "");
    
    const codeKeyFor = (mode) => `${baseKey}_${mode.replace(/[^a-z0-9]/gi, '_')}`;



    const getCodeForMode = async (mode) => {
    const key = codeKeyFor(mode);
    const stored = await chrome.storage.local.get(key);

    // Empty strings are valid drafts too.
    if (typeof stored[key] === "string") {
        return stored[key];
    }

    // Copy an old draft into extension storage without deleting the original.
    const legacy = localStorage.getItem(key);

    if (
        legacy !== null &&
        legacy !== "undefined" &&
        legacy !== "null"
    ) {
        await chrome.storage.local.set({ [key]: legacy });
        return legacy;
    }

    return CPEASY_CONFIG.templates[mode] || "";
};

    langSelect.value = "text/x-c++src";
previousMode = langSelect.value;

    targetTextArea.value = await getCodeForMode(langSelect.value);

    if (!targetTextArea || typeof window.CodeMirror === 'undefined') {
        console.error("cpeasy: CodeMirror is not loaded. Check manifest.json and lib folder.");
        return;
    }

    const editor = window.CodeMirror.fromTextArea(targetTextArea, {
        mode: langSelect.value,
        theme: "material",
        lineNumbers: true,
        autoCloseBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        lineWrapping: false
    });

    window.cpeasyEditor = editor;
    const cppEditorTools = CpeasyCppEditor.attach(editor);
    const fontSizeKey = "cpeasy_editor_font_size";
const allowedFontSizes = [12, 14, 16, 18, 20, 24];

const fontSizeSelect = document.createElement("select");
fontSizeSelect.className = "cpeasy-select";
fontSizeSelect.title = "Editor font size";
fontSizeSelect.setAttribute("aria-label", "Editor font size");

// Override the normal language-selector width.
fontSizeSelect.style.setProperty("min-width", "76px", "important");
fontSizeSelect.style.setProperty("max-width", "90px", "important");

allowedFontSizes.forEach(size => {
    const option = document.createElement("option");
    option.value = String(size);
    option.textContent = `${size}px`;
    fontSizeSelect.appendChild(option);
});

fontSizeSelect.value = "14";
rightPane.querySelector("#cpeasy-font-size-slot").append(fontSizeSelect);

function applyFontSize(size) {
    if (!allowedFontSizes.includes(size)) return;

    fontSizeSelect.value = String(size);

    // Existing editor CSS uses !important, so override it explicitly.
    editor.getWrapperElement().style.setProperty(
        "font-size",
        `${size}px`,
        "important"
    );

    editor.refresh();
}

let fontSizeChanged = false;
let fontSaveQueue = Promise.resolve();

fontSizeSelect.addEventListener("change", () => {
    fontSizeChanged = true;
    const size = Number(fontSizeSelect.value);

    applyFontSize(size);

    // Keep rapid preference changes in order.
    fontSaveQueue = fontSaveQueue
        .catch(() => {})
        .then(() => chrome.storage.local.set({
            [fontSizeKey]: size
        }))
        .catch(error => {
            console.warn("cpeasy: Could not save font size:", error);
        });
});

chrome.storage.local.get(fontSizeKey)
    .then(stored => {
        // Don't overwrite a choice made while the saved setting was loading.
        if (fontSizeChanged || !rightPane.isConnected) return;

        const savedSize = stored[fontSizeKey];

        if (allowedFontSizes.includes(savedSize)) {
            applyFontSize(savedSize);
        }
    })
    .catch(error => {
        console.warn("cpeasy: Could not load font size:", error);
    });
    editor.setSize("100%", "100%");
    editor.focus();
    setTimeout(() => editor.refresh(), 200);

    let loadingDraft = false;
let draftSaveQueue = Promise.resolve();

const saveStatus = document.createElement("span");
saveStatus.setAttribute("role", "status");
saveStatus.style.cssText =
    "display:block;padding:4px 12px;font-size:12px;color:#9aa6b2;";
saveStatus.textContent = "Draft loaded";
rightPane.querySelector(".cpeasy-footer").prepend(saveStatus);

let latestSaveId = 0;

function saveDraft(mode, code) {
    const key = codeKeyFor(mode);
    const saveId = ++latestSaveId;

    saveStatus.textContent = "Saving…";

    // Preserve write order, even if an earlier save failed.
    const operation = draftSaveQueue
        .catch(() => {})
        .then(() => chrome.storage.local.set({ [key]: code }));

    draftSaveQueue = operation;

    operation.then(
        () => {
            if (saveId === latestSaveId) {
                saveStatus.textContent = "Saved";
            }
        },
        error => {
            if (saveId === latestSaveId) {
                saveStatus.textContent =
                    "Save failed — copy your code somewhere safe";
            }

            console.error("cpeasy: Draft save failed:", error);
        }
    );

    return operation;
}

editor.on("change", () => {
    if (loadingDraft) return;

    // previousMode identifies the code currently displayed in the editor.
    void saveDraft(previousMode, editor.getValue());
});

let lastRunSnapshot = null;

const staleResultsNotice = document.createElement("div");
staleResultsNotice.setAttribute("role", "status");
staleResultsNotice.style.cssText =
    "display:none;padding:8px 12px;color:#fbbf24;" +
    "background:rgba(251,191,36,0.08);font-size:12px;";

consoleOutput.before(staleResultsNotice);

function updateResultsFreshness() {
    if (!lastRunSnapshot) {
        staleResultsNotice.style.display = "none";
        return;
    }

    const codeChanged =
        editor.getValue() !== lastRunSnapshot.code;

    const languageChanged =
        editor.getOption("mode") !== lastRunSnapshot.mode;

    const outdated = codeChanged || languageChanged;

    staleResultsNotice.textContent = languageChanged
        ? "Language changed — run again. Results below belong to the previous run."
        : "Code changed — run again. Results below belong to the previous run.";

    staleResultsNotice.style.display = outdated ? "block" : "none";
}

function recordRunSnapshot(code, mode) {
    lastRunSnapshot = { code, mode };
    updateResultsFreshness();
}

// Separate from autosave so loading another language's draft is checked too.
editor.on("change", updateResultsFreshness);

const closeIdeBtn = document.getElementById("close-cpeasy-ide");

const headerActions = document.createElement("div");
headerActions.style.cssText =
    "display:flex;align-items:center;gap:8px;";

const focusModeBtn = document.createElement("button");
focusModeBtn.type = "button";
focusModeBtn.className = "cpeasy-icon-btn";
focusModeBtn.textContent = "⛶";
focusModeBtn.title = "Expand editor";
focusModeBtn.setAttribute("aria-label", "Expand editor");
focusModeBtn.setAttribute("aria-pressed", "false");

closeIdeBtn.before(headerActions);
headerActions.append(focusModeBtn, closeIdeBtn);

const themeKey = "cpeasy_theme";
let currentTheme = "dark";
let themeChangedByUser = false;

const themeBtn = document.createElement("button");
themeBtn.type = "button";
themeBtn.className = "cpeasy-icon-btn";
themeBtn.setAttribute("aria-label", "Switch to light theme");

headerActions.prepend(themeBtn);

function applyTheme(theme) {
    currentTheme = theme === "light" ? "light" : "dark";
    const light = currentTheme === "light";

    rightPane.dataset.theme = currentTheme;

    // CodeMirror's default light theme is included in its existing CSS.
    editor.setOption("theme", light ? "default" : "material");

    themeBtn.textContent = light ? "☾" : "☀";
    themeBtn.title = light
        ? "Switch to dark theme"
        : "Switch to light theme";

    themeBtn.setAttribute("aria-label", themeBtn.title);
    editor.refresh();
}

applyTheme("dark");

chrome.storage.local.get(themeKey)
    .then(stored => {
        if (themeChangedByUser || !rightPane.isConnected) return;

        if (stored[themeKey] === "light" || stored[themeKey] === "dark") {
            applyTheme(stored[themeKey]);
        }
    })
    .catch(error => {
        console.warn("cpeasy: Could not load theme:", error);
    });

themeBtn.addEventListener("click", async () => {
    themeChangedByUser = true;
    themeBtn.disabled = true;

    applyTheme(currentTheme === "dark" ? "light" : "dark");

    try {
        await chrome.storage.local.set({
            [themeKey]: currentTheme
        });
    } catch (error) {
        console.warn("cpeasy: Could not save theme:", error);
        themeBtn.title += " — preference could not be saved";
    } finally {
        themeBtn.disabled = false;
    }
});

function setFocusMode(enabled) {
    rightPane.classList.toggle("cpeasy-focus-mode", enabled);

    if (mainContent) {
        mainContent.classList.toggle("cpeasy-focus-hidden", enabled);
    }

    focusModeBtn.textContent = enabled ? "↙" : "⛶";
    focusModeBtn.title = enabled
        ? "Return to split view"
        : "Expand editor";

    focusModeBtn.setAttribute("aria-label", focusModeBtn.title);
    focusModeBtn.setAttribute("aria-pressed", String(enabled));

    requestAnimationFrame(() => {
        if (!rightPane.isConnected) return;

        editor.setSize("100%", "100%");
        editor.refresh();
        editor.focus();
    });
}

focusModeBtn.addEventListener("click", () => {
    const enabled = rightPane.classList.contains("cpeasy-focus-mode");
    setFocusMode(!enabled);
});    


const resetTemplateBtn = document.getElementById(
    "cpeasy-reset-template-btn"
);

if (resetTemplateBtn) {
    // Separate backup for each problem and language.
    const backupKeyFor = mode => `${codeKeyFor(mode)}_reset_backup`;

    const restoreBtn = document.createElement('button');
    restoreBtn.type = 'button';
    restoreBtn.className = 'cpeasy-select';
    restoreBtn.textContent = 'Restore code';
    restoreBtn.title = 'Restore the solution saved before your last reset';
    restoreBtn.setAttribute('aria-label', restoreBtn.title);

    resetTemplateBtn.insertAdjacentElement('afterend', restoreBtn);

    const updateRestoreButton = () => {
        try {
            restoreBtn.hidden =
                localStorage.getItem(backupKeyFor(langSelect.value)) === null;
        } catch {
            restoreBtn.hidden = true;
        }
    };

    resetTemplateBtn.addEventListener("click", () => {
    const mode = previousMode || langSelect.value;
    const currentCode = editor.getValue();
    const template = CPEASY_CONFIG.templates[mode] || "";

    if (currentCode === template) return;

    if (!window.confirm(
        "Replace your current solution with the built-in template?\n\n" +
        "Your current code will be saved as a recovery copy."
    )) {
        return;
    }

    try {
        localStorage.setItem(backupKeyFor(mode), currentCode);
    } catch (error) {
        console.error("cpeasy: Could not save recovery copy:", error);
        window.alert(
            "Could not save a recovery copy. Your code has not been reset."
        );
        return;
    }

    editor.setValue(template);
    editor.focus();
    updateRestoreButton();
});

    restoreBtn.addEventListener('click', () => {
        const mode = langSelect.value;
        const backupKey = backupKeyFor(mode);

        try {
            const backup = localStorage.getItem(backupKey);

            if (backup === null) {
                updateRestoreButton();
                return;
            }

            const confirmed = window.confirm(
                'Restore your saved solution?\n\n' +
                'Your current editor contents will become the recovery copy.'
            );

            if (!confirmed) return;

            // Swap the two versions, allowing the restore to be reversed.
            localStorage.setItem(backupKey, editor.getValue());
            editor.setValue(backup);
            editor.focus();
            updateRestoreButton();
        } catch {
            window.alert(
                'Could not access the recovery copy. Please copy your code ' +
                'somewhere safe before trying again.'
            );
        }
    });

    
    updateRestoreButton();
}

    const timerKey =
    "cpeasy_timer_" + window.location.pathname.replace(/\/$/, "");

let timerState = {
    elapsedMs: 0,
    startedAt: Date.now()
};

// Restore this problem's timer from the current tab.
try {
    const raw = sessionStorage.getItem(timerKey);

    if (raw) {
        const saved = JSON.parse(raw);

        const valid =
            saved &&
            Number.isFinite(saved.elapsedMs) &&
            saved.elapsedMs >= 0 &&
            (
                saved.startedAt === null ||
                (
                    Number.isFinite(saved.startedAt) &&
                    saved.startedAt >= 0
                )
            );

        if (valid) {
            timerState = {
                elapsedMs: saved.elapsedMs,
                startedAt: saved.startedAt
            };
        }
    }
} catch (error) {
    console.warn("cpeasy: Could not restore timer:", error);
}

const timerDisplay = document.getElementById("cpeasy-stopwatch-display");
const timerToggle = document.getElementById("cpeasy-timer-toggle");
const timerReset = document.getElementById("cpeasy-timer-reset");
const timerDot = document.getElementById("cpeasy-timer-dot");

function getElapsedMs() {
    const runningTime = timerState.startedAt === null
        ? 0
        : Math.max(0, Date.now() - timerState.startedAt);

    return timerState.elapsedMs + runningTime;
}

function saveTimerState() {
    try {
        sessionStorage.setItem(timerKey, JSON.stringify(timerState));
    } catch (error) {
        console.warn("cpeasy: Could not save timer:", error);
        timerDisplay.title =
            "Timer could not be saved; it may reset after refreshing.";
    }
}

function renderTimer() {
    const running = timerState.startedAt !== null;

    timerDisplay.textContent = CpeasyUtils.formatTime(
        Math.floor(getElapsedMs() / 1000)
    );

    timerToggle.innerHTML = running ? ICONS.pause : ICONS.playOutline;
    timerToggle.title = running ? "Pause timer" : "Resume timer";
    timerToggle.setAttribute("aria-label", timerToggle.title);
    timerDot.classList.toggle("is-paused", !running);
}

timerToggle.addEventListener("click", () => {
    if (timerState.startedAt !== null) {
        // Freeze the total elapsed duration.
        timerState.elapsedMs = getElapsedMs();
        timerState.startedAt = null;
    } else {
        // Resume from the saved duration.
        timerState.startedAt = Date.now();
    }

    saveTimerState();
    renderTimer();
});

timerReset.addEventListener("click", () => {
    if (!window.confirm("Reset this problem's practice timer to zero?")) {
        return;
    }

    const wasRunning = timerState.startedAt !== null;

    timerState = {
        elapsedMs: 0,
        startedAt: wasRunning ? Date.now() : null
    };

    saveTimerState();
    renderTimer();
});

saveTimerState();
renderTimer();

// The interval only refreshes the display.
// Elapsed time comes from timestamps, not interval tick counts.
stopwatchInterval = setInterval(() => {
    timerDisplay.textContent = CpeasyUtils.formatTime(
        Math.floor(getElapsedMs() / 1000)
    );
}, 1000);

    

const initialPlan = buildRunPlan(
    localStorage.getItem(customInputKey) || ""
);

latestCases = initialPlan.displayCases;
latestResults = new Array(latestCases.length).fill(null);

renderTestInterface(latestCases, latestResults);

    const cleanupResizers = setupResizers({ rightPane, editor });
    runBtn.addEventListener('click', () => runCode());
    editor.addKeyMap({
    "Ctrl-Enter": () => {
        if (!runBtn.disabled) {
            runBtn.click();
        }
    },
    "Cmd-Enter": () => {
        if (!runBtn.disabled) {
            runBtn.click();
        }
    }
});

runBtn.title = "Run samples — Ctrl+Enter (Mac: Cmd+Enter)";
runBtn.setAttribute(
    "aria-keyshortcuts",
    "Control+Enter Meta+Enter"
);
    submitBtn.addEventListener('click', () => submitToCodeforces());

document.getElementById('close-cpeasy-ide').addEventListener('click', () => {
    if (stopwatchInterval) clearInterval(stopwatchInterval);
    cppEditorTools.dispose();
    cleanupResizers();
setFocusMode(false);
rightPane.remove();
        body.classList.remove('cpeasy-split-body');
        body.style.display = '';
        body.style.width = '';
        body.style.height = '';
        body.style.overflow = '';
        body.style.margin = '';

        if (mainContent) {
            mainContent.classList.remove('cpeasy-left-content');
            mainContent.style.flex = '';
            mainContent.style.minWidth = '';
            mainContent.style.overflowX = '';
            mainContent.style.overflowY = '';
            mainContent.style.height = '';
            mainContent.style.boxSizing = '';
        }
        actionBtn.style.setProperty('display', 'inline-flex', 'important');
    });

    async function runCode() {
        const code = editor.getValue();
        const selectedMode = langSelect.value;

        if (!code.trim()) {
            renderNotice("Code is empty. Add a solution before running samples.", "error");
            return;
        }

        const existingCustomTextarea = document.getElementById('cpeasy-custom-textarea');
        const activeCustomInput = existingCustomTextarea
            ? existingCustomTextarea.value
            : localStorage.getItem(customInputKey) || "";
        localStorage.setItem(customInputKey, activeCustomInput);

        const { runUnits, displayCases } = buildRunPlan(activeCustomInput);
        latestCases = displayCases;
        latestResults = new Array(displayCases.length).fill(null);

        // Mark skipped custom tests explicitly.
latestCases.forEach((testCase, index) => {
    if (testCase.isCustom && testCase.input.length === 0) {
        latestResults[index] = {
            status: "Not run — enter custom input",
            verdict: "custom",
            actual: "",
            error: ""
        };
    }
});

renderTestInterface(latestCases, latestResults);

if (runUnits.length === 0) {
    setRunTiming("No samples found. Enter custom input, then click Run.");

    const customIndex = latestCases.findIndex(testCase => testCase.isCustom);

    if (customIndex >= 0) {
        activeTabIndex = customIndex;
        renderTestInterface(latestCases, latestResults);
        document.getElementById("cpeasy-custom-textarea")?.focus();
    }

    return;
}

recordRunSnapshot(code, selectedMode);
setRunTiming("Running...");
setRunButtonState(true);

        const runStart = performance.now();
        let completedCalls = 0;

        try {
            let nextIndex = 0;
            const runWorker = async () => {
                while (nextIndex < runUnits.length) {
                    const unit = runUnits[nextIndex++];
                    await executeRunUnit(unit, { code, selectedMode });
                    completedCalls++;
                    renderTestInterface(latestCases, latestResults);
                }
            };

            const workerCount = Math.max(1, Math.min(CPEASY_CONFIG.maxParallelRuns, runUnits.length));
            await Promise.all(Array.from({ length: workerCount }, runWorker));
        } catch (err) {
            renderNotice(`Error: ${err.message}`, "error");
        } finally {
            const totalMs = Math.round(performance.now() - runStart);
            setRunTiming(`Finished in ${totalMs}ms - ${completedCalls} request${completedCalls === 1 ? '' : 's'}`);
            setRunButtonState(false);
        }
    }

    async function runCustomCode() {
    // Both execution buttons share the same running state.
    if (runBtn.disabled) return;

    const code = editor.getValue();
    const selectedMode = langSelect.value;

    if (!code.trim()) {
        window.alert("Enter some code before running.");
        editor.focus();
        return;
    }

    const inputArea = document.getElementById("cpeasy-custom-textarea");
    const input = inputArea ? inputArea.value : "";

    try {
        localStorage.setItem(customInputKey, input);
    } catch (error) {
        console.warn("cpeasy: Could not save custom input:", error);
    }

    // Keep the sample tabs visible, but clearly mark them as not executed.
    const plan = buildRunPlan(input);
    latestCases = plan.displayCases;

    latestResults = latestCases.map(testCase =>
        testCase.isCustom
            ? null
            : {
                status: "Not run",
                verdict: "custom",
                actual: "",
                error: ""
            }
    );

    const customIndex = latestCases.findIndex(testCase => testCase.isCustom);
    if (customIndex < 0) return;

    activeTabIndex = customIndex;
recordRunSnapshot(code, selectedMode);
setRunButtonState(true);
    renderTestInterface(latestCases, latestResults);
    setRunTiming("Running custom input…");

    const startedAt = performance.now();

    try {
        // Construct this unit explicitly so empty input is also supported.
        await executeRunUnit(
            {
                type: "single",
                stdin: input,
                displayIndex: customIndex
            },
            { code, selectedMode }
        );

        const elapsed = Math.round(performance.now() - startedAt);
        setRunTiming(`Custom run completed in ${elapsed}ms — 1 request`);
    } catch (error) {
        latestResults[customIndex] = {
            status: "Execution Error",
            verdict: "error",
            actual: "",
            error: error.message
        };

        setRunTiming("Custom run failed");
    } finally {
        setRunButtonState(false);
        renderTestInterface(latestCases, latestResults);
    }
}

    function setRunButtonState(running) {
    runBtn.disabled = running;
    runBtn.classList.toggle("is-loading", running);
    runBtn.innerHTML = running
        ? `${ICONS.spinner}<span>Running</span>`
        : `${ICONS.play}<span>Run</span>`;

    const customRunBtn = document.getElementById("cpeasy-run-custom-btn");
    const customInputArea = document.getElementById("cpeasy-custom-textarea");

    if (customRunBtn) {
        customRunBtn.disabled = running;
    }

    if (customInputArea) {
        customInputArea.disabled = running;
    }
}

    async function executeRunUnit(unit, { code, selectedMode }) {
        const displayIndices = unit.type === 'batch'
            ? unit.subCases.map((_, k) => unit.displayStartIndex + k)
            : [unit.displayIndex];

        displayIndices.forEach(updateTabRunning);

        try {
            const compilerName = CPEASY_CONFIG.judge0Compilers[selectedMode] || selectedMode;
            const response = await executeOnJudge0({ compilerName, code, stdin: unit.stdin });

            cppEditorTools.showCompilerErrors(
    response?.compiler_error || "",
    code
);

            if (unit.type === 'batch') {
                distributeBatchResult(unit, response);
            } else {
                latestResults[unit.displayIndex] = {
    ...normalizeRunResult(response, latestCases[unit.displayIndex]),
    executionTimeSeconds: response?.time,
    memoryKilobytes: response?.memory,
    inputUsed: unit.stdin
};
            }
        } catch (apiError) {
            const failResult = {
                status: "Execution Error",
                verdict: "error",
                actual: "",
                inputUsed: unit.stdin,
                error: apiError.message || "Connection error"
            };
            displayIndices.forEach((idx) => { latestResults[idx] = failResult; });
        }
    }

    function distributeBatchResult(unit, data) {
        if (!data) {
            const empty = { status: "Execution Error", verdict: "error", actual: "", error: "Empty response received." };
            unit.subCases.forEach((_, k) => { latestResults[unit.displayStartIndex + k] = empty; });
            return;
        }

        const statusCode = String(data.status);
        const runError = (data.compiler_error || data.program_error || "").trim();

        if (data.compiler_error && statusCode !== "0") {
            const compileFail = { status: "Compilation Error", verdict: "warning", actual: "", error: runError };
            unit.subCases.forEach((_, k) => { latestResults[unit.displayStartIndex + k] = compileFail; });
            return;
        }

        const actualOut = data.program_output || "";
        const chunks = CpeasyUtils.splitLinesIntoChunks(actualOut, unit.subCases.map(sc => sc.expectedLineCount));
        const crashed = statusCode !== "0";
        const failureReason = CpeasyUtils.describeFailure(data);

        unit.subCases.forEach((sc, k) => {
            const idx = unit.displayStartIndex + k;
            const chunkLines = chunks[k];
            const gotFullChunk = chunkLines.length === sc.expectedLineCount;
            const actualChunk = chunkLines.join('\n');

            if (!gotFullChunk) {
                latestResults[idx] = crashed
                    ? { status: "Runtime Error", verdict: "error", actual: actualChunk, error: failureReason || "Program terminated before producing output for this case." }
                    : { status: "Wrong Answer", verdict: "wrong", actual: actualChunk || "No output", error: "" };
                return;
            }

            const cleanActual = actualChunk.replace(/\r\n/g, '\n').trim();
            const cleanExpected = (sc.expected || "").replace(/\r\n/g, '\n').trim();

            if (cleanActual === cleanExpected) {
                latestResults[idx] = { status: "Accepted", verdict: "accepted", actual: actualChunk, error: "" };
            } else {
                latestResults[idx] = { status: "Wrong Answer", verdict: "wrong", actual: actualChunk || "No output", error: "" };
            }
        });
    }

    function setRunTiming(text) {
        const el = document.getElementById('cpeasy-run-timing');
        if (el) el.innerText = text;
    }

    async function submitToCodeforces() {
    const code = editor.getValue();
    const cmLang = langSelect.value;
    const cfLangId = CPEASY_CONFIG.cfLanguageIds[cmLang];
    const cfLangLabels = CPEASY_CONFIG.cfLanguageLabels[cmLang] || [];

    if (!code.trim()) {
        window.alert("Please write code before submitting.");
        return;
    }

    if (!cfLangId) {
        window.alert("No Codeforces language is configured for this selection.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Preparing submission...";

    try {
        await saveDraft(cmLang, code);

        const { submitUrl, problemCode } = CpeasyUtils.getSubmitInfo();

        if (!problemCode) {
            throw new Error("Could not identify the current problem.");
        }

        // Keep navigation on the same origin so sessionStorage stays available.
        const destination = new URL(submitUrl);
        destination.protocol = window.location.protocol;
        destination.host = window.location.host;

        const handoff = {
            code,
            language: String(cfLangId),
            languageLabels: cfLangLabels,
            problem: problemCode,
            targetPath: destination.pathname.replace(/\/$/, ""),
            createdAt: Date.now()
        };

        sessionStorage.setItem(
            "cpeasy_submission_handoff",
            JSON.stringify(handoff)
        );

        window.location.assign(destination.href);
    } catch (error) {
        console.error("cpeasy: Could not prepare submission:", error);

        window.alert(
            "Could not prepare the submission. Your code is still in the editor.\n\n" +
            error.message
        );

        submitBtn.disabled = false;
        submitBtn.innerText = "Submit ↗";
    }
}

    function renderNotice(message, tone) {
        consoleOutput.innerHTML = `
            <div class="cpeasy-empty-state cpeasy-empty-${tone}">
                <strong>${CpeasyUtils.escapeHtml(message)}</strong>
                <span>Check the problem page samples or try a custom testcase.</span>
            </div>
        `;
    }

    function buildRunPlan(customInput) {
    const sampleBlocks = document.querySelectorAll('.sample-test');
    const runUnits = [];
    const displayCases = [];

    sampleBlocks.forEach((block) => {
        const inputs = block.querySelectorAll('.input pre');
        const outputs = block.querySelectorAll('.output pre');

        inputs.forEach((inputEl, index) => {
            const outputEl = outputs[index];

            // Preserve the full sample, including its test-count line.
            const readSample = (element) => {
                const lines = element.querySelectorAll('.test-example-line');

                return lines.length > 0
                    ? Array.from(lines, line => line.innerText).join('\n')
                    : element.innerText;
            };

            const input = readSample(inputEl);
            const expected = outputEl ? readSample(outputEl) : null;
            const displayIndex = displayCases.length;

            displayCases.push({
                input,
                expected,
                isCustom: false
            });

            runUnits.push({
                type: 'single',
                stdin: input,
                displayIndex
            });
        });
    });

    const customDisplayIndex = displayCases.length;

    displayCases.push({
        input: customInput,
        expected: '',
        isCustom: true
    });

    // Keep the Custom tab visible, but only execute it when input was entered.
// Whitespace-only input is preserved because it may be intentional.
if (customInput.length > 0) {
    runUnits.push({
        type: 'single',
        stdin: customInput,
        displayIndex: customDisplayIndex
    });
}

    return { runUnits, displayCases };
}

    function renderTestInterface(testCases, results) {
        consoleOutput.innerHTML = `
            <div id="cpeasy-test-tabs" class="cpeasy-case-tabs"></div>
            <div id="cpeasy-test-content" class="cpeasy-case-content"></div>
        `;

        const tabsContainer = document.getElementById('cpeasy-test-tabs');
        const contentContainer = document.getElementById('cpeasy-test-content');

        testCases.forEach((tc, idx) => {
            const result = results[idx];
            const tabBtn = document.createElement('button');
            tabBtn.type = "button";
            tabBtn.className = `cpeasy-case-tab ${idx === activeTabIndex ? 'is-active' : ''} ${result ? `is-${result.verdict}` : ''}`;
            tabBtn.id = `cpeasy-tab-${idx}`;
            tabBtn.innerHTML = tc.isCustom
                ? `<span>Custom</span>`
                : `<span class="cpeasy-tab-dot"></span><span>Case ${idx + 1}</span>${result ? `<small>${result.status}</small>` : '<small>Queued</small>'}`;
            tabBtn.addEventListener('click', () => {
                activeTabIndex = idx;
                renderTestInterface(testCases, results);
            });
            tabsContainer.appendChild(tabBtn);
        });

        const selectedCase = testCases[activeTabIndex] || testCases[0];
        const selectedResult = results[activeTabIndex] || null;
        if (!selectedCase) return;

        if (selectedCase.isCustom) {
            contentContainer.innerHTML = renderCustomCase(selectedCase, selectedResult);
            const customRunBtn = document.getElementById("cpeasy-run-custom-btn");
const customInputArea = document.getElementById("cpeasy-custom-textarea");

customRunBtn.disabled = runBtn.disabled;
customInputArea.disabled = runBtn.disabled;

customRunBtn.addEventListener("click", runCustomCode);
            const customArea = document.getElementById('cpeasy-custom-textarea');
            if (customArea) {
                customArea.addEventListener("input", event => {
    selectedCase.input = event.target.value;

    const resultIndex = testCases.indexOf(selectedCase);
    const currentResult = results[resultIndex];

    const inputChanged =
        typeof currentResult?.inputUsed === "string" &&
        currentResult.inputUsed !== selectedCase.input;

    const notice = contentContainer.querySelector(
        "#cpeasy-custom-stale-notice"
    );

    if (notice) {
        notice.style.display = inputChanged ? "block" : "none";
    }

    try {
        localStorage.setItem(customInputKey, selectedCase.input);
    } catch (error) {
        console.warn("cpeasy: Could not save custom input:", error);
    }
});
            }
            return;
        }

        contentContainer.innerHTML = renderSampleCase(selectedCase, selectedResult);
    }

    function verdictIcon(verdict) {
        if (verdict === 'accepted') return ICONS.check;
        if (verdict === 'wrong' || verdict === 'error') return ICONS.cross;
        if (verdict === 'warning') return ICONS.alert;
        return '';
    }

    

    function renderOutputComparison(tc, result) {
    const expected = tc.expected;
    const actual = result?.actual ?? "";

    // Show regular output unless there is a sample mismatch.
    if (!result || result.verdict !== "wrong" || expected == null) {
        const outputText = !result
            ? "Pending"
            : result.status === "Not run"
                ? "Not run"
                : actual || "(empty output)";

        return (
            renderDataBlock("Your Output", outputText) +
            renderDataBlock(
                "Expected",
                expected == null
                    ? "No expected output found"
                    : expected || "(empty output)"
            )
        );
    }

    // Match the normalization used by normalizeRunResult.
    const normalize = value =>
        String(value ?? "").replace(/\r\n/g, "\n").trim();

    const actualText = normalize(actual);
    const expectedText = normalize(expected);

    const actualLines = actualText === "" ? [] : actualText.split("\n");
    const expectedLines = expectedText === "" ? [] : expectedText.split("\n");

    const lineCount = Math.max(actualLines.length, expectedLines.length);

    let firstMismatch = -1;

    for (let index = 0; index < lineCount; index++) {
        if (actualLines[index] !== expectedLines[index]) {
            firstMismatch = index;
            break;
        }
    }

    // An external verdict may differ from our local text comparison.
    if (firstMismatch < 0) {
        return (
            renderDataBlock("Your Output", actual || "(empty output)") +
            renderDataBlock("Expected", expected || "(empty output)")
        );
    }

    const visibleWhitespace = text =>
        text.replace(/ /g, "·").replace(/\t/g, "⇥");

    const renderSide = (label, lines) => {
        // Include a missing-line marker when this side ends too early.
        const visibleLineCount = Math.max(lines.length, firstMismatch + 1);

        const html = Array.from(
            { length: visibleLineCount },
            (_, index) => {
                const missing = index >= lines.length;
                const text = missing
                    ? "(missing line)"
                    : lines[index] === ""
                        ? "(empty line)"
                        : visibleWhitespace(lines[index]);

                const highlighted = index === firstMismatch;
                const background = highlighted
                    ? "background:rgba(248,113,113,0.16);"
                    : "";

                return `
                    <span style="display:block;${background}">
                        <span style="color:#9aa6b2;user-select:none;">${index + 1} │ </span>${CpeasyUtils.escapeHtml(text)}
                    </span>
                `.trim();
            }
        ).join("");

        return `
            <div class="cpeasy-data-block">
                <div class="cpeasy-data-label">${label}</div>
                <pre>${html}</pre>
            </div>
        `;
    };

    return `
        <div class="cpeasy-muted-note" style="grid-column:1 / -1;">
            First difference: line ${firstMismatch + 1}.
            Spaces appear as · and tabs as ⇥.
            Outer whitespace is ignored, just as in the sample comparison.
        </div>
        ${renderSide("Your Output", actualLines)}
        ${renderSide("Expected", expectedLines)}
    `;
}

    function renderExecutionStats(result) {
    if (!result) return "";

    const readMeasurement = value => {
        if (
            value === null ||
            value === undefined ||
            (typeof value !== "number" && typeof value !== "string") ||
            (typeof value === "string" && value.trim() === "")
        ) {
            return null;
        }

        const number = Number(value);

        return Number.isFinite(number) && number >= 0
            ? number
            : null;
    };

    const seconds = readMeasurement(result.executionTimeSeconds);
    const kilobytes = readMeasurement(result.memoryKilobytes);

    // Don't show invented zeroes when the service provides no measurements.
    if (seconds === null && kilobytes === null) {
        return "";
    }

    const runtimeText = seconds === null
        ? "Not reported"
        : `${(seconds * 1000).toFixed(1)} ms`;

    const memoryText = kilobytes === null
        ? "Not reported"
        : `${kilobytes.toLocaleString("en-US", {
            maximumFractionDigits: 1
        })} KB`;

    return `
        <div
            class="cpeasy-execution-stats"
            style="display:flex;gap:16px;flex-wrap:wrap;margin:8px 0 12px;font-size:12px;color:#9aa6b2;"
            title="Reported by Judge0. These are not Codeforces judge measurements."
        >
            <span>Judge0 runtime: <strong>${runtimeText}</strong></span>
            <span>Memory: <strong>${memoryText}</strong></span>
        </div>
    `;
}

    function renderSampleCase(tc, result) {
    const verdictClass = result ? `is-${result.verdict}` : "";

    return `
        <div class="cpeasy-verdict ${verdictClass}">
            ${result
                ? `<span class="cpeasy-verdict-icon">${verdictIcon(result.verdict)}</span>`
                : ""}
            <span>${CpeasyUtils.escapeHtml(
                result ? result.status : "Waiting to run"
            )}</span>
        </div>

            ${renderExecutionStats(result)}

<div class="cpeasy-io-grid">
    ${renderDataBlock("Input", tc.input)}

        <div class="cpeasy-io-grid">
            ${renderDataBlock("Input", tc.input)}
            ${renderOutputComparison(tc, result)}
        </div>

        ${result && result.error
            ? renderErrorBlock(result.error)
            : ""}
    `;
}

    function renderCustomCase(tc, result) {
    const inputChanged =
        typeof result?.inputUsed === "string" &&
        result.inputUsed !== tc.input;

    return `
        <div class="cpeasy-custom-input-wrap">
            <label for="cpeasy-custom-textarea">Custom Input</label>

            <textarea
                id="cpeasy-custom-textarea"
                placeholder="Paste custom input here..."
            >${CpeasyUtils.escapeHtml(tc.input)}</textarea>

            <button
                id="cpeasy-run-custom-btn"
                class="cpeasy-primary-btn"
                type="button"
                style="margin-top:10px;"
            >
                Run Custom
            </button>
        </div>

        <div
            id="cpeasy-custom-stale-notice"
            role="status"
            style="display:${inputChanged ? "block" : "none"};
                   padding:8px 0;color:#fbbf24;font-size:12px;"
        >
            Input changed — run again. Output below belongs to the previous input.
        </div>

        ${result ? `
            <div class="cpeasy-verdict is-${result.verdict}">
                <span class="cpeasy-verdict-icon">
                    ${verdictIcon(result.verdict)}
                </span>
                <span>${CpeasyUtils.escapeHtml(result.status)}</span>
            </div>

            ${renderExecutionStats(result)}

            <div class="cpeasy-io-grid">
                ${renderDataBlock(
                    "Your Output",
                    result.actual || "(empty output)"
                )}
            </div>

            ${result.error ? renderErrorBlock(result.error) : ""}
        ` : `
            <div class="cpeasy-muted-note">
                Run Custom executes only this input, including empty input.
                The top Run button executes samples and any nonempty custom input.
            </div>
        `}
    `;
}

    function renderDataBlock(label, value) {
        return `
            <div class="cpeasy-data-block">
                <div class="cpeasy-data-label">${label}</div>
                <pre>${CpeasyUtils.escapeHtml(value)}</pre>
            </div>
        `;
    }

    function renderErrorBlock(error) {
        return `
            <div class="cpeasy-error-block">
                <div class="cpeasy-data-label">Error Log</div>
                <pre>${CpeasyUtils.formatErrorLog(error)}</pre>
            </div>
        `;
    }

    function updateTabRunning(index) {
        const tabBtn = document.getElementById(`cpeasy-tab-${index}`);
        if (tabBtn) {
            tabBtn.classList.add('is-running');
            const small = tabBtn.querySelector('small');
            if (small) small.innerText = "Running";
        }
    }
}

function setupResizers({ rightPane, editor }) {
    const resizerX = rightPane.querySelector("#cpeasy-resizer-x");
    const resizerY = rightPane.querySelector("#cpeasy-resizer-y");
    const editorWrapper = rightPane.querySelector("#cpeasy-editor-wrapper");
    const workspace = rightPane.querySelector(".cpeasy-workspace");

    const controller = new AbortController();
    const options = { signal: controller.signal };

    let direction = null;
    let rafId = null;
    let pendingPosition = null;
    let savedCursor = "";
    let savedUserSelect = "";

    const layoutKey = "cpeasy_panel_layout";
let savedLayout = {};

try {
    const raw = sessionStorage.getItem(layoutKey);
    const parsed = raw ? JSON.parse(raw) : null;

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        savedLayout = parsed;
    }
} catch (error) {
    console.warn("cpeasy: Could not load panel sizes:", error);
}

function restoreLayout() {
    if (!rightPane.isConnected) return;

    const viewportWidth = window.innerWidth;
    const widthRatio = savedLayout.widthRatio;

    // Preserve the existing full-width layout on smaller screens.
    if (viewportWidth <= 980) {
        rightPane.style.removeProperty("width");
    } else if (
        Number.isFinite(widthRatio) &&
        widthRatio > 0 &&
        widthRatio <= 1
    ) {
        const width = Math.max(
            420,
            Math.min(viewportWidth * widthRatio, viewportWidth * 0.62)
        );

        rightPane.style.setProperty("width", `${width}px`, "important");
    }

    const workspaceHeight = workspace.getBoundingClientRect().height;
    const editorRatio = savedLayout.editorRatio;

    if (
        workspaceHeight > 160 &&
        Number.isFinite(editorRatio) &&
        editorRatio > 0 &&
        editorRatio < 1
    ) {
        const height = Math.max(
            80,
            Math.min(workspaceHeight * editorRatio, workspaceHeight - 80)
        );

        editorWrapper.style.setProperty(
            "flex-basis",
            `${height}px`,
            "important"
        );
    }

    editor.setSize("100%", "100%");
    editor.refresh();
}

function saveLayout(axis) {
    if (!rightPane.isConnected) return;

    if (axis === "x" && window.innerWidth > 980) {
        savedLayout.widthRatio =
            rightPane.getBoundingClientRect().width / window.innerWidth;
    }

    if (axis === "y") {
        const workspaceHeight = workspace.getBoundingClientRect().height;

        if (workspaceHeight > 0) {
            savedLayout.editorRatio =
                editorWrapper.getBoundingClientRect().height / workspaceHeight;
        }
    }

    try {
        sessionStorage.setItem(layoutKey, JSON.stringify(savedLayout));
    } catch (error) {
        console.warn("cpeasy: Could not save panel sizes:", error);
    }
}

restoreLayout();

window.addEventListener("resize", () => {
    if (direction === null) {
        restoreLayout();
    }
}, options);

    function startResize(event, axis) {
        if (event.button !== 0 || direction !== null) return;

        event.preventDefault();
        direction = axis;

        savedCursor = document.body.style.cursor;
        savedUserSelect = document.body.style.userSelect;

        document.body.style.cursor =
            axis === "x" ? "col-resize" : "row-resize";
        document.body.style.userSelect = "none";
    }

    function applyResize() {
        rafId = null;

        if (!direction || !pendingPosition || !rightPane.isConnected) {
            return;
        }

        if (direction === "x") {
            const screenWidth = window.innerWidth;
            const maximum = screenWidth * 0.62;
            const minimum = Math.min(420, maximum);

            const width = Math.max(
                minimum,
                Math.min(screenWidth - pendingPosition.x, maximum)
            );

            rightPane.style.setProperty("width", `${width}px`, "important");
        } else {
            const top = editorWrapper.getBoundingClientRect().top;
            const availableHeight = workspace.getBoundingClientRect().height;
            const height = pendingPosition.y - top;

            if (height > 80 && height < availableHeight - 80) {
                editorWrapper.style.setProperty(
                    "flex-basis",
                    `${height}px`,
                    "important"
                );
            }
        }

        editor.setSize("100%", "100%");
    }

    function stopResize() {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        if (direction !== null) {
    saveLayout(direction);

    document.body.style.cursor = savedCursor;
    document.body.style.userSelect = savedUserSelect;
}

        direction = null;
        pendingPosition = null;
    }

    resizerX.addEventListener(
        "mousedown",
        event => startResize(event, "x"),
        options
    );

    resizerY.addEventListener(
        "mousedown",
        event => startResize(event, "y"),
        options
    );

    document.addEventListener("mousemove", event => {
        if (!direction) return;

        pendingPosition = { x: event.clientX, y: event.clientY };

        if (rafId === null) {
            rafId = requestAnimationFrame(applyResize);
        }
    }, options);

    document.addEventListener("mouseup", () => {
        if (!direction) return;

        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        applyResize();
        stopResize();

        if (rightPane.isConnected) {
            editor.refresh();
        }
    }, options);

    // Restore normal selection if the browser loses focus during a drag.
    window.addEventListener("blur", stopResize, options);

    return function cleanupResizers() {
        controller.abort();
        stopResize();
    };
}

function executeOnJudge0({ compilerName, code, stdin }) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            action: "executeCode",
            payload: {
                compiler: compilerName,
                code,
                stdin
            }
        }, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            if (!response || !response.success) {
                reject(new Error(response ? response.error : "Background script communication failed."));
                return;
            }
            resolve(response.data);
        });
    });
}

function normalizeRunResult(data, tc) {
    if (!data) {
        return {
            status: "Execution Error",
            verdict: "error",
            actual: "",
            error: "Empty response received."
        };
    }

    const actual = String(data.program_output || "");
    const statusId = data.judge_status_id;

    // Check execution status before comparing output, including custom tests.
    if (String(data.status) !== "0") {
        let status = "Runtime Error";
        let verdict = "error";

        if (statusId === 6) {
            status = "Compilation Error";
            verdict = "warning";
        } else if (statusId === 5) {
            status = "Time Limit Exceeded";
        } else if (statusId === 13 || statusId === 14) {
            status = "Execution Service Error";
        } else if (statusId === 4) {
            status = "Wrong Answer";
            verdict = "wrong";
        }

        const details = [
            data.compiler_error,
            data.program_error
        ].filter(Boolean).join("\n").trim();

        return {
            status,
            verdict,
            actual,
            error: details || data.judge_status_description || status
        };
    }

    if (tc.isCustom || tc.expected === null) {
        return {
            status: tc.isCustom ? "Finished" : "Not checked",
            verdict: "custom",
            actual,
            error: tc.isCustom
                ? ""
                : "No expected output was found for this sample."
        };
    }

    const normalize = value =>
        String(value ?? "").replace(/\r\n/g, "\n").trim();

    const matches = normalize(actual) === normalize(tc.expected);

    return {
        status: matches ? "Sample passed" : "Wrong Answer",
        verdict: matches ? "accepted" : "wrong",
        actual,
        error: ""
    };
}
