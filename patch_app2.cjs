const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('WelcomeModal')) {
  code = code.replace('import ScrollProgress from "./components/ScrollProgress";', 'import ScrollProgress from "./components/ScrollProgress";\nimport WelcomeModal from "./components/WelcomeModal";');
  code = code.replace('<CookieBanner />', '<CookieBanner />\n        <WelcomeModal />');
  fs.writeFileSync('src/App.tsx', code);
}
