const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('trackEvent')) {
  code = code.replace(
    'import { useStore } from "./store";',
    'import { useStore } from "./store";\nimport { trackEvent } from "./analytics";'
  );

  const initHook = `
  useEffect(() => {
    if (!sessionStorage.getItem("stormyx_visited")) {
      sessionStorage.setItem("stormyx_visited", "true");
      trackEvent("visits");
    }
  }, []);
`;
  
  code = code.replace(
    '  useEffect(() => {\n    const cleanup = initializeListeners();',
    initHook + '\n  useEffect(() => {\n    const cleanup = initializeListeners();'
  );

  fs.writeFileSync('src/App.tsx', code);
}
