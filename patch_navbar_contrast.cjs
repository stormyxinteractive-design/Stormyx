const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

if (!code.includes('EyeOff')) {
  code = code.replace(
    'import { Search, Menu, X, User } from "lucide-react";',
    'import { Search, Menu, X, User, Eye, EyeOff } from "lucide-react";'
  );
  
  code = code.replace(
    'const { language, themeSettings, games, news } = useStore();',
    'const { language, themeSettings, games, news, highContrast, setHighContrast } = useStore();'
  );
  
  const toggleBtn = `<button 
              onClick={() => setHighContrast(!highContrast)}
              className="text-gray-300 hover:text-white p-2"
              title="Toggle High Contrast Mode"
            >
              {highContrast ? <EyeOff className="w-5 h-5 text-[var(--color-primary)]" /> : <Eye className="w-5 h-5" />}
            </button>
            <button `;
            
  code = code.replace(
    '<button \n              onClick={() => setShowSearch(!showSearch)}',
    toggleBtn + '\n              onClick={() => setShowSearch(!showSearch)}'
  );
  
  // also add it to mobile menu
  const mobileToggle = `
                <button 
                  onClick={() => { setHighContrast(!highContrast); setIsOpen(false); }} 
                  className="w-full text-center border border-gray-700 text-white font-bold uppercase tracking-wider text-sm px-5 py-3 rounded-full flex justify-center items-center gap-2 mb-4"
                >
                  {highContrast ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} {highContrast ? "Standard Contrast" : "High Contrast"}
                </button>
                {user ? (`;
                
  code = code.replace('{user ? (', mobileToggle);
  
  fs.writeFileSync('src/components/Navbar.tsx', code);
}
