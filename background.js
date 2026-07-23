// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "executeCode") {
        fetch("https://wandbox.org/api/compile.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request.payload)
        })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                sendResponse({ 
                    success: false, 
                    error: data.compiler_error || data.program_error || `Wandbox Error (${response.status})` 
                });
            } else {
                sendResponse({ success: true, data: data });
            }
        })
        .catch(error => {
            sendResponse({ 
                success: false, 
                error: error.message || "Failed to reach Wandbox compilation server." 
            });
        });

        return true; // Keep message channel open for async response
    }
});