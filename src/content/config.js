const CPEASY_CONFIG = {
    templates: {
        "text/x-c++src": `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);

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