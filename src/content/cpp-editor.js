const CpeasyCppEditor = (() => {
    const words = new Set(`
        alignas alignof auto bool break case catch char class const
        constexpr continue decltype default delete do double else enum
        explicit extern false float for friend if inline int long namespace
        new noexcept nullptr operator private protected public return short
        signed sizeof static static_assert struct switch template this throw
        true try typedef typename union unsigned using virtual void volatile
        while

        std cin cout cerr endl string vector pair array deque list map
        multimap unordered_map set multiset unordered_set queue priority_queue
        stack bitset tuple optional

        sort stable_sort reverse swap min max min_element max_element
        lower_bound upper_bound binary_search find count accumulate iota
        gcd lcm abs sqrt pow make_pair make_tuple
        push_back pop_back emplace_back insert erase clear size empty
        begin end first second
    `.trim().split(/\s+/));

    function getHints(cm) {
        const cursor = cm.getCursor();
        const line = cm.getLine(cursor.line);
        const tokenType = cm.getTokenTypeAt(cursor) || "";

        // Avoid suggestions inside comments and string literals.
        if (/\b(comment|string)\b/.test(tokenType)) {
            return null;
        }

        let start = cursor.ch;
        let end = cursor.ch;

        while (start > 0 && /[A-Za-z0-9_]/.test(line[start - 1])) {
            start--;
        }

        while (end < line.length && /[A-Za-z0-9_]/.test(line[end])) {
            end++;
        }

        const prefix = line.slice(start, cursor.ch);

        if (!/^[A-Za-z_]\w*$/.test(prefix)) {
            return null;
        }

        const candidates = new Set(words);

        // Include words from nearby code, such as variable names.
        const firstLine = Math.max(cm.firstLine(), cursor.line - 100);
        const lastLine = Math.min(cm.lastLine(), cursor.line + 100);

        for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber++) {
            const text = cm.getLine(lineNumber);
            const matches = text.matchAll(/\b[A-Za-z_]\w*\b/g);

            for (const match of matches) {
                // Do not suggest the word currently being edited.
                if (
                    lineNumber === cursor.line &&
                    match.index === start
                ) {
                    continue;
                }

                candidates.add(match[0]);
            }
        }

        const list = [...candidates]
            .filter(word => word.startsWith(prefix) && word !== prefix)
            .sort()
            .slice(0, 60);

        return {
            list,
            from: CodeMirror.Pos(cursor.line, start),
            to: CodeMirror.Pos(cursor.line, end)
        };
    }

    function attach(editor) {
        let errorMarks = [];
        let disposed = false;

        function clearDiagnostics() {
            errorMarks.forEach(mark => mark.clear());
            errorMarks = [];
        }

        function showSuggestions(cm) {
            if (disposed || cm.somethingSelected()) return;

            cm.showHint({
                hint: getHints,
                completeSingle: false
            });
        }

        function onInputRead(cm, change) {
            if (change.origin !== "+input") return;

            const inserted = change.text.join("\n");

            if (!/[A-Za-z0-9_]$/.test(inserted)) return;
            if (cm.state.completionActive) return;

            const cursor = cm.getCursor();
            const beforeCursor = cm.getLine(cursor.line).slice(0, cursor.ch);
            const prefix = beforeCursor.match(/[A-Za-z_]\w*$/)?.[0] || "";

            if (prefix.length >= 2) {
                showSuggestions(cm);
            }
        }

        const keyMap = {
            "Ctrl-Space": showSuggestions
        };

        editor.addKeyMap(keyMap);
        editor.on("inputRead", onInputRead);
        editor.on("change", clearDiagnostics);

        function showCompilerErrors(output, submittedCode) {
            // Never attach errors to code that has changed since Run.
            if (disposed || editor.getValue() !== submittedCode) return;

            clearDiagnostics();

            const messagesByLine = new Map();
            const cleanOutput = String(output || "")
                .replace(/\x1b\[[0-9;]*m/g, "");

            for (const line of cleanOutput.split(/\r?\n/)) {
                const match = line.match(
                    /^(.+?):(\d+):(\d+):\s*(?:fatal error|error):\s*(.+)$/
                );

                if (!match) continue;

                const [, file, row, , message] = match;
                const filename = file.replace(/\\/g, "/").split("/").pop();

                // Judge0's C++ source file is main.cpp.
                // Ignore diagnostics belonging to system headers.
                if (filename !== "main.cpp") continue;

                const lineNumber = Number(row) - 1;

                if (
                    lineNumber < editor.firstLine() ||
                    lineNumber > editor.lastLine()
                ) {
                    continue;
                }

                const messages = messagesByLine.get(lineNumber) || [];
                messages.push(message);
                messagesByLine.set(lineNumber, messages);
            }

            for (const [lineNumber, messages] of messagesByLine) {
                const text = editor.getLine(lineNumber);
                const start = text.search(/\S/);

                if (start === -1) continue;

                errorMarks.push(editor.markText(
                    CodeMirror.Pos(lineNumber, start),
                    CodeMirror.Pos(lineNumber, text.length),
                    {
                        className: "cpeasy-compiler-error",
                        title: [...new Set(messages)].join("\n")
                    }
                ));
            }
        }

        function dispose() {
            disposed = true;
            editor.closeHint();
            editor.removeKeyMap(keyMap);
            editor.off("inputRead", onInputRead);
            editor.off("change", clearDiagnostics);
            clearDiagnostics();
        }

        return {
            showCompilerErrors,
            dispose
        };
    }

    return { attach };
})();