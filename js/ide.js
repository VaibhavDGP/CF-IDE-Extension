console.log("🚀 cpeasy: Active DOM Target Initialized!");

const problemTitle = document.querySelector('.problem-statement .header .title');

if (problemTitle) {
    const actionBtn = document.createElement('button');
    actionBtn.innerText = "💻 Open cpeasy IDE";
    actionBtn.className = "cpeasy-inject-btn";

    actionBtn.addEventListener('click', () => {
        if (document.getElementById('cpeasy-ide-container')) return;

        actionBtn.style.display = 'none';

        const body = document.body;
        
        body.style.setProperty('display', 'flex', 'important');
        body.style.setProperty('width', '100vw', 'important');
        body.style.setProperty('height', '100vh', 'important');
        body.style.setProperty('overflow', 'hidden', 'important');
        body.style.setProperty('margin', '0', 'important');

        const mainContent = document.querySelector('#body') || document.querySelector('#pageContent') || body.children[0];
        
        if (mainContent) {
            mainContent.style.setProperty('flex', '1', 'important');
            mainContent.style.setProperty('min-width', '0', 'important'); 
            mainContent.style.setProperty('overflow-x', 'auto', 'important'); 
            mainContent.style.setProperty('overflow-y', 'auto', 'important');
            mainContent.style.setProperty('height', '100vh', 'important');
            mainContent.style.setProperty('box-sizing', 'border-box', 'important');
        }

        const rightPane = document.createElement('div');
        rightPane.id = 'cpeasy-ide-container';
        
        rightPane.style.cssText = `
            width: 450px;
            min-width: 350px !important;
            max-width: 50vw !important;
            flex-shrink: 0;
            height: 100vh;
            position: relative;
            box-shadow: -2px 0 10px rgba(0,0,0,0.5);
            z-index: 9999;
        `;

        rightPane.innerHTML = `
            <div id="cpeasy-resizer-x" style="position: absolute; top: 0; left: -4px; width: 8px; height: 100%; cursor: col-resize; z-index: 999999; background: transparent; transition: background 0.2s;" onmouseover="this.style.background='#3b82f6'" onmouseout="this.style.background='transparent'"></div>
            
            <div style="display: flex; flex-direction: column; height: 100%; padding: 10px; box-sizing: border-box; overflow: hidden; background: #141414;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; margin-bottom: 8px;">
                    <div style="display: flex; gap: 6px; align-items: center;">
                        <select id="cpeasy-lang-select" style="background: #2d2d2d; color: white; border: 1px solid #444; padding: 6px 8px; border-radius: 4px; font-weight: bold; cursor: pointer; outline: none;">
                            <option value="text/x-c++src">C++</option>
                            <option value="text/x-csrc">C</option>
                            <option value="text/x-java">Java</option>
                            <option value="text/x-python">Python</option>
                            <option value="javascript">JavaScript (Node.js)</option>
                            <option value="text/x-csharp">C#</option>
                            <option value="text/x-rustsrc">Rust</option>
                            <option value="text/x-go">Go</option>
                        </select>
                        <button id="cpeasy-template-btn" style="background: #4b5563; color: white; border: none; padding: 6px 10px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 12px;" title="Insert boilerplate code template">📋 Template</button>
                    </div>

                    <div style="display: flex; align-items: center; gap: 8px; background: #1e1e1e; padding: 4px 10px; border-radius: 8px; border: 1px solid #333; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                        <span id="cpeasy-stopwatch-display" style="font-family: monospace; font-size: 15px; font-weight: bold; color: #3b82f6; letter-spacing: 0.5px;">⏱️ 00:00</span>
                        <button id="cpeasy-timer-toggle" style="background: #2d2d2d; color: #e5e5e5; border: 1px solid #444; border-radius: 5px; cursor: pointer; font-size: 14px; padding: 3px 8px; transition: all 0.2s;" onmouseover="this.style.background='#3d3d3d'" onmouseout="this.style.background='#2d2d2d'" title="Play/Pause Stopwatch">⏸️</button>
                        <button id="cpeasy-timer-reset" style="background: #2d2d2d; color: #e5e5e5; border: 1px solid #444; border-radius: 5px; cursor: pointer; font-size: 14px; padding: 3px 8px; transition: all 0.2s;" onmouseover="this.style.background='#3d3d3d'" onmouseout="this.style.background='#2d2d2d'" title="Reset Stopwatch">🔄</button>
                    </div>

                    <div style="display: flex; gap: 8px; flex-shrink: 0;">
                        <button id="cpeasy-run-btn" style="background: #3b82f6; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-weight: bold; cursor: pointer;">Run Code</button>
                        <button id="close-cpeasy-ide" style="background: #ef4444; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-weight: bold; cursor: pointer;">Close</button>
                    </div>
                </div>
                
                <div id="cpeasy-editor-wrapper" style="height: 55%; flex-basis: 55%; min-height: 100px; flex-shrink: 0; position: relative;">
                    <textarea id="cpeasy-textarea-editor" placeholder="// Write your code here..." style="display: none;"></textarea>
                </div>
                
                <div id="cpeasy-resizer-y" style="height: 8px; background: #333; cursor: row-resize; margin: 4px 0; border-radius: 4px; flex-shrink: 0; transition: background 0.2s;" onmouseover="this.style.background='#555'" onmouseout="this.style.background='#333'"></div>
                
                <div id="cpeasy-console-wrapper" style="flex: 1; min-height: 100px; background: #1e1e1e; border: 1px solid #444; border-radius: 6px; padding: 10px; overflow-y: auto; display: flex; flex-direction: column;">
                    <div style="font-weight: bold; color: #888; margin-bottom: 6px; border-bottom: 1px solid #333; padding-bottom: 4px; flex-shrink: 0;">Console Output:</div>
                    <div id="cpeasy-console-output" style="white-space: pre-wrap; flex: 1; overflow-y: auto; color: #d4d4d4; font-family: monospace; font-size: 12px;">Click 'Run Code' to test against sample testcases...</div>
                </div>

                <div style="margin-top: 10px; flex-shrink: 0;">
                    <button id="cpeasy-submit-btn" style="background: #22c55e; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">Go to Submit Page 🚀</button>
                </div>
            </div>
        `;

        body.appendChild(rightPane);

        // --- STOPWATCH LOGIC ---
        let stopwatchInterval = null;
        let secondsElapsed = 0;
        let isTimerRunning = true;

        const startStopwatch = () => {
            if (stopwatchInterval) clearInterval(stopwatchInterval);
            stopwatchInterval = setInterval(() => {
                if (isTimerRunning) {
                    secondsElapsed++;
                    const displayEl = document.getElementById('cpeasy-stopwatch-display');
                    if (displayEl) displayEl.innerText = CpeasyUtils.formatTime(secondsElapsed);
                }
            }, 1000);
        };

        startStopwatch();

        const timerToggleBtn = document.getElementById('cpeasy-timer-toggle');
        timerToggleBtn.addEventListener('click', () => {
            isTimerRunning = !isTimerRunning;
            timerToggleBtn.innerText = isTimerRunning ? '⏸️' : '▶️';
        });

        const timerResetBtn = document.getElementById('cpeasy-timer-reset');
        timerResetBtn.addEventListener('click', () => {
            secondsElapsed = 0;
            const displayEl = document.getElementById('cpeasy-stopwatch-display');
            if (displayEl) displayEl.innerText = CpeasyUtils.formatTime(0);
        });

        // --- EDITOR INITIALIZATION ---
        const targetTextArea = document.getElementById('cpeasy-textarea-editor');
        const langSelect = document.getElementById('cpeasy-lang-select');
        const templateBtn = document.getElementById('cpeasy-template-btn');
        
        const problemKey = 'cpeasy_code_' + window.location.pathname.replace(/\/$/, ""); 
        const customInputKey = 'cpeasy_custom_input_' + window.location.pathname.replace(/\/$/, "");
        const langKey = 'cpeasy_lang_pref';

        let activeTabIndex = 0; 

        const savedLang = localStorage.getItem(langKey);
        if (savedLang) {
            langSelect.value = savedLang;
        }
        
        const savedCode = localStorage.getItem(problemKey);
        if (savedCode && savedCode.trim() !== "") {
            targetTextArea.value = savedCode; 
        } else {
            targetTextArea.value = CPEASY_CONFIG.templates[langSelect.value] || "";
        }
        
        if (targetTextArea && typeof window.CodeMirror !== 'undefined') {
            const editor = window.CodeMirror.fromTextArea(targetTextArea, {
                mode: langSelect.value,
                theme: "material",
                lineNumbers: true,
                autoCloseBrackets: true,
                indentUnit: 4
            });
            
            window.cpeasyEditor = editor; 
            editor.setSize("100%", "100%");
            setTimeout(() => editor.refresh(), 200);

            editor.on('change', () => {
                const currentText = editor.getValue();
                localStorage.setItem(problemKey, currentText);
            });

            langSelect.addEventListener('change', (e) => {
                const selectedLang = e.target.value;
                editor.setOption("mode", selectedLang);
                localStorage.setItem(langKey, selectedLang);

                if (editor.getValue().trim() === "") {
                    editor.setValue(CPEASY_CONFIG.templates[selectedLang] || "");
                }
            });

            templateBtn.addEventListener('click', () => {
                const currentLang = langSelect.value;
                const template = CPEASY_CONFIG.templates[currentLang];
                
                if (template) {
                    if (editor.getValue().trim() !== "") {
                        if (confirm("Reset editor with default template for this language?")) {
                            editor.setValue(template);
                        }
                    } else {
                        editor.setValue(template);
                    }
                }
            });

            // --- RESIZING LOGIC ---
            const resizerX = document.getElementById('cpeasy-resizer-x');
            const resizerY = document.getElementById('cpeasy-resizer-y');
            const editorWrapper = document.getElementById('cpeasy-editor-wrapper');
            
            let isResizingX = false;
            let isResizingY = false;

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

            document.addEventListener('mousemove', (e) => {
                if (isResizingX) {
                    const screenWidth = window.innerWidth;
                    let targetWidth = screenWidth - e.clientX;
                    targetWidth = Math.max(350, Math.min(targetWidth, screenWidth / 2));
                    rightPane.style.setProperty('width', targetWidth + 'px', 'important');
                }
                
                if (isResizingY) {
                    const paneRect = rightPane.getBoundingClientRect();
                    const newHeight = e.clientY - paneRect.top - 45; 
                    
                    if (newHeight > 80 && newHeight < paneRect.height - 180) {
                        editorWrapper.style.height = newHeight + 'px';
                        editorWrapper.style.flexBasis = newHeight + 'px';
                        if (window.cpeasyEditor) {
                            window.cpeasyEditor.setSize("100%", "100%");
                            window.cpeasyEditor.refresh(); 
                        }
                    }
                }
            });

            document.addEventListener('mouseup', () => {
                if (isResizingX || isResizingY) {
                    isResizingX = false;
                    isResizingY = false;
                    document.body.style.cursor = 'default';
                    document.body.style.userSelect = 'auto';
                    if (window.cpeasyEditor) {
                        window.cpeasyEditor.setSize("100%", "100%");
                        window.cpeasyEditor.refresh();
                    }
                }
            });

            // --- RUN CODE EXECUTION LOGIC ---
            const runBtn = document.getElementById('cpeasy-run-btn');
            const consoleOutput = document.getElementById('cpeasy-console-output');

            runBtn.addEventListener('click', async () => {
                const code = editor.getValue();
                const selectedMode = langSelect.value;
                const compilerName = CPEASY_CONFIG.wandboxCompilers[selectedMode];

                if (!code || code.trim() === "") {
                    consoleOutput.innerText = "Error: Code box is empty! 😅";
                    return;
                }

                let activeCustomInput = "";
                const existingCustomTextarea = document.getElementById('cpeasy-custom-textarea');
                if (existingCustomTextarea) {
                    activeCustomInput = existingCustomTextarea.value;
                    localStorage.setItem(customInputKey, activeCustomInput);
                } else {
                    activeCustomInput = localStorage.getItem(customInputKey) || "";
                }

                consoleOutput.innerHTML = `<div style="color: #3b82f6; font-weight: bold;">⏳ Scraping testcases & compiling via Wandbox...</div>`;
                runBtn.disabled = true;
                runBtn.style.background = "#64748b";

                try {
                    const inputElements = document.querySelectorAll('.sample-test .input pre');
                    const outputElements = document.querySelectorAll('.sample-test .output pre');

                    const testCases = [];
                    inputElements.forEach((inputEl, index) => {
                        const rawInput = CpeasyUtils.extractCleanText(inputEl);
                        const rawOutput = CpeasyUtils.extractCleanText(outputElements[index]);
                        testCases.push({ input: rawInput, expected: rawOutput, isCustom: false });
                    });

                    testCases.push({ input: activeCustomInput, expected: "", isCustom: true });

                    consoleOutput.innerHTML = `
                        <div id="cpeasy-test-tabs" style="display: flex; gap: 8px; margin-bottom: 12px; border-bottom: 1px solid #333; padding-bottom: 8px; overflow-x: auto;"></div>
                        <div id="cpeasy-test-content"></div>
                    `;

                    const tabsContainer = document.getElementById('cpeasy-test-tabs');
                    const contentContainer = document.getElementById('cpeasy-test-content');

                    const results = new Array(testCases.length).fill(null);

                    testCases.forEach((tc, idx) => {
                        const tabBtn = document.createElement('button');
                        const isCustomTab = tc.isCustom;
                        tabBtn.innerText = isCustomTab ? `✏️ Custom Input` : `Case ${idx + 1} (⏳)`;
                        tabBtn.style.cssText = `
                            background: transparent; color: #888; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: bold; cursor: pointer; transition: all 0.2s;
                        `;
                        tabBtn.id = `cpeasy-tab-${idx}`;
                        
                        tabBtn.addEventListener('click', () => {
                            activeTabIndex = idx;

                            Array.from(tabsContainer.children).forEach(b => {
                                b.style.backgroundColor = 'transparent';
                                b.style.border = 'none';
                            });
                            tabBtn.style.backgroundColor = '#333';
                            
                            const res = results[idx];

                            if (isCustomTab) {
                                contentContainer.innerHTML = `
                                    <div style="margin-bottom: 10px;">
                                        <div style="color: #a3a3a3; font-size: 12px; margin-bottom: 4px; font-weight: 600;">Custom Testcase Input:</div>
                                        <textarea id="cpeasy-custom-textarea" style="width: 100%; height: 70px; background: #2b2b2b; border: 1px solid #444; border-radius: 6px; color: #e5e5e5; font-family: monospace; font-size: 12px; padding: 8px; box-sizing: border-box; outline: none; resize: vertical;" placeholder="Type custom input here...">${tc.input}</textarea>
                                    </div>
                                    <div id="cpeasy-custom-output-box">
                                        ${res ? `
                                            <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px; color: ${res.error ? '#ef4444' : '#22c55e'};">
                                                ${res.status}
                                            </div>
                                            <div style="color: #a3a3a3; font-size: 12px; margin-bottom: 4px; font-weight: 600;">Output</div>
                                            <div style="background: #2b2b2b; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 13px; color: #e5e5e5; white-space: pre-wrap;">${res.actual || 'No Output'}</div>
                                            ${res.error ? `
                                                <div style="margin-top: 10px;">
                                                    <div style="color: #ef4444; font-size: 12px; margin-bottom: 4px; font-weight: 600;">Error Logs:</div>
                                                    <div style="background: #281010; border: 1px solid #ef4444; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 12px; color: #f87171; white-space: pre-wrap; overflow-x: auto;">${CpeasyUtils.formatErrorLog(res.error)}</div>
                                                </div>
                                            ` : ''}
                                        ` : `<div style="color: #888; font-size: 12px;">Type input above and click 'Run Code' to execute custom testcase.</div>`}
                                    </div>
                                `;

                                const customArea = document.getElementById('cpeasy-custom-textarea');
                                if (customArea) {
                                    customArea.addEventListener('input', (e) => {
                                        tc.input = e.target.value;
                                        localStorage.setItem(customInputKey, e.target.value);
                                    });
                                }
                                return;
                            }

                            if (!res) {
                                contentContainer.innerHTML = `<div style="color: #a3a3a3;">Running... Please wait.</div>`;
                                return;
                            }

                            const isPassed = res.status === 'Accepted ✅';
                            const statusColor = isPassed ? '#22c55e' : (res.status.includes('Compilation') ? '#f59e0b' : '#ef4444');

                            contentContainer.innerHTML = `
                                <div style="font-size: 16px; font-weight: bold; margin-bottom: 12px; color: ${statusColor};">
                                    ${res.status}
                                </div>
                                <div style="margin-bottom: 12px;">
                                    <div style="color: #a3a3a3; font-size: 12px; margin-bottom: 4px; font-weight: 600;">Input</div>
                                    <div style="background: #2b2b2b; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 13px; color: #e5e5e5; white-space: pre-wrap;">${tc.input}</div>
                                </div>
                                <div style="margin-bottom: 12px;">
                                    <div style="color: #a3a3a3; font-size: 12px; margin-bottom: 4px; font-weight: 600;">Actual Output</div>
                                    <div style="background: #2b2b2b; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 13px; color: ${isPassed ? '#22c55e' : '#ef4444'}; white-space: pre-wrap;">${res.actual || 'No Output'}</div>
                                </div>
                                <div>
                                    <div style="color: #a3a3a3; font-size: 12px; margin-bottom: 4px; font-weight: 600;">Expected Output</div>
                                    <div style="background: #2b2b2b; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 13px; color: #e5e5e5; white-space: pre-wrap;">${tc.expected}</div>
                                </div>
                                ${res.error ? `
                                    <div style="margin-top: 12px;">
                                        <div style="color: #ef4444; font-size: 12px; margin-bottom: 4px; font-weight: 600;">Error Logs:</div>
                                        <div style="background: #281010; border: 1px solid #ef4444; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 12px; color: #f87171; white-space: pre-wrap; overflow-x: auto;">${CpeasyUtils.formatErrorLog(res.error)}</div>
                                    </div>
                                ` : ''}
                            `;
                        });

                        tabsContainer.appendChild(tabBtn);
                    });

                    const targetTabToSelect = (activeTabIndex >= 0 && activeTabIndex < testCases.length) ? activeTabIndex : 0;
                    if (tabsContainer.children[targetTabToSelect]) {
                        tabsContainer.children[targetTabToSelect].click();
                    }

                    for (let i = 0; i < testCases.length; i++) {
                        const tc = testCases[i];
                        const tabBtn = document.getElementById(`cpeasy-tab-${i}`);
                        
                        try {
                            const response = await new Promise((resolve) => {
                                chrome.runtime.sendMessage({
                                    action: "executeCode",
                                    payload: {
                                        compiler: compilerName,
                                        code: code,
                                        stdin: tc.input
                                    }
                                }, (res) => {
                                    if (chrome.runtime.lastError) {
                                        resolve({ success: false, error: chrome.runtime.lastError.message });
                                    } else {
                                        resolve(res);
                                    }
                                });
                            });

                            if (!response || !response.success) {
                                throw new Error(response ? response.error : "Background script communication failed.");
                            }

                            const data = response.data;
                            if (!data) throw new Error("Empty response received from Wandbox.");

                            let actualOut = (data.program_output || "").trim();
                            let compileErr = (data.compiler_error || data.program_error || "").trim();
                            let status = "";

                            if (tc.isCustom) {
                                status = compileErr ? "Execution Error ⚠️" : "Finished 🟢";
                            } else if (compileErr && data.status !== "0" && data.status !== 0) {
                                status = "Compilation Error ⚠️";
                                tabBtn.style.color = "#f59e0b";
                            } else if (data.status !== "0" && data.status !== 0) {
                                status = "Runtime Error 💥";
                                compileErr = compileErr || data.program_error || "Runtime Execution Error";
                                tabBtn.style.color = "#ef4444";
                            } else {
                                const cleanActual = actualOut.replace(/\r\n/g, '\n');
                                const cleanExpected = tc.expected.replace(/\r\n/g, '\n');
                                
                                if (cleanActual === cleanExpected) {
                                    status = "Accepted ✅";
                                    tabBtn.style.color = "#22c55e"; 
                                } else {
                                    status = "Wrong Answer ❌";
                                    tabBtn.style.color = "#ef4444"; 
                                }
                            }

                            results[i] = {
                                status: status,
                                actual: actualOut,
                                error: compileErr
                            };

                            if (!tc.isCustom) {
                                tabBtn.innerText = `Case ${i + 1}`;
                            }

                            if (i === activeTabIndex) {
                                tabBtn.click();
                            }

                        } catch (apiError) {
                            results[i] = { 
                                status: "Execution Error 🔌", 
                                actual: "", 
                                error: apiError.message || "Unknown Connection Error"
                            };
                            
                            if (!tc.isCustom) {
                                tabBtn.innerText = `Case ${i + 1} (Err)`;
                                tabBtn.style.color = "#ef4444";
                            }
                            
                            if (i === activeTabIndex) {
                                tabBtn.click();
                            }
                        }
                    }

                } catch (err) {
                    consoleOutput.innerText = `❌ Error: ${err.message}`;
                } finally {
                    runBtn.disabled = false;
                    runBtn.style.background = "#3b82f6";
                }
            });

            // --- REDIRECT LOGIC ---
            const submitBtn = document.getElementById('cpeasy-submit-btn');
            
            submitBtn.addEventListener('click', () => {
                const code = editor.getValue();
                const cmLang = langSelect.value;
                const cfLangId = CPEASY_CONFIG.cfLanguageIds[cmLang];

                if (!code || code.trim() === "") {
                    alert("Please write code before submitting! 😅");
                    return;
                }

                const { submitUrl, problemCode } = CpeasyUtils.getSubmitInfo();
                
                localStorage.setItem("cpeasy_pending_submit_code", code);
                localStorage.setItem("cpeasy_pending_submit_lang", cfLangId);
                localStorage.setItem("cpeasy_pending_submit_problem_code", problemCode);

                submitBtn.innerText = "Redirecting... 🚀";
                submitBtn.style.background = "#eab308";
                submitBtn.disabled = true;

                window.location.href = submitUrl;
            });

        } else {
            console.error("❌ CodeMirror is not loaded. Check manifest.json and lib folder.");
        }

        // --- CLOSE BUTTON ---
        document.getElementById('close-cpeasy-ide').addEventListener('click', () => {
            if (stopwatchInterval) clearInterval(stopwatchInterval);

            rightPane.remove();
            
            body.style.display = '';
            body.style.width = '';
            body.style.height = '';
            body.style.overflow = '';
            body.style.margin = '';
            
            if (mainContent) {
                mainContent.style.flex = '';
                mainContent.style.minWidth = '';
                mainContent.style.overflowX = '';
                mainContent.style.overflowY = '';
                mainContent.style.height = '';
                mainContent.style.boxSizing = '';
            }
            actionBtn.style.display = 'inline-block';
        });
    });

    problemTitle.appendChild(actionBtn);
}