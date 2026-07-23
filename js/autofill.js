// --- AUTO-FILL ON SUBMIT PAGE ---
(() => {
    const pendingCode = localStorage.getItem("cpeasy_pending_submit_code");
    const pendingLang = localStorage.getItem("cpeasy_pending_submit_lang");
    const pendingProblemCode = localStorage.getItem("cpeasy_pending_submit_problem_code");

    if (pendingCode && window.location.pathname.includes("/submit")) {
        const autoFillInterval = setInterval(() => {
            const cfLangSelect = document.querySelector('select[name="programTypeId"]');
            const cfProblemInput = document.querySelector('input[name="submittedProblemCode"]') || 
                                   document.querySelector('input[name="submittedProblemIndex"]') ||
                                   document.querySelector('select[name="submittedProblemIndex"]');
            const cfSourceTextarea = document.querySelector('textarea[name="source"]') || document.querySelector('#sourceCodeTextarea');

            if (cfLangSelect && cfSourceTextarea) {
                clearInterval(autoFillInterval);

                const updateCodeInEditors = (src) => {
                    cfSourceTextarea.value = src;
                    cfSourceTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                    cfSourceTextarea.dispatchEvent(new Event('change', { bubbles: true }));

                    if (window.ace) {
                        try {
                            const aceEditor = window.ace.edit("editor");
                            if (aceEditor) aceEditor.setValue(src, -1);
                        } catch(e) {}
                    }

                    const cmEl = document.querySelector('.CodeMirror');
                    if (cmEl && cmEl.CodeMirror) {
                        try { cmEl.CodeMirror.setValue(src); } catch(e) {}
                    }
                };

                // 1. Fill Language
                if (pendingLang) {
                    cfLangSelect.value = pendingLang;
                    cfLangSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // 2. Fill Problem Code / Index
                if (cfProblemInput && pendingProblemCode) {
                    cfProblemInput.value = pendingProblemCode;
                    cfProblemInput.dispatchEvent(new Event('input', { bubbles: true }));
                    cfProblemInput.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // 3. Fill Source Code
                updateCodeInEditors(pendingCode);

                // Clean pending storage after filling
                localStorage.removeItem("cpeasy_pending_submit_code");
                localStorage.removeItem("cpeasy_pending_submit_lang");
                localStorage.removeItem("cpeasy_pending_submit_problem_code");
            }
        }, 150);
    }
})();