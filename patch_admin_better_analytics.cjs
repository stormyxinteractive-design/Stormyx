const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const oldAnalytics = `{activeTab === "analytics" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/50 p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2 relative z-10">Total Visitors</h3>
                    <p className="text-5xl font-black text-white relative z-10 drop-shadow-[0_0_15px_var(--color-primary)]">{analyticsData.visits || 0}</p>
                    <div className="mt-4 text-green-400 text-sm font-bold flex items-center relative z-10">
                      <span className="bg-green-500/20 px-2 py-1 rounded mr-2">+12.5%</span> from last month
                    </div>
                  </div>
                  
                  <div className="bg-black/50 p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-tertiary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2 relative z-10">Logged-in Users</h3>
                    <p className="text-5xl font-black text-white relative z-10 drop-shadow-[0_0_15px_var(--color-tertiary)]">{analyticsData.logins || 0}</p>
                    <div className="mt-4 text-green-400 text-sm font-bold flex items-center relative z-10">
                      <span className="bg-green-500/20 px-2 py-1 rounded mr-2">+8.2%</span> from last month
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/50 p-8 rounded-2xl border border-white/5">
                  <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-6">Interaction Metrics</h3>
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
                  </div>
                </div>
              </div>
            )}`;
            
const newAnalytics = `{activeTab === "analytics" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-black/80 backdrop-blur p-6 rounded-xl border border-gray-800 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Total Visitors</h3>
                    <p className="text-4xl font-black text-white relative z-10">{analyticsData.visits || 0}</p>
                  </div>
                  
                  <div className="bg-black/80 backdrop-blur p-6 rounded-xl border border-gray-800 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-tertiary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Registered / Logins</h3>
                    <p className="text-4xl font-black text-white relative z-10">{analyticsData.logins || 0}</p>
                    <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5 relative z-10 overflow-hidden">
                      <div className="bg-[var(--color-tertiary)] h-1.5 rounded-full" style={{ width: \`\${Math.min(((analyticsData.logins || 0) / Math.max(analyticsData.visits || 1, 1)) * 100, 100)}%\` }}></div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold relative z-10">{((analyticsData.logins || 0) / Math.max(analyticsData.visits || 1, 1) * 100).toFixed(1)}% Conversion</p>
                  </div>

                  <div className="bg-black/80 backdrop-blur p-6 rounded-xl border border-gray-800 relative overflow-hidden group md:col-span-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Total Purchase Intent (Buy + Pre-order)</h3>
                    <div className="flex items-end gap-4 relative z-10">
                      <p className="text-4xl font-black text-white">{(analyticsData.clicks_buy || 0) + (analyticsData.clicks_preorder || 0)}</p>
                      <p className="text-sm font-bold text-green-400 mb-1">+{(analyticsData.clicks_buy || 0)} Sales / +{(analyticsData.clicks_preorder || 0)} Pre-orders</p>
                    </div>
                    <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5 relative z-10 overflow-hidden">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: \`\${Math.min((((analyticsData.clicks_buy || 0) + (analyticsData.clicks_preorder || 0)) / Math.max(analyticsData.visits || 1, 1)) * 100, 100)}%\` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/80 backdrop-blur p-8 rounded-xl border border-gray-800">
                  <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-8">Interaction Funnel</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="text-gray-400">Discover (Learn More Clicks)</span>
                        <span className="text-white">{analyticsData.clicks_learnmore || 0}</span>
                      </div>
                      <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                        <div className="bg-[var(--color-primary)] h-3 rounded-full transition-all duration-1000" style={{ width: \`\${Math.min(((analyticsData.clicks_learnmore || 0) / Math.max(analyticsData.visits || 1, 1)) * 100, 100)}%\` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="text-gray-400">Commitment (Pre-order Clicks)</span>
                        <span className="text-white">{analyticsData.clicks_preorder || 0}</span>
                      </div>
                      <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                        <div className="bg-yellow-500 h-3 rounded-full transition-all duration-1000" style={{ width: \`\${Math.min(((analyticsData.clicks_preorder || 0) / Math.max(analyticsData.visits || 1, 1)) * 100, 100)}%\` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="text-gray-400">Conversion (Buy Clicks)</span>
                        <span className="text-white">{analyticsData.clicks_buy || 0}</span>
                      </div>
                      <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                        <div className="bg-green-500 h-3 rounded-full transition-all duration-1000" style={{ width: \`\${Math.min(((analyticsData.clicks_buy || 0) / Math.max(analyticsData.visits || 1, 1)) * 100, 100)}%\` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}`;

code = code.replace(oldAnalytics, newAnalytics);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
