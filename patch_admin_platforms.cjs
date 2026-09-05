const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(/checked=\{game\.platforms\.includes\(platform\)\}/g, 'checked={(game.platforms || []).includes(platform) || (platform === "PC" && (game.platforms || []).includes("pc"))}');
code = code.replace(/n\[index\]\.platforms = \[\.\.\.n\[index\]\.platforms, platform\];/g, 'n[index].platforms = [...(n[index].platforms || []), platform];');
code = code.replace(/n\[index\]\.platforms = n\[index\]\.platforms\.filter\(p => p !== platform\);/g, 'n[index].platforms = (n[index].platforms || []).filter(p => p !== platform && p !== platform.toLowerCase());');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
