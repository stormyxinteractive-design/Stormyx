const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('WelcomeModal')) {
  code = code.replace('import VideoModal from "./components/VideoModal";', 'import VideoModal from "./components/VideoModal";\nimport WelcomeModal from "./components/WelcomeModal";');
  code = code.replace('<VideoModal />', '<VideoModal />\n        <WelcomeModal />');
  fs.writeFileSync('src/App.tsx', code);
}
