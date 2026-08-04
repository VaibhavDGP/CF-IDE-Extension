# cpeasy

> A Chrome extension that brings a LeetCode-style coding workspace directly into Codeforces problem pages.

cpeasy reduces the context switching on Codeforces. Instead of reading the statement in one tab, writing code in another editor, manually copying samples, and then jumping to the submit page, cpeasy adds an in-page IDE where you can write, run, compare, and submit from the same problem view.

## What It Does

- Adds an **Open cpeasy IDE** button beside the Codeforces problem title.
- Opens a split-screen editor without leaving the problem statement.
- Extracts sample inputs and expected outputs from the page.
- Runs your code against sample tests and custom input.
- Shows verdicts, actual output, expected output, and error logs per case.
- Saves code locally per problem and language.
- Includes a practice timer for solving sessions.
- Redirects to the Codeforces submit page and autofills code, language, and problem when possible.

## Preview

```text
Codeforces Problem Page
|---------------------------------------------------|---------------------------|
| Problem statement, samples, notes                 | cpeasy IDE                |
|                                                   | Language selector         |
|                                                   | CodeMirror editor         |
|                                                   | Run samples               |
|                                                   | Case-by-case verdicts     |
|                                                   | Submit autofill button    |
|---------------------------------------------------|---------------------------|
```

## Supported Languages

- C++
- C
- Java
- Python
- JavaScript
- C#
- Rust
- Go

Code execution is handled through the Judge0 CE API from the extension service worker. Codeforces submission still happens on Codeforces itself; cpeasy only prepares the submit form for you.

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the project folder that contains `manifest.json`.
6. Open any Codeforces problem page and click **Open cpeasy IDE**.

## Usage

1. Open a Codeforces problem.
2. Click **Open cpeasy IDE** beside the problem title.
3. Choose a language.
4. Write your solution in the editor.
5. Click **Run** to test samples and custom input.
6. Review verdicts and output differences.
7. Click **Go to Codeforces Submit** when ready.

## Project Structure

```text
cpeasy/
├── manifest.json
├── icon.png
├── README.md
├── src/
│   ├── background/
│   │   └── service-worker.js
│   ├── content/
│   │   ├── config.js
│   │   ├── ide.js
│   │   └── utils.js
│   ├── popup/
│   │   └── popup.html
│   └── styles/
│       └── cpeasy.css
└── vendor/
    └── codemirror/
        ├── codemirror.min.js
        ├── codemirror.min.css
        ├── material.min.css
        └── language modes
```

## Permissions

cpeasy uses a small permission set:

- `activeTab` to interact with the current Codeforces page.
- `storage` through browser/local page storage for language choice, code drafts, and pending submit data.
- Codeforces host permissions to inject the IDE and autofill the submit page.
- Judge0 CE host permission to run code against sample input.

## Notes

- This is a developer-mode extension, not a published Chrome Web Store package yet.
- Sample parsing depends on Codeforces page markup, so unusual statement formats may need manual custom input.
- Submission autofill depends on Codeforces submit form fields and may require a quick manual check before final submission.
- Your code is sent to Judge0 CE only when you click **Run**.

## Roadmap Ideas

- Add screenshots or a short demo GIF.
- Add keyboard shortcuts for run, close, and submit.
- Add per-problem settings export/import.
- Improve language version selection.
- Add a small test harness for sample parsing logic.

## License

Add a license before publishing if you want others to reuse or contribute to the project.
