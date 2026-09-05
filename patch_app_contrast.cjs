const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('highContrast')) {
  code = code.replace(
    'const themeSettings = useStore((state) => state.themeSettings);',
    'const themeSettings = useStore((state) => state.themeSettings);\n  const highContrast = useStore((state) => state.highContrast);'
  );
  
  const themeEffect = `useEffect(() => {
    if (highContrast) {
      document.documentElement.style.setProperty('--color-primary', '#ffff00');
      document.documentElement.style.setProperty('--color-secondary', '#000000');
      document.documentElement.style.setProperty('--color-accent', '#ffffff');
      document.documentElement.style.setProperty('--color-tertiary', '#00ffff');
      document.documentElement.style.setProperty('--color-quaternary', '#ff00ff');
    } else if (themeSettings) {
      document.documentElement.style.setProperty('--color-primary', themeSettings.primaryColor);
      document.documentElement.style.setProperty('--color-secondary', themeSettings.secondaryColor);
      document.documentElement.style.setProperty('--color-accent', themeSettings.accentColor);
      document.documentElement.style.setProperty('--color-tertiary', themeSettings.tertiaryColor || "#db2777");
      document.documentElement.style.setProperty('--color-quaternary', themeSettings.quaternaryColor || "#10b981");
    }
  }, [themeSettings, highContrast]);`;
  
  code = code.replace(/useEffect\(\(\) => \{\s*if \(themeSettings\) \{[\s\S]*?\}\s*\}, \[themeSettings\]\);/, themeEffect);
  
  fs.writeFileSync('src/App.tsx', code);
}
