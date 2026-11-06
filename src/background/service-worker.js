const JUDGE0_URL = "https://ce.judge0.com";
const RUN_TIMEOUT_MS = 60000;
const REQUEST_TIMEOUT_MS = 15000;
const POLL_INTERVAL_MS = 1000;

// Keep the language IDs currently used by the extension.
const LANGUAGE_IDS = {
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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function requestJson(path, options, deadline) {
    const remaining = deadline - Date.now();

    if (remaining <= 0) {
        throw new Error("Execution service timed out. Please try again.");
    }

    const controller = new AbortController();
    const timeout = setTimeout(
        () => controller.abort(),
        Math.min(REQUEST_TIMEOUT_MS, remaining)
    );

    try {
        const response = await fetch(`${JUDGE0_URL}${path}`, {
            ...options,
            signal: controller.signal
        });

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error("Too many requests. Wait a moment and retry.");
            }

            if (response.status === 401 || response.status === 403) {
                throw new Error(
                    "The execution service denied access. Check its configuration."
                );
            }

            if (response.status === 422) {
                throw new Error(
                    "The execution service rejected the code or language settings."
                );
            }

            throw new Error(
                `Execution service error (HTTP ${response.status}). Try again later.`
            );
        }

        try {
            return await response.json();
        } catch (error) {
            if (controller.signal.aborted) throw error;
            throw new Error("The execution service returned an invalid response.");
        }
    } catch (error) {
        if (controller.signal.aborted) {
            throw new Error("Execution service timed out. Please try again.");
        }

        if (error instanceof TypeError) {
            throw new Error(
                "Cannot reach the execution service. Check your connection."
            );
        }

        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

async function executeCode(payload) {
    const { compiler, code, stdin = "" } = payload || {};
    const languageId = LANGUAGE_IDS[compiler];

    if (!languageId) {
        throw new Error("Unsupported language. Select another language.");
    }

    if (typeof code !== "string" || !code.trim()) {
        throw new Error("Enter some code before running.");
    }

    if (typeof stdin !== "string") {
        throw new Error("Test input must be text.");
    }

    const deadline = Date.now() + RUN_TIMEOUT_MS;

    // Submit once, then check the result using its token.
    const submission = await requestJson(
        "/submissions?wait=false",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language_id: languageId,
                source_code: code,
                stdin
            })
        },
        deadline
    );

    if (typeof submission.token !== "string" || !submission.token) {
        throw new Error("The execution service did not return a submission token.");
    }

    while (Date.now() < deadline) {
        const result = await requestJson(
            `/submissions/${encodeURIComponent(submission.token)}`,
            { method: "GET" },
            deadline
        );

        const statusId = result.status?.id;

        if (!Number.isInteger(statusId) || statusId < 1 || statusId > 14) {
            throw new Error("The execution service returned an unknown status.");
        }

        // 1 = queued, 2 = processing.
        if (statusId === 1 || statusId === 2) {
            await delay(Math.min(POLL_INTERVAL_MS, Math.max(0, deadline - Date.now())));
            continue;
        }

        return {
            program_output: result.stdout || "",
            program_error: result.stderr || result.message || "",
            compiler_error: result.compile_output || "",
            status: statusId === 3 ? "0" : "1",
            judge_status_id: statusId,
            judge_status_description: result.status.description || "",
            signal: result.exit_signal,
            time: result.time,
            memory: result.memory
        };
    }

    throw new Error("Execution service timed out. Please try again.");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request?.action !== "executeCode") return;

    executeCode(request.payload).then(
        data => sendResponse({ success: true, data }),
        error => sendResponse({ success: false, error: error.message })
    );

    return true;
});