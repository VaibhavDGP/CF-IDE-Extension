const CPEASY_CONFIG = {
    templates: {
        "text/x-c++src": `#include <iostream>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    return 0;\n}`,
        "cpp": `#include <iostream>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    return 0;\n}`,
        
        "text/x-csrc": `#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}`,
        "c": `#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}`,
        
        "text/x-java": `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        \n    }\n}`,
        "java": `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        \n    }\n}`,
        
        "text/x-python": `import sys\n\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()`,
        "python": `import sys\n\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()`,
        
        "javascript": `const fs = require('fs');\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8');\n    \n}\n\nmain();`,
        "js": `const fs = require('fs');\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8');\n    \n}\n\nmain();`,
        
        "text/x-csharp": `using System;\n\nclass Program {\n    static void Main() {\n        \n    }\n}`,
        "csharp": `using System;\n\nclass Program {\n    static void Main() {\n        \n    }\n}`,
        
        "text/x-rustsrc": `use std::io::{self, Read};\n\nfn main() {\n    \n}`,
        "rust": `use std::io::{self, Read};\n\nfn main() {\n    \n}`,
        
        "text/x-go": `package main\n\nimport "fmt"\n\nfunc main() {\n    \n}`,
        "go": `package main\n\nimport "fmt"\n\nfunc main() {\n    \n}`
    },
    
    judge0Compilers: {
        "text/x-c++src": "gcc-13.2.0",
        "text/x-csrc": "gcc-13.2.0-c",
        "text/x-java": "openjdk-head",
        "text/x-python": "cpython-head",
        "javascript": "nodejs-head",
        "text/x-csharp": "dotnetcore-head",
        "text/x-rustsrc": "rust-head",
        "text/x-go": "go-head"
    },

    maxParallelRuns: 1,

    cfLanguageIds: {
        "text/x-c++src": "89",
        "text/x-csrc": "43",
        "text/x-java": "87",
        "text/x-python": "31",
        "javascript": "34",
        "text/x-csharp": "65",
        "text/x-rustsrc": "75",
        "text/x-go": "32"
    },

    cfLanguageLabels: {
        "text/x-c++src": ["gnu c++", "c++"],
        "text/x-csrc": ["gnu c", " c "],
        "text/x-java": ["java"],
        "text/x-python": ["python", "pypy"],
        "javascript": ["javascript", "node.js", "nodejs"],
        "text/x-csharp": ["c#"],
        "text/x-rustsrc": ["rust"],
        "text/x-go": ["go"]
    }
};
