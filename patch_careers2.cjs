const fs = require('fs');
let code = fs.readFileSync('src/pages/Careers.tsx', 'utf8');

const newLogic = `
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});

  const handleApply = async (job: any) => {
    if (!user) {
      await loginWithGoogle();
      return;
    }
    
    if (!selectedRoles[job.id]) {
      alert("Please select a role first!");
      return;
    }
    
    setApplying(job.id);
    try {
      const msgId = Date.now().toString();
      await setDoc(doc(db, "messages", msgId), {
        id: msgId,
        name: user.displayName || "Unknown",
        email: user.email || "Unknown",
        subject: \`⭐ JOB APPLICATION: \${job.title} (\${selectedRoles[job.id]})\`,
        message: \`[CANDIDATURA]\\n\\nUser \${user.displayName} (\${user.email}) wants to apply for the position: \${job.title}.\\nSelected Role: \${selectedRoles[job.id]}\\n\\nPlease review their application.\`,
        date: new Date().toISOString()
      });
      setApplied([...applied, job.id]);
    } catch (e) {
      console.error(e);
    }
    setApplying(null);
  };
`;

code = code.replace(/const \[applying, setApplying\] = useState<string \| null>\(null\);\n  const \[applied, setApplied\] = useState<string\[\]>\(\[\]\);\n\n  const handleApply = async \(job: any\) => \{[\s\S]*?setApplying\(null\);\n  \};/, newLogic.trim());

const actionArea = `
              <div className="shrink-0 flex flex-col gap-3 mt-4 md:mt-0 w-full md:w-auto">
                <select 
                  className="bg-black/50 border border-gray-700 text-white text-sm rounded-lg focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] block w-full p-2.5"
                  value={selectedRoles[job.id] || ""}
                  onChange={(e) => setSelectedRoles({...selectedRoles, [job.id]: e.target.value})}
                  disabled={applied.includes(job.id) || applying === job.id}
                >
                  <option value="" disabled>Select your specialty...</option>
                  <option value="Developer">Developer</option>
                  <option value="3D Modeler">3D Modeler</option>
                  <option value="Animator">Animator</option>
                  <option value="Game Designer">Game Designer</option>
                  <option value="Sound Engineer">Sound Engineer</option>
                  <option value="Other">Other</option>
                </select>

                <button 
                  onClick={() => handleApply(job)}
                  disabled={applied.includes(job.id) || applying === job.id || !selectedRoles[job.id]}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-white text-black font-bold uppercase tracking-wider px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applied.includes(job.id) ? t.applicationSent : applying === job.id ? "..." : (!user ? t.loginToApply : t.applyNow)}
                  {!applied.includes(job.id) && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
`;

code = code.replace(/<button \s*onClick=\{\(\) => handleApply\(job\)\}[\s\S]*?<\/button>/, actionArea.trim());

fs.writeFileSync('src/pages/Careers.tsx', code);
