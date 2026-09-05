const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

const oldLang = `const getStoredLang = (): LanguageCode => {
  const stored = localStorage.getItem("stormyx_lang") as LanguageCode;
  return stored && ["pt", "en", "es", "fr", "de"].includes(stored) ? stored : "en";
};`;

const newLang = `const getStoredLang = (): LanguageCode => {
  const stored = localStorage.getItem("stormyx_lang") as LanguageCode;
  if (stored && ["pt", "en", "es", "fr", "de"].includes(stored)) return stored;
  
  // Auto-detect based on browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('pt')) return 'pt';
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('fr')) return 'fr';
    if (browserLang.startsWith('de')) return 'de';
  }
  return "en";
};`;

code = code.replace(oldLang, newLang);
fs.writeFileSync('src/store.ts', code);
