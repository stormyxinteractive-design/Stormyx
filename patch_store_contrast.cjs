const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

if (!code.includes('highContrast')) {
  // Add to AppState interface
  code = code.replace(
    'language: LanguageCode;\n  setAdmin: (isAdmin: boolean) => void;\n  setLanguage: (lang: LanguageCode) => void;',
    'language: LanguageCode;\n  highContrast: boolean;\n  setHighContrast: (val: boolean) => void;\n  setAdmin: (isAdmin: boolean) => void;\n  setLanguage: (lang: LanguageCode) => void;'
  );
  
  // Add initial state and setter
  const initialContrast = `  highContrast: localStorage.getItem("stormyx_hc") === "true",
  setHighContrast: (val) => {
    localStorage.setItem("stormyx_hc", val.toString());
    set({ highContrast: val });
  },`;
  
  code = code.replace(
    'language: getStoredLang(),',
    'language: getStoredLang(),\n' + initialContrast
  );
  
  fs.writeFileSync('src/store.ts', code);
}
