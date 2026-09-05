const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const msgRender = `
                  localMessages.map((msg) => (
                    <div key={msg.id} className={\`bg-black/50 p-6 rounded-xl border \${msg.subject?.includes('⭐ JOB APPLICATION') ? 'border-[var(--color-primary)]/50 shadow-[0_0_15px_var(--color-primary)]' : 'border-gray-800'} relative\`}>
                      <button onClick={() => removeDoc("messages", msg.id).then(() => setLocalMessages(localMessages.filter(m => m.id !== msg.id)))} className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded"><Trash className="w-5 h-5" /></button>
                      <div className="mb-2">
                        <h3 className={\`font-bold text-lg \${msg.subject?.includes('⭐ JOB APPLICATION') ? 'text-[var(--color-primary)] drop-shadow-[0_0_8px_var(--color-primary)]' : 'text-white'}\`}>{msg.subject}</h3>
                        <p className="text-sm text-gray-400 uppercase tracking-widest">From: {msg.name} ({msg.email})</p>
                        <p className="text-xs text-gray-500 mt-1">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : (msg.date ? new Date(msg.date).toLocaleString() : 'No date')}</p>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap mt-4 bg-black/50 p-4 rounded border border-gray-800">{msg.message}</p>
                    </div>
                  ))
`;

code = code.replace(/localMessages\.map\(\(msg\) => \([\s\S]*?<\/div>\s*\)\)/, msgRender.trim());
fs.writeFileSync('src/components/AdminPanel.tsx', code);
