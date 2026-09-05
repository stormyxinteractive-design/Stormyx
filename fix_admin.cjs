const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Ensure pointer-events on the modal container
code = code.replace('<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">', '<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 pointer-events-auto" onClick={(e) => { if(e.target === e.currentTarget) closePanel(); }}>');
code = code.replace('<div className="bg-[var(--color-secondary)] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 shadow-2xl relative">', '<div className="bg-[var(--color-secondary)] w-full max-w-5xl h-[80vh] overflow-hidden rounded-xl border border-white/10 shadow-2xl relative flex flex-col">');

// Fix the flex layout inner part
code = code.replace('<div className="flex h-full min-h-[75vh]">', '<div className="flex flex-1 h-full overflow-hidden">');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
