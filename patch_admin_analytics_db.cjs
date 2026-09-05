const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

if (!code.includes('const [analyticsData, setAnalyticsData]')) {
  code = code.replace(
    'const [localMessages, setLocalMessages] = useState<any[]>([]);',
    'const [localMessages, setLocalMessages] = useState<any[]>([]);\n  const [analyticsData, setAnalyticsData] = useState<any>({ visits: 0, logins: 0, clicks_buy: 0, clicks_preorder: 0, clicks_learnmore: 0 });'
  );

  code = code.replace(
    'import { doc, setDoc, deleteDoc, collection, getDocs, query, orderBy } from "firebase/firestore";',
    'import { doc, setDoc, deleteDoc, collection, getDocs, query, orderBy, onSnapshot } from "firebase/firestore";'
  );

  const fetchAnalyticsHook = `
  useEffect(() => {
    if (activeTab === "analytics") {
      const unsub = onSnapshot(doc(db, "analytics", "global"), (docSnapshot) => {
        if (docSnapshot.exists()) {
          setAnalyticsData(docSnapshot.data());
        }
      });
      return () => unsub();
    }
  }, [activeTab]);
`;

  code = code.replace(
    '  useEffect(() => {\n    if (activeTab === "messages") {',
    fetchAnalyticsHook + '\n  useEffect(() => {\n    if (activeTab === "messages") {'
  );
  
  // Update the hardcoded numbers
  code = code.replace(
    '<p className="text-5xl font-black text-white relative z-10 drop-shadow-[0_0_15px_var(--color-primary)]">142,859</p>',
    '<p className="text-5xl font-black text-white relative z-10 drop-shadow-[0_0_15px_var(--color-primary)]">{analyticsData.visits || 0}</p>'
  );

  code = code.replace(
    '<p className="text-5xl font-black text-white relative z-10 drop-shadow-[0_0_15px_var(--color-tertiary)]">34,210</p>',
    '<p className="text-5xl font-black text-white relative z-10 drop-shadow-[0_0_15px_var(--color-tertiary)]">{analyticsData.logins || 0}</p>'
  );
  
  // Replace the fake graph with actual clicks info
  const fakeGraph = `<h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-6">Recent Activity Traffic</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[40, 65, 45, 80, 55, 90, 75, 100, 85, 110, 95, 120, 105, 130].map((h, i) => (
                      <div key={i} className="w-full bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)] transition-colors rounded-t-sm relative group" style={{ height: \\\`\\\${\\(h/130\\)\\*100\\}%\\\` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {h * 123}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-gray-500 text-xs font-mono uppercase">
                    <span>14 Days Ago</span>
                    <span>Today</span>
                  </div>`;
  
  const realClicks = `<h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-6">Interaction Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                      <p className="text-xs text-gray-500 font-bold uppercase mb-2">Buy Clicks</p>
                      <p className="text-3xl font-black text-white">{analyticsData.clicks_buy || 0}</p>
                    </div>
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                      <p className="text-xs text-gray-500 font-bold uppercase mb-2">Pre-Order Clicks</p>
                      <p className="text-3xl font-black text-white">{analyticsData.clicks_preorder || 0}</p>
                    </div>
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                      <p className="text-xs text-gray-500 font-bold uppercase mb-2">Learn More Clicks</p>
                      <p className="text-3xl font-black text-white">{analyticsData.clicks_learnmore || 0}</p>
                    </div>
                  </div>`;
                  
  const regex = /<h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-6">Recent Activity Traffic<\/h3>.*?<span>Today<\/span>\s*<\/div>/s;
  
  code = code.replace(regex, realClicks);
  
  fs.writeFileSync('src/components/AdminPanel.tsx', code);
}
