const CPEASY_CONFIG = {
    templates: {
        "text/x-c++src": `#include <iostream>\nusing namespace std;\n\nvoid solve() {\n    // Write your solution here\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int t = 1;\n    if (cin >> t) {\n        while (t--) {\n            solve();\n        }\n    }\n    return 0;\n}\n`,
        "text/x-csrc": `#include <stdio.h>\n\nvoid solve() {\n    // Write your solution here\n}\n\nint main() {\n    int t = 1;\n    if (scanf("%d", &t) == 1) {\n        while (t--) {\n            solve();\n        }\n    }\n    return 0;\n}\n`,
        "text/x-java": `import java.util.Scanner;\n\npublic class Main {\n    public static void solve(Scanner sc) {\n        // Write your solution here\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int t = sc.nextInt();\n            while (t-- > 0) {\n                solve(sc);\n            }\n        }\n        sc.close();\n    }\n}\n`,
        "text/x-python": `import sys\n\ndef solve():\n    # Write your solution here\n    pass\n\ndef main():\n    input = sys.stdin.read\n    # Write input reading logic here\n\nif __name__ == '__main__':\n    main()\n`,
        "javascript": `const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n    // Write solution logic here\n}\n\nsolve();\n`,
        "text/x-csharp": `using System;\n\nclass Program {\n    static void Main() {\n        // Write your solution here\n    }\n}\n`,
        "text/x-rustsrc": `use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    // Write solution logic here\n}\n`,
        "text/x-go": `package main\n\nimport (\n    "fmt"\n)\n\nfunc main() {\n    var t int\n    if _, err := fmt.Scan(&t); err == nil {\n        for i := 0; i < t; i++ {\n            // Write solution logic here\n        }\n    }\n}\n`
    },
    
    wandboxCompilers: {
        "text/x-c++src": "gcc-head",
        "text/x-csrc": "gcc-head-c",
        "text/x-java": "openjdk-head",
        "text/x-python": "cpython-head",
        "javascript": "nodejs-head",
        "text/x-csharp": "dotnetcore-head",
        "text/x-rustsrc": "rust-head",
        "text/x-go": "go-head"
    },
    
    cfLanguageIds: {
        "text/x-c++src": "89",
        "text/x-csrc": "43",
        "text/x-java": "87",
        "text/x-python": "31",
        "javascript": "34",
        "text/x-csharp": "65",
        "text/x-rustsrc": "75",
        "text/x-go": "32"
    }
};