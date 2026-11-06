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
        const pendingCode = localStorage.getItem("cpeasy_pending_submit_code");
        const pendingLang = localStorage.getItem("cpeasy_pending_submit_lang");
        let pendingLangLabels = [];
        try {
            pendingLangLabels = JSON.parse(localStorage.getItem("cpeasy_pending_submit_lang_labels") || "[]");
        } catch (err) {
            pendingLangLabels = [];
        }
        const pendingProblem = localStorage.getItem("cpeasy_pending_submit_problem_code");

        if (pendingCode) {
            let fillAttempts = 0;
            const maxFillAttempts = 80;

            const tryAutoFill = () => {
                fillAttempts++;

                const sourceTextarea = document.getElementById('sourceCodeTextarea');
                const langSelect = document.querySelector('select[name="programTypeId"]');
                const problemInput = document.querySelector('input[name="submittedProblemCode"]');
                const problemIndexSelect = document.querySelector('select[name="submittedProblemIndex"]');

                if (sourceTextarea || langSelect) {
                    if (langSelect && pendingLang && pendingLang !== "undefined") {
                        const matchingOption = Array.from(langSelect.options).find((option) => {
                            const optionText = option.textContent.toLowerCase();
                            return option.value === pendingLang || pendingLangLabels.some(label => optionText.includes(label));
                        });

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
                            if (option.value.toUpperCase() === targetIndex || option.text.toUpperCase().startsWith(targetIndex)) {
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

                        try {
                            const escapedCode = JSON.stringify(pendingCode);
                            window.location.href = `javascript:(function(){
                                var editorDiv = document.getElementById('editor');
                                if (editorDiv && window.ace) {
                                    try {
                                        var aceEd = window.ace.edit(editorDiv);
                                        if (aceEd) {
                                            aceEd.setValue(${escapedCode}, -1);
                                            aceEd.clearSelection();
                                        }
                                    } catch(e) {}
                                }
                            })();void(0);`;
                        } catch (err) {
                            console.error("cpeasy: Ace sync error", err);
                        }
                    }

                    if (!sourceTextarea || sourceTextarea.value === pendingCode || fillAttempts >= maxFillAttempts) {
                        clearInterval(fillTimer);
                        localStorage.removeItem("cpeasy_pending_submit_code");
                        localStorage.removeItem("cpeasy_pending_submit_lang");
                        localStorage.removeItem("cpeasy_pending_submit_lang_labels");
                        localStorage.removeItem("cpeasy_pending_submit_problem_code");
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
        <div id="cpeasy-resizer-x" class="cpeasy-resizer-x" aria-label="Resize editor width"></div>
        <div class="cpeasy-shell">
            <header class="cpeasy-topbar">
                <div class="cpeasy-brand">
                    <div class="cpeasy-logo">cp</div>
                    <div>
                        <div class="cpeasy-title">cpeasy IDE</div>
                        <div class="cpeasy-subtitle">Run samples before submitting</div>
                    </div>
                </div>
                <button id="close-cpeasy-ide" class="cpeasy-icon-btn cpeasy-close-btn" type="button" title="Close IDE" aria-label="Close IDE">${ICONS.close}</button>
            </header>

            <section class="cpeasy-toolbar" aria-label="Editor controls">
                <select id="cpeasy-lang-select" class="cpeasy-select" title="Language">
                    <option value="text/x-c++src">C++</option>
                    <option value="text/x-csrc">C</option>
                    <option value="text/x-java">Java</option>
                    <option value="text/x-python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="text/x-csharp">C#</option>
                    <option value="text/x-rustsrc">Rust</option>
                    <option value="text/x-go">Go</option>
                </select>
                <button id="cpeasy-reset-template-btn" class="cpeasy-icon-btn cpeasy-icon-btn-sm" type="button" title="Reset template">${ICONS.reset}</button>
                <div class="cpeasy-toolbar-spacer"></div>
                <div class="cpeasy-timer" title="Practice timer">
                    <span id="cpeasy-timer-dot" class="cpeasy-timer-dot"></span>
                    <span class="cpeasy-timer-icon">${ICONS.clock}</span>
                    <span id="cpeasy-stopwatch-display" class="cpeasy-time-text">00:00</span>
                    <button id="cpeasy-timer-toggle" class="cpeasy-icon-btn cpeasy-icon-btn-sm" type="button" title="Pause timer" aria-label="Pause timer">${ICONS.pause}</button>
                    <button id="cpeasy-timer-reset" class="cpeasy-icon-btn cpeasy-icon-btn-sm" type="button" title="Reset timer" aria-label="Reset timer">${ICONS.reset}</button>
                </div>
                <button id="cpeasy-run-btn" class="cpeasy-primary-btn" type="button">${ICONS.play}<span>Run</span></button>
            </section>

            <main class="cpeasy-workspace">
                <section id="cpeasy-editor-wrapper" class="cpeasy-editor-panel">
                    <textarea id="cpeasy-textarea-editor"></textarea>
                </section>
                <div id="cpeasy-resizer-y" class="cpeasy-resizer-y" aria-label="Resize output panel">
                    <span class="cpeasy-resizer-grip"></span>
                </div>
                <section id="cpeasy-console-wrapper" class="cpeasy-console-panel">
                    <div class="cpeasy-console-head">
                        <div>
                            <div class="cpeasy-console-title">Sample Tests</div>
                            <div class="cpeasy-console-subtitle">Input, output, expected output, and verdict per case</div>
                        </div>
                        <div id="cpeasy-run-timing" class="cpeasy-run-timing"></div>
                    </div>
                    <div id="cpeasy-console-output" class="cpeasy-console-output">
                        <div class="cpeasy-empty-state">
                            <strong>Ready when you are.</strong>
                            <span>Click Run to execute the sample tests from this problem.</span>
                        </div>
                    </div>
                </section>
            </main>

            <footer class="cpeasy-footer">
                <button id="cpeasy-submit-btn" class="cpeasy-submit-btn" type="button">Go to Codeforces Submit</button>
            </footer>
        </div>
    `;
    body.appendChild(rightPane);

    initializeCpeasyIde({ rightPane, body, mainContent, actionBtn });
}

function initializeCpeasyIde({ rightPane, body, mainContent, actionBtn }) {
    let stopwatchInterval = null;
    let secondsElapsed = 0;
    let isTimerRunning = true;
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
    const langKey = 'cpeasy_lang_pref';
    const codeKeyFor = (mode) => `${baseKey}_${mode.replace(/[^a-z0-9]/gi, '_')}`;

    const getCodeForMode = (mode) => {
        const saved = localStorage.getItem(codeKeyFor(mode));
        if (saved && saved !== "undefined" && saved !== "null" && saved.trim().length > 0) {
            return saved;
        }
        return CPEASY_CONFIG.templates[mode] || "";
    };

    const savedLang = localStorage.getItem(langKey);
    if (savedLang && CPEASY_CONFIG.templates[savedLang]) {
        langSelect.value = savedLang;
    }
    previousMode = langSelect.value;

    targetTextArea.value = getCodeForMode(langSelect.value);

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
    editor.setSize("100%", "100%");
    editor.focus();
    setTimeout(() => editor.refresh(), 200);

    editor.on('change', () => {
        const currentText = editor.getValue();
        localStorage.setItem(codeKeyFor(langSelect.value), currentText);
    });

    const resetTemplateBtn = document.getElementById('cpeasy-reset-template-btn');
    if (resetTemplateBtn) {
        resetTemplateBtn.addEventListener('click', () => {
            const currentLang = langSelect.value;
            const defaultTemplate = CPEASY_CONFIG.templates[currentLang] || "";
            editor.setValue(defaultTemplate);
            localStorage.setItem(codeKeyFor(currentLang), defaultTemplate);
        });
    }

    const startStopwatch = () => {
        if (stopwatchInterval) clearInterval(stopwatchInterval);
        stopwatchInterval = setInterval(() => {
            if (!isTimerRunning) return;
            secondsElapsed++;
            const displayEl = document.getElementById('cpeasy-stopwatch-display');
            if (displayEl) displayEl.innerText = CpeasyUtils.formatTime(secondsElapsed);
        }, 1000);
    };
    startStopwatch();

    document.getElementById('cpeasy-timer-toggle').addEventListener('click', (event) => {
        isTimerRunning = !isTimerRunning;
        event.currentTarget.innerHTML = isTimerRunning ? ICONS.pause : ICONS.playOutline;
        event.currentTarget.title = isTimerRunning ? 'Pause timer' : 'Resume timer';
        event.currentTarget.setAttribute('aria-label', isTimerRunning ? 'Pause timer' : 'Resume timer');
        const dot = document.getElementById('cpeasy-timer-dot');
        if (dot) dot.classList.toggle('is-paused', !isTimerRunning);
    });

    document.getElementById('cpeasy-timer-reset').addEventListener('click', () => {
        secondsElapsed = 0;
        document.getElementById('cpeasy-stopwatch-display').innerText = CpeasyUtils.formatTime(0);
    });

    langSelect.addEventListener('change', (event) => {
        const nextMode = event.target.value;
        const currentCode = editor.getValue();
        
        if (previousMode) {
            localStorage.setItem(codeKeyFor(previousMode), currentCode);
        }

        editor.setOption("mode", nextMode);
        localStorage.setItem(langKey, nextMode);

        const codeToLoad = getCodeForMode(nextMode);
        editor.setValue(codeToLoad);
        previousMode = nextMode;
        editor.focus();
        setTimeout(() => editor.refresh(), 0);
    });

    setupResizers({ rightPane, editor });
    runBtn.addEventListener('click', () => runCode());
    submitBtn.addEventListener('click', () => submitToCodeforces());

    document.getElementById('close-cpeasy-ide').addEventListener('click', () => {
        if (stopwatchInterval) clearInterval(stopwatchInterval);
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

        if (!latestCases.some(tc => !tc.isCustom)) {
            renderNotice("No sample tests were found on this page. Use Custom Input below.", "warning");
        }

        renderTestInterface(latestCases, latestResults);
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

    function setRunButtonState(running) {
        runBtn.disabled = running;
        runBtn.classList.toggle('is-loading', running);
        runBtn.innerHTML = running
            ? `${ICONS.spinner}<span>Running</span>`
            : `${ICONS.play}<span>Run</span>`;
    }

    async function executeRunUnit(unit, { code, selectedMode }) {
        const displayIndices = unit.type === 'batch'
            ? unit.subCases.map((_, k) => unit.displayStartIndex + k)
            : [unit.displayIndex];

        displayIndices.forEach(updateTabRunning);

        try {
            const compilerName = CPEASY_CONFIG.judge0Compilers[selectedMode] || selectedMode;
            const response = await executeOnJudge0({ compilerName, code, stdin: unit.stdin });

            if (unit.type === 'batch') {
                distributeBatchResult(unit, response);
            } else {
                latestResults[unit.displayIndex] = normalizeRunResult(response, latestCases[unit.displayIndex]);
            }
        } catch (apiError) {
            const failResult = {
                status: "Execution Error",
                verdict: "error",
                actual: "",
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

    function submitToCodeforces() {
        const code = editor.getValue();
        const cmLang = langSelect.value;
        const cfLangId = CPEASY_CONFIG.cfLanguageIds[cmLang];
        const cfLangLabels = CPEASY_CONFIG.cfLanguageLabels[cmLang] || [];

        if (!code.trim()) {
            alert("Please write code before submitting.");
            return;
        }

        const { submitUrl, problemCode } = CpeasyUtils.getSubmitInfo();
        localStorage.setItem("cpeasy_pending_submit_code", code);
        localStorage.setItem("cpeasy_pending_submit_lang", cfLangId);
        localStorage.setItem("cpeasy_pending_submit_lang_labels", JSON.stringify(cfLangLabels));
        localStorage.setItem("cpeasy_pending_submit_problem_code", problemCode);

        submitBtn.innerText = "Opening submit page...";
        submitBtn.disabled = true;
        window.location.href = submitUrl;
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

    runUnits.push({
        type: 'single',
        stdin: customInput,
        displayIndex: customDisplayIndex
    });

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
            const customArea = document.getElementById('cpeasy-custom-textarea');
            if (customArea) {
                customArea.addEventListener('input', (event) => {
                    selectedCase.input = event.target.value;
                    localStorage.setItem(customInputKey, event.target.value);
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

    function renderSampleCase(tc, result) {
        const verdictClass = result ? `is-${result.verdict}` : '';
        return `
            <div class="cpeasy-verdict ${verdictClass}">
                ${result ? `<span class="cpeasy-verdict-icon">${verdictIcon(result.verdict)}</span>` : ''}
                <span>${CpeasyUtils.escapeHtml(result ? result.status : 'Waiting to run')}</span>
            </div>
            <div class="cpeasy-io-grid">
                ${renderDataBlock("Input", tc.input)}
                ${renderDataBlock("Your Output", result ? (result.actual || "No output") : "Pending")}
                ${renderDataBlock("Expected", tc.expected || "No expected output found")}
            </div>
            ${result && result.error ? renderErrorBlock(result.error) : ''}
        `;
    }

    function renderCustomCase(tc, result) {
        return `
            <div class="cpeasy-custom-input-wrap">
                <label for="cpeasy-custom-textarea">Custom Input</label>
                <textarea id="cpeasy-custom-textarea" placeholder="Paste custom input here...">${CpeasyUtils.escapeHtml(tc.input)}</textarea>
            </div>
            ${result ? `
                <div class="cpeasy-verdict is-${result.verdict}">
                    <span class="cpeasy-verdict-icon">${verdictIcon(result.verdict)}</span>
                    <span>${CpeasyUtils.escapeHtml(result.status)}</span>
                </div>
                <div class="cpeasy-io-grid">
                    ${renderDataBlock("Your Output", result.actual || "No output")}
                </div>
                ${result.error ? renderErrorBlock(result.error) : ''}
            ` : `
                <div class="cpeasy-muted-note">Run again to execute this custom input.</div>
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
    const resizerX = document.getElementById('cpeasy-resizer-x');
    const resizerY = document.getElementById('cpeasy-resizer-y');
    const editorWrapper = document.getElementById('cpeasy-editor-wrapper');
    const workspace = rightPane.querySelector('.cpeasy-workspace');

    let isResizingX = false;
    let isResizingY = false;
    let rafId = null;
    let pendingEvent = null;

    resizerX.addEventListener('mousedown', () => {
        isResizingX = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });

    resizerY.addEventListener('mousedown', () => {
        isResizingY = true;
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
    });

    function applyPendingResize() {
        rafId = null;
        const event = pendingEvent;
        if (!event) return;

        if (isResizingX) {
            const screenWidth = window.innerWidth;
            let targetWidth = screenWidth - event.clientX;
            targetWidth = Math.max(420, Math.min(targetWidth, screenWidth * 0.62));
            rightPane.style.setProperty('width', `${targetWidth}px`, 'important');
        }

        if (isResizingY) {
            const editorTop = editorWrapper.getBoundingClientRect().top;
            const workspaceHeight = workspace.getBoundingClientRect().height;
            const newHeight = event.clientY - editorTop;
            const minEditor = 80;
            const minConsole = 80;

            if (newHeight > minEditor && newHeight < workspaceHeight - minConsole) {
                editorWrapper.style.setProperty('flex-basis', `${newHeight}px`, 'important');
                editor.setSize("100%", "100%");
            }
        }
    }

    document.addEventListener('mousemove', (event) => {
        if (!isResizingX && !isResizingY) return;
        pendingEvent = event;
        if (rafId === null) {
            rafId = requestAnimationFrame(applyPendingResize);
        }
    });

    document.addEventListener('mouseup', () => {
        if (!isResizingX && !isResizingY) return;
        isResizingX = false;
        isResizingY = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        editor.setSize("100%", "100%");
        editor.refresh();
    });
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
