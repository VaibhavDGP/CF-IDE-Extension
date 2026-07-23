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
        
        // Ekdum clean Flexbox setup for the whole page
        body.style.setProperty('display', 'flex', 'important');
        body.style.setProperty('width', '100vw', 'important');
        body.style.setProperty('height', '100vh', 'important');
        body.style.setProperty('overflow', 'hidden', 'important');
        body.style.setProperty('margin', '0', 'important');

        // Codeforces ka main wrapper
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
        
        // STRICT LIMITS APPLIED HERE (max-width: 50vw !important)
        rightPane.style.cssText = `
            width: 450px;
            min-width: 350px !important;
            max-width: 50vw !important; /* Kisi bhi halat me 50% se bada nahi hoga */
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
                
                <div id="cpeasy-editor-wrapper" style="height: 55%; flex-basis: 55%; flex-shrink: 0; position: relative;">
                    <textarea id="cpeasy-textarea-editor" placeholder="// Write your code here..." style="display: none;"></textarea>
                </div>
                
                <div id="cpeasy-resizer-y" style="height: 8px; background: #333; cursor: row-resize; margin: 4px 0; border-radius: 4px; flex-shrink: 0; transition: background 0.2s;" onmouseover="this.style.background='#555'" onmouseout="this.style.background='#333'"></div>
                
                <div id="cpeasy-console-wrapper" style="flex: 1; min-height: 100px; background: #1e1e1e; border: 1px solid #444; border-radius: 6px; padding: 10px; overflow-y: auto; display: flex; flex-direction: column;">
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
        const langKey = 'cpeasy_lang_pref';

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

            // --- BULLETPROOF MATH LOGIC FOR RESIZING ---
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
                    
                    // Forcefully clamp width between 350px and exactly 50% of screen width
                    targetWidth = Math.max(350, Math.min(targetWidth, screenWidth / 2));
                    
                    // Set inline width securely
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

            // --- RUN CODE LOGIC ---
            const runBtn = document.getElementById('cpeasy-run-btn');
            const consoleOutput = document.getElementById('cpeasy-console-output');

            runBtn.addEventListener('click', () => {
                const code = editor.getValue();

                if (!code || code.trim() === "") {
                    consoleOutput.innerText = "Error: Code box is empty! 😅";
                    return;
                }

                consoleOutput.innerText = "⏳ Extracting sample test cases...";

                try {
                    const inputElements = document.querySelectorAll('.sample-test .input pre');
                    const outputElements = document.querySelectorAll('.sample-test .output pre');

                    if (inputElements.length === 0) {
                        consoleOutput.innerText = "❌ No sample test cases found on this page!";
                        return;
                    }

                    const testCases = [];
                    
                    inputElements.forEach((inputEl, index) => {
                        const rawInput = inputEl.innerText.trim();
                        const rawOutput = outputElements[index] ? outputElements[index].innerText.trim() : 'N/A';
                        
                        testCases.push({
                            input: rawInput,
                            output: rawOutput
                        });
                    });

                    consoleOutput.innerHTML = `
                        <div id="cpeasy-test-tabs" style="display: flex; gap: 8px; margin-bottom: 12px; border-bottom: 1px solid #333; padding-bottom: 8px;"></div>
                        <div id="cpeasy-test-content"></div>
                    `;

                    const tabsContainer = document.getElementById('cpeasy-test-tabs');
                    const contentContainer = document.getElementById('cpeasy-test-content');

                    testCases.forEach((tc, idx) => {
                        const tabBtn = document.createElement('button');
                        tabBtn.innerText = `Sample ${idx + 1}`;
                        tabBtn.style.cssText = `
                            background: transparent; color: ${idx === 0 ? '#fff' : '#888'}; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: bold; cursor: pointer; transition: all 0.2s; background-color: ${idx === 0 ? '#333' : 'transparent'};
                        `;

                        tabBtn.addEventListener('click', () => {
                            Array.from(tabsContainer.children).forEach(b => {
                                b.style.color = '#888';
                                b.style.backgroundColor = 'transparent';
                            });
                            
                            tabBtn.style.color = '#fff';
                            tabBtn.style.backgroundColor = '#333';

                            contentContainer.innerHTML = `
                                <div style="margin-bottom: 16px;">
                                    <div style="color: #a3a3a3; font-size: 12px; margin-bottom: 8px; font-weight: 600;">Input</div>
                                    <div style="background: #2b2b2b; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #e5e5e5; white-space: pre-wrap; line-height: 1.6; border: 1px solid #3b3b3b;">${tc.input}</div>
                                </div>
                                
                                <div>
                                    <div style="color: #a3a3a3; font-size: 12px; margin-bottom: 8px; font-weight: 600;">Expected Output</div>
                                    <div style="background: #2b2b2b; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #e5e5e5; white-space: pre-wrap; line-height: 1.6; border: 1px solid #3b3b3b;">${tc.output}</div>
                                </div>
                            `;
                        });

                        tabsContainer.appendChild(tabBtn);
                    });

                    tabsContainer.children[0].click();

                } catch (err) {
                    consoleOutput.innerText = `❌ Error: ${err.message}`;
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
                    alert("Bhai, code toh likh le pehle! 😅");
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
                    alert("❌ Submit form nahi mila! Kya tum Codeforces par Login ho?");
                }
            });

        } else {
            console.error("❌ CodeMirror is not loaded. Check manifest.json and lib folder.");
        }

        // --- CLOSE BUTTON FIX (Clean up everything on close) ---
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