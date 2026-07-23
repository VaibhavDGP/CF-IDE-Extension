const CpeasyUtils = {
    formatTime: (totalSec) => {
        const hrs = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        const mStr = String(mins).padStart(2, '0');
        const sStr = String(secs).padStart(2, '0');
        
        if (hrs > 0) {
            const hStr = String(hrs).padStart(2, '0');
            return `⏱️ ${hStr}:${mStr}:${sStr}`;
        }
        return `⏱️ ${mStr}:${sStr}`;
    },
    
    formatErrorLog: (rawError) => {
        if (!rawError) return "";
        let cleaned = rawError.replace(/\/tmp\/wandbox-[^\/]+\//g, '');
        cleaned = cleaned.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        cleaned = cleaned.replace(/(error:)/gi, '<span style="color: #ef4444; font-weight: bold;">$1</span>');
        cleaned = cleaned.replace(/(warning:)/gi, '<span style="color: #f59e0b; font-weight: bold;">$1</span>');
        cleaned = cleaned.replace(/(Segmentation fault|SIGSEGV|SIGFPE|out_of_range|std::bad_alloc)/gi, '<span style="color: #ec4899; font-weight: bold;">💥 $1</span>');
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