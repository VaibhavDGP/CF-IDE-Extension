console.log("🚀 cpeasy: Active DOM Target Initialized!");

// Target the native Codeforces problem title element to append our action button
const problemTitle = document.querySelector('.problem-statement .header .title');

if (problemTitle) {
    // Create the "Open cpeasy IDE" activation button
    const actionBtn = document.createElement('button');
    actionBtn.innerText = "💻 Open cpeasy IDE";
    actionBtn.className = "cpeasy-inject-btn";

    // Bind interaction handler to split the viewport and render the workspace
    actionBtn.addEventListener('click', () => {
        // 1. Prevent duplicate instances of the IDE container
        if (document.getElementById('cpeasy-ide-container')) return;

        // 2. Target the main document body and apply the flex layout class
        const body = document.body;
        body.classList.add('cpeasy-split-body');

        // 3. Isolate the native Codeforces layout wrapper to the left pane
        const mainContent = document.querySelector('#pageContent') || body.children[0];
        if (mainContent) {
            mainContent.classList.add('cpeasy-left-pane');
        }

        // 4. Create the Right Pane container for the IDE workspace
        const rightPane = document.createElement('div');
        rightPane.id = 'cpeasy-ide-container';
        rightPane.className = 'cpeasy-right-pane';

        // 5. Inject baseline HTML architecture for the workspace UI elements
        rightPane.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="margin: 0; font-size: 18px; color: #3B82F6;">cpeasy Workspace V1</h2>
                <button id="close-cpeasy-ide" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
            <textarea id="cpeasy-textarea-editor" placeholder="// Write your code here..." style="width: 100%; height: 75%; background: #2d2d2d; color: #fff; font-family: monospace; padding: 10px; border: 1px solid #444; border-radius: 4px; resize: none;"></textarea>
            <div style="margin-top: 15px;">
                <button id="cpeasy-submit-btn" style="background: #22c55e; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer;">Submit to Codeforces</button>
            </div>
        `;

        // 6. Mount the right pane directly into the active viewport DOM tree
        body.appendChild(rightPane);

        // 7. Bind cleanup handler to the close button to restore original page layout
        document.getElementById('close-cpeasy-ide').addEventListener('click', () => {
            rightPane.remove();
            body.classList.remove('cpeasy-split-body');
            if (mainContent) mainContent.classList.remove('cpeasy-left-pane');
        });
    });

    // Append the initialized action button to the problem header
    problemTitle.appendChild(actionBtn);
}