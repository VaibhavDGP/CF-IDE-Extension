const CPEASY_CONFIG = {
    templates: {
    "text/x-c++src": `#include <bits/stdc++.h>
using namespace std;

void solve() {
    // Write your solution here.
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t = 1;
    // cin >> t; // Uncomment if the input starts with a test-case count.

    while (t--) {
        solve();
    }

    return 0;
}
`
},

    judge0Compilers: {
        "text/x-c++src": "gcc-13.2.0"
    },

    maxParallelRuns: 1,

    cfLanguageIds: {
        "text/x-c++src": "89"
    },

    cfLanguageLabels: {
        "text/x-c++src": ["gnu c++", "c++"]
    }
};