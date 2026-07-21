console.log("🚀 cpeasy: Active DOM Target Initialized!");

// Target the native Codeforces problem title element to append our action button
const problemTitle = document.querySelector('.problem-statement .header .title');

if (problemTitle) {
    // Create the "Open cpeasy IDE" activation button
    const actionBtn = document.createElement('button');
    actionBtn.innerText = "💻 Open cpeasy IDE";
    actionBtn.className = "cpeasy-inject-btn";

    // Bind interaction handler to split the viewport and render the workspace
// Bind interaction handler to split the viewport and render the workspace
    actionBtn.addEventListener('click', () => {
        // 1. Prevent duplicate instances of the IDE container
        if (document.getElementById('cpeasy-ide-container')) return;

        // NEW: Hide the "Open cpeasy IDE" button when workspace opens
        actionBtn.style.display = 'none';

        // 2. Target the main document body and apply the flex layout class
        const body = document.body;
        body.classList.add('cpeasy-split-body');

        // 3. Target the root Codeforces wrapper containing BOTH header/tabs and content
        const mainContent = document.querySelector('#body') || document.querySelector('#pageContent') || body.children[0];
        if (mainContent) {
            mainContent.classList.add('cpeasy-left-pane');
        }

        // 4. Create the Right Pane container for the IDE workspace
        const rightPane = document.createElement('div');
        rightPane.id = 'cpeasy-ide-container';
        rightPane.className = 'cpeasy-right-pane';

        // 5. Inject baseline HTML architecture for the workspace UI elements
        rightPane.innerHTML = `
            <div style="display: flex; justify-content: flex-end; margin-bottom: 15px;">
                <button id="close-cpeasy-ide" style="background: #ef4444; color: white; border: none; padding: 4px 12px; border-radius: 4px; font-weight: bold; cursor: pointer;">Close</button>
            </div>
            <textarea id="cpeasy-textarea-editor" placeholder="// Write your code here..." style="width: 100%; height: 75%; background: #2d2d2d; color: #fff; font-family: monospace; padding: 10px; border: 1px solid #444; border-radius: 4px; resize: none;"></textarea>
            <div style="margin-top: 15px;">
                <button id="cpeasy-submit-btn" style="background: #22c55e; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer;">Submit to Codeforces</button>
            </div>
        `;

        // 6. Mount the right pane directly into the active viewport DOM tree
        body.appendChild(rightPane);

        // Function to initialize CodeMirror instance safely inside the textarea
        const initCodeMirror = () => {
            const targetTextArea = document.getElementById('cpeasy-textarea-editor');
            if (targetTextArea && typeof CodeMirror !== 'undefined') {
                window.cpeasyEditor = CodeMirror.fromTextArea(targetTextArea, {
                    mode: "text/x-c++src",
                    theme: "material",
                    lineNumbers: true,
                    autoCloseBrackets: true,
                    indentUnit: 4
                });
                
                setTimeout(() => window.cpeasyEditor.refresh(), 200);
            }
        };

        // 7. Check if CodeMirror core kernel is already injected
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

            cmScript.onload = () => {
                const clikeMode = document.createElement('script');
                clikeMode.src = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/clike/clike.min.js';
                document.head.appendChild(clikeMode);
                clikeMode.onload = initCodeMirror;
            };
        } else {
            initCodeMirror();
        }

        // 8. Bind cleanup handler to the close button
        document.getElementById('close-cpeasy-ide').addEventListener('click', () => {
            rightPane.remove();
            body.classList.remove('cpeasy-split-body');
            if (mainContent) mainContent.classList.remove('cpeasy-left-pane');
            
            // NEW: Show the "Open cpeasy IDE" button again when workspace closes
            actionBtn.style.display = 'inline-block';
        });
    });

    // Append the initialized action button to the problem header area
    problemTitle.appendChild(actionBtn);
}