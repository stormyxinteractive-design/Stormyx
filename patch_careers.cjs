const fs = require('fs');
let code = fs.readFileSync('src/pages/Careers.tsx', 'utf8');

const importLines = `import { getAuth } from "firebase/auth";
import { loginWithGoogle } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";`;

code = code.replace('import { Link } from "react-router-dom";', 'import { Link } from "react-router-dom";\n' + importLines);

const componentTop = `
  const { themeSettings, language, jobs } = useStore();
  const t = translations[language];
  const auth = getAuth();
  const user = auth.currentUser;
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<string[]>([]);

  const handleApply = async (job: any) => {
    if (!user) {
      await loginWithGoogle();
      return;
    }
    
    setApplying(job.id);
    try {
      const msgId = Date.now().toString();
      await setDoc(doc(db, "messages", msgId), {
        id: msgId,
        name: user.displayName || "Unknown",
        email: user.email || "Unknown",
        subject: \`Job Application: \${job.title}\`,
        message: \`User \${user.displayName} (\${user.email}) wants to apply for the position: \${job.title}.\`,
        date: new Date().toISOString()
      });
      setApplied([...applied, job.id]);
    } catch (e) {
      console.error(e);
    }
    setApplying(null);
  };
`;

code = code.replace(/const \{ themeSettings, language, jobs \} = useStore\(\);\n  const t = translations\[language\];/, componentTop);

const applyButton = `
              <button 
                onClick={() => handleApply(job)}
                disabled={applied.includes(job.id) || applying === job.id}
                className="shrink-0 flex items-center gap-2 bg-[var(--color-accent)] hover:bg-white text-black font-bold uppercase tracking-wider px-6 py-3 rounded transition-colors mt-4 md:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applied.includes(job.id) ? t.applicationSent : applying === job.id ? "..." : (!user ? t.loginToApply : t.applyNow)}
                {!applied.includes(job.id) && <ArrowRight className="w-4 h-4" />}
              </button>
`;

code = code.replace(
  /<a href=\{`mailto:\$\{themeSettings\?\.contactEmail\}\?subject=Application for \$\{job\.title\}`\} className="shrink-0 flex items-center gap-2 bg-\[var\(--color-accent\)\] hover:bg-white text-black font-bold uppercase tracking-wider px-6 py-3 rounded transition-colors mt-4 md:mt-0">\s*Apply Now <ArrowRight className="w-4 h-4" \/>\s*<\/a>/,
  applyButton
);

fs.writeFileSync('src/pages/Careers.tsx', code);
