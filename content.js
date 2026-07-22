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

        // Main IDE HTML
        // Main IDE HTML with Full Language Support
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

        // Core Initialization Logic
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

            setTimeout(() => editor.refresh(), 200);

            // BULLETPROOF AUTO-SAVE LOGIC
            editor.on('change', () => {
                const currentText = editor.getValue();
                localStorage.setItem(problemKey, currentText);
                console.log("✅ cpeasy Auto-saved:", currentText.length, "characters");
            });

            // SAVE LANGUAGE PREFERENCE
            langSelect.addEventListener('change', (e) => {
                const selectedLang = e.target.value;
                editor.setOption("mode", selectedLang);
                localStorage.setItem(langKey, selectedLang);
            });
        } else {
            console.error("❌ CodeMirror is not loaded. Check manifest.json and lib folder.");
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