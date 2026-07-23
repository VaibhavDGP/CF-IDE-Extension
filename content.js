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
        
        // Clean Flexbox setup for the whole page
        body.style.setProperty('display', 'flex', 'important');
        body.style.setProperty('width', '100vw', 'important');
        body.style.setProperty('height', '100vh', 'important');
        body.style.setProperty('overflow', 'hidden', 'important');
        body.style.setProperty('margin', '0', 'important');

        // Codeforces main wrapper
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

        // Main IDE HTML
        rightPane.innerHTML = `
            <div id="cpeasy-resizer-x" style="position: absolute; top: 0; left: -4px; width: 8px; height: 100%; cursor: col-resize; z-index: 999999; background: transparent; transition: background 0.2s;" onmouseover="this.style.background='#3b82f6'" onmouseout="this.style.background='transparent'"></div>
            
            <div style="display: flex; flex-direction: column; height: 100%; padding: 10px; box-sizing: border-box; overflow: hidden; background: #141414;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; margin-bottom: 8px;">
                    <select id="cpeasy-lang-select" style="background: #2d2d2d; color: white; border: 1px solid #444; padding: 6px 10px; border-radius: 4px; font-weight: bold; cursor: pointer; outline: none;">
                        <option value="text/x-c++src">C++</option>
                        <option value="text/x-csrc">C</option>
                        <option value="text/x-java">Java</option>
                        <option value="text/x-python">Python</option>
                        <option value="javascript">JavaScript (Node.js)</option>
                        <option value="text/x-csharp">C#</option>
                        <option value="text/x-rustsrc">Rust</option>
                        <option value="text/x-go">Go</option>
                    </select>
                    <div style="display: flex; gap: 8px; flex-shrink: 0;">
                        <button id="cpeasy-run-btn" style="background: #3b82f6; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-weight: bold; cursor: pointer;">Run Code</button>
                        <button id="close-cpeasy-ide" style="background: #ef4444; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-weight: bold; cursor: pointer;">Close</button>
                    </div>
                </div>
                
                <div id="cpeasy-editor-wrapper" style="height: 50%; flex-basis: 50%; flex-shrink: 0; position: relative;">
                    <textarea id="cpeasy-textarea-editor" placeholder="// Write your code here..." style="display: none;"></textarea>
                </div>
                
                <div id="cpeasy-resizer-y" style="height: 8px; background: #333; cursor: row-resize; margin: 4px 0; border-radius: 4px; flex-shrink: 0; transition: background 0.2s;" onmouseover="this.style.background='#555'" onmouseout="this.style.background='#333'"></div>
                
                <div id="cpeasy-console-wrapper" style="flex: 1; min-height: 120px; background: #1e1e1e; border: 1px solid #444; border-radius: 6px; padding: 10px; overflow-y: auto; display: flex; flex-direction: column;">
                    <div style="font-weight: bold; color: #888; margin-bottom: 6px; border-bottom: 1px solid #333; padding-bottom: 4px; flex-shrink: 0;">Console Output:</div>
                    <div id="cpeasy-console-output" style="white-space: pre-wrap; flex: 1; overflow-y: auto; color: #d4d4d4; font-family: monospace; font-size: 12px;">Click 'Run Code' to test against sample testcases...</div>
                </div>

                <div style="margin-top: 10px; flex-shrink: 0;">
                    <button id="cpeasy-submit-btn" style="background: #22c55e; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">Submit to Codeforces</button>
                </div>
            </div>
        `;

        body.appendChild(rightPane);

        // --- CORE INITIALIZATION ---
        const targetTextArea = document.getElementById('cpeasy-textarea-editor');
        const langSelect = document.getElementById('cpeasy-lang-select');
        
        const problemKey = 'cpeasy_code_' + window.location.pathname.replace(/\/$/, ""); 
        const customInputKey = 'cpeasy_custom_input_' + window.location.pathname.replace(/\/$/, "");
        const langKey = 'cpeasy_lang_pref';

        let activeTabIndex = 0; // Track currently selected tab index

        const savedLang = localStorage.getItem(langKey);
        if (savedLang) {
            langSelect.value = savedLang;
        }
        
        const savedCode = localStorage.getItem(problemKey);
        if (savedCode) {
            targetTextArea.value = savedCode; 
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
                    const newHeight = e.clientY - 50; 
                    if (newHeight > 100 && newHeight < window.innerHeight - 200) {
                        editorWrapper.style.height = newHeight + 'px';
                        editorWrapper.style.flexBasis = newHeight + 'px';
                        if (window.cpeasyEditor) window.cpeasyEditor.refresh(); 
                    }
                }
            });

            document.addEventListener('mouseup', () => {
                if (isResizingX || isResizingY) {
                    isResizingX = false;
                    isResizingY = false;
                    document.body.style.cursor = 'default';
                    document.body.style.userSelect = 'auto';
                    if (window.cpeasyEditor) window.cpeasyEditor.refresh();
                }
            });

            // --- WANDBOX COMPILER MAPPING ---
            const wandboxCompilerMap = {
                "text/x-c++src": "gcc-head",
                "text/x-csrc": "gcc-head-c",
                "text/x-java": "openjdk-head",
                "text/x-python": "cpython-head",
                "javascript": "nodejs-head",
                "text/x-csharp": "dotnetcore-head",
                "text/x-rustsrc": "rust-head",
                "text/x-go": "go-head"
            };

            const extractCleanText = (preElement) => {
                if (!preElement) return "";
                const lines = preElement.querySelectorAll('.test-example-line');
                if (lines.length > 0) {
                    return Array.from(lines).map(line => line.innerText.trim()).join('\n').trim();
                }
                return preElement.innerText.trim();
            };

            const runBtn = document.getElementById('cpeasy-run-btn');
            const consoleOutput = document.getElementById('cpeasy-console-output');

            runBtn.addEventListener('click', async () => {
                const code = editor.getValue();
                const selectedMode = langSelect.value;
                const compilerName = wandboxCompilerMap[selectedMode];

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
                    // 1. Scrape Sample Test Cases
                    const inputElements = document.querySelectorAll('.sample-test .input pre');
                    const outputElements = document.querySelectorAll('.sample-test .output pre');

                    const testCases = [];
                    inputElements.forEach((inputEl, index) => {
                        const rawInput = extractCleanText(inputEl);
                        const rawOutput = extractCleanText(outputElements[index]);
                        testCases.push({ input: rawInput, expected: rawOutput, isCustom: false });
                    });

                    testCases.push({ input: activeCustomInput, expected: "", isCustom: true });

                    // 2. Setup UI Tabs
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
                            // Remember active tab
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
                                            <div style="margin-bottom: 8px; font-size: 14px; font-weight: bold; color: ${res.error ? '#ef4444' : '#22c55e'};">
                                                ${res.status}
                                            </div>
                                            <div style="color: #a3a3a3; font-size: 12px; margin-bottom: 4px; font-weight: 600;">Output</div>
                                            <div style="background: #2b2b2b; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 13px; color: #e5e5e5; white-space: pre-wrap;">${res.actual || 'No Output'}</div>
                                            ${res.error ? `<div style="margin-top: 8px; color: #ef4444; font-family: monospace; font-size: 12px; white-space: pre-wrap; background: #3a1010; padding: 8px; border-radius: 6px;">${res.error}</div>` : ''}
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
                            const statusColor = isPassed ? '#22c55e' : '#ef4444';

                            contentContainer.innerHTML = `
                                <div style="margin-bottom: 12px; font-size: 16px; font-weight: bold; color: ${statusColor};">
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
                                ${res.error ? `<div style="margin-top: 12px; color: #ef4444; font-family: monospace; font-size: 12px; white-space: pre-wrap; background: #3a1010; padding: 10px; border-radius: 6px;">${res.error}</div>` : ''}
                            `;
                        });

                        tabsContainer.appendChild(tabBtn);
                    });

                    // Retain previously selected active tab (e.g. Custom Input tab)
                    const targetTabToSelect = (activeTabIndex >= 0 && activeTabIndex < testCases.length) ? activeTabIndex : 0;
                    if (tabsContainer.children[targetTabToSelect]) {
                        tabsContainer.children[targetTabToSelect].click();
                    }

                    // 3. Execute Code against Wandbox API
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
                                tabBtn.style.color = "#ef4444";
                            } else if (data.status !== "0" && data.status !== 0) {
                                status = "Runtime Error ⚠️";
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

                            // Live update view if this tab is currently active
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

            // --- AUTO-SUBMIT LOGIC ---
            const languageMap = {
                "text/x-c++src": "89", "text/x-csrc": "43", "text/x-java": "87", "text/x-python": "31", "javascript": "34", "text/x-csharp": "65", "text/x-rustsrc": "75", "text/x-go": "32"
            };

            const submitBtn = document.getElementById('cpeasy-submit-btn');
            
            submitBtn.addEventListener('click', () => {
                const code = editor.getValue();
                const cmLang = langSelect.value;
                const cfLangId = languageMap[cmLang];

                if (!code || code.trim() === "") {
                    alert("Please write code before submitting! 😅");
                    return;
                }

                const cfForm = document.querySelector('form.submit-form');
                const cfLangSelect = document.querySelector('select[name="programTypeId"]');
                const cfSourceTextarea = document.querySelector('textarea[name="source"]');
                const cfSubmitButton = document.querySelector('.submit-form input[type="submit"]');

                if (cfForm && cfLangSelect && cfSourceTextarea && cfSubmitButton) {
                    cfLangSelect.value = cfLangId;
                    cfSourceTextarea.value = code;

                    localStorage.removeItem(problemKey);

                    submitBtn.innerText = "Submitting... 🚀";
                    submitBtn.style.background = "#eab308";
                    submitBtn.disabled = true;

                    cfSubmitButton.click();
                } else {
                    alert("❌ Submit form not found! Make sure you are logged into Codeforces.");
                }
            });

        } else {
            console.error("❌ CodeMirror is not loaded. Check manifest.json and lib folder.");
        }

        // --- CLOSE BUTTON ---
        document.getElementById('close-cpeasy-ide').addEventListener('click', () => {
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