chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "executeCode") {
        const { compiler, code, stdin } = request.payload;

        const languageMap = {
            "gcc-13.2.0": 105,
            "gcc-head": 105,
            "clang-head": 105,
            "text/x-c++src": 105,
            "gcc-head-c": 103,
            "gcc-13.2.0-c": 103,
            "text/x-csrc": 103,
            "openjdk-head": 91,
            "text/x-java": 91,
            "cpython-head": 100,
            "text/x-python": 100,
            "nodejs-head": 102,
            "javascript": 102,
            "dotnetcore-head": 51,
            "text/x-csharp": 51,
            "rust-head": 108,
            "text/x-rustsrc": 108,
            "go-head": 107,
            "text/x-go": 107
        };

        const languageId = languageMap[compiler] || 105;

        fetch("https://ce.judge0.com/submissions?wait=true", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language_id: languageId,
                source_code: code,
                stdin: stdin || ""
            })
        })
        .then(response => response.json())
        .then(data => {
            const programOutput = data.stdout || "";
            const programError = data.stderr || data.message || "";
            const compilerError = data.compile_output || "";
            const isSuccess = data.status && data.status.id === 3;

            sendResponse({
                success: true,
                data: {
                    program_output: programOutput,
                    program_error: programError,
                    compiler_error: compilerError,
                    status: isSuccess ? "0" : "1"
                }
            });
        })
        .catch(error => {
            sendResponse({ success: false, error: error.message });
        });

        return true;
    }
});
