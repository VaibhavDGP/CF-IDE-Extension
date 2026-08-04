const CpeasyUtils = {
    formatTime: (totalSec) => {
        const hrs = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        const mStr = String(mins).padStart(2, '0');
        const sStr = String(secs).padStart(2, '0');

        if (hrs > 0) {
            const hStr = String(hrs).padStart(2, '0');
            return `${hStr}:${mStr}:${sStr}`;
        }
        return `${mStr}:${sStr}`;
    },

    escapeHtml: (value) => {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    formatErrorLog: (rawError) => {
        if (!rawError) return "";
        let cleaned = String(rawError).replace(/\/tmp\/[^/]+\//g, '');
        cleaned = CpeasyUtils.escapeHtml(cleaned);
        cleaned = cleaned.replace(/(error:)/gi, '<span class="cpeasy-error-token">$1</span>');
        cleaned = cleaned.replace(/(warning:)/gi, '<span class="cpeasy-warning-token">$1</span>');
        cleaned = cleaned.replace(/(Segmentation fault|SIGSEGV|SIGFPE|out_of_range|std::bad_alloc)/gi, '<span class="cpeasy-crash-token">$1</span>');
        return cleaned;
    },

    extractCleanText: (preElement) => {
        if (!preElement) return "";
        const lines = preElement.querySelectorAll('.test-example-line');
        if (lines.length > 0) {
            return Array.from(lines).map(line => line.innerText.trim()).join('\n').trim();
        }
        return preElement.innerText.trim();
    },

    extractExampleGroups: (preElement) => {
        if (!preElement) return null;
        const lineEls = preElement.querySelectorAll('.test-example-line');
        if (lineEls.length === 0) return null;

        const groups = new Map();
        const order = [];

        lineEls.forEach((el) => {
            const groupClass = Array.from(el.classList).find(c => /^test-example-line-\d+$/.test(c));
            if (!groupClass) return;
            const idx = parseInt(groupClass.replace('test-example-line-', ''), 10);
            const text = el.innerText.trim();

            if (!groups.has(idx)) {
                groups.set(idx, []);
                order.push(idx);
            }
            groups.get(idx).push(text);
        });

        if (groups.size === 0) return null;
        return { groups, order };
    },

    splitLinesIntoChunks: (rawText, chunkSizes) => {
        const lines = String(rawText ?? "").replace(/\r\n/g, '\n').split('\n');
        while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

        const chunks = [];
        let cursor = 0;
        chunkSizes.forEach((need) => {
            chunks.push(lines.slice(cursor, cursor + need));
            cursor += need;
        });
        return chunks;
    },

    describeFailure: (data) => {
        if (data && data.signal) {
            return `Process terminated by signal: ${data.signal}`;
        }
        return (data && (data.program_error || data.compiler_error) || "").trim();
    },

    getSubmitInfo: () => {
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);

        let submitUrl = "https://codeforces.com/problemset/submit";
        let problemCode = "";

        if (parts[0] === "problemset" && parts[1] === "problem" && parts[2] && parts[3]) {
            submitUrl = "https://codeforces.com/problemset/submit";
            problemCode = parts[2] + parts[3].toUpperCase();
        } else if (parts[0] === "contest" && parts[2] === "problem" && parts[1] && parts[3]) {
            submitUrl = `https://codeforces.com/contest/${parts[1]}/submit`;
            problemCode = parts[3].toUpperCase();
        } else if (parts[0] === "gym" && parts[2] === "problem" && parts[1] && parts[3]) {
            submitUrl = `https://codeforces.com/gym/${parts[1]}/submit`;
            problemCode = parts[3].toUpperCase();
        } else {
            const titleEl = document.querySelector('.problem-statement .header .title');
            if (titleEl) {
                const match = titleEl.innerText.match(/^([A-Z0-9]+)\./);
                if (match) problemCode = match[1];
            }
        }

        return { submitUrl, problemCode };
    }
};
