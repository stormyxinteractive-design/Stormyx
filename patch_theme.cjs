const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

code = code.replace('primaryColor: "#2563eb",', 'primaryColor: "#facc15",');
code = code.replace('secondaryColor: "#18181b",', 'secondaryColor: "#0a0a0a",');

fs.writeFileSync('src/store.ts', code);
