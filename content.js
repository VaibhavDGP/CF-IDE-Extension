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
        body.classList.add('cpeasy-split-body');

        const mainContent = document.querySelector('#body') || document.querySelector('#pageContent') || body.children[0];
        if (mainContent) {
            mainContent.classList.add('cpeasy-left-pane');
        }

        const rightPane = document.createElement('div');
        rightPane.id = 'cpeasy-ide-container';
        rightPane.className = 'cpeasy-right-pane';

        // Expanded Language Dropdown options
        rightPane.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <select id="cpeasy-lang-select" style="background: #2d2d2d; color: white; border: 1px solid #444; padding: 4px 8px; border-radius: 4px; font-weight: bold; cursor: pointer; outline: none;">
                    <option value="text/x-c++src">C++</option>
                    <option value="text/x-csrc">C</option>
                    <option value="text/x-java">Java</option>
                    <option value="text/x-python">Python</option>
                    <option value="javascript">JavaScript (Node.js)</option>
                    <option value="text/x-csharp">C#</option>
                    <option value="text/x-rustsrc">Rust</option>
                    <option value="text/x-go">Go</option>
                </select>
                <button id="close-cpeasy-ide" style="background: #ef4444; color: white; border: none; padding: 4px 12px; border-radius: 4px; font-weight: bold; cursor: pointer;">Close</button>
            </div>
            <textarea id="cpeasy-textarea-editor" placeholder="// Write your code here..." style="width: 100%; height: 75%; background: #2d2d2d; color: #fff; font-family: monospace; padding: 10px; border: 1px solid #444; border-radius: 4px; resize: none;"></textarea>
            <div style="margin-top: 15px;">
                <button id="cpeasy-submit-btn" style="background: #22c55e; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer;">Submit to Codeforces</button>
            </div>
        `;

        body.appendChild(rightPane);

        const initCodeMirror = () => {
            const targetTextArea = document.getElementById('cpeasy-textarea-editor');
            const langSelect = document.getElementById('cpeasy-lang-select');
            
            if (targetTextArea && typeof CodeMirror !== 'undefined') {
                window.cpeasyEditor = CodeMirror.fromTextArea(targetTextArea, {
                    mode: langSelect.value,
                    theme: "material",
                    lineNumbers: true,
                    autoCloseBrackets: true,
                    indentUnit: 4
                });
                
                setTimeout(() => window.cpeasyEditor.refresh(), 200);

                langSelect.addEventListener('change', (e) => {
                    window.cpeasyEditor.setOption("mode", e.target.value);
                });
            }
        };

        if (!document.getElementById('cpeasy-cm-core')) {
            const cmCss = document.createElement('link');
            cmCss.rel = 'stylesheet';
            cmCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css';
            document.head.appendChild(cmCss);

            const cmThemeCss = document.createElement('link');
            cmThemeCss.rel = 'stylesheet';
            cmThemeCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/theme/material.min.css';
            document.head.appendChild(cmThemeCss);

            const cmScript = document.createElement('script');
            cmScript.id = 'cpeasy-cm-core';
            cmScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js';
            document.head.appendChild(cmScript);

            // Clean array-based script loader for multiple languages
            cmScript.onload = () => {
                const modes = [
                    'clike/clike.min.js',       // Handles C, C++, Java, C#
                    'python/python.min.js',     // Handles Python
                    'javascript/javascript.min.js', // Handles JavaScript
                    'rust/rust.min.js',         // Handles Rust
                    'go/go.min.js'              // Handles Go
                ];
                
                let scriptsLoaded = 0;
                modes.forEach(mode => {
                    const script = document.createElement('script');
                    script.src = `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/${mode}`;
                    script.onload = () => {
                        scriptsLoaded++;
                        if (scriptsLoaded === modes.length) {
                            initCodeMirror(); // Initialize IDE only when all languages are loaded
                        }
                    };
                    document.head.appendChild(script);
                });
            };
        } else {
            initCodeMirror();
        }

        document.getElementById('close-cpeasy-ide').addEventListener('click', () => {
            rightPane.remove();
            body.classList.remove('cpeasy-split-body');
            if (mainContent) mainContent.classList.remove('cpeasy-left-pane');
            actionBtn.style.display = 'inline-block';
        });
    });

    problemTitle.appendChild(actionBtn);
}