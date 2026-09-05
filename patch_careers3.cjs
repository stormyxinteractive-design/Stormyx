const fs = require('fs');
let code = fs.readFileSync('src/pages/Careers.tsx', 'utf8');

// 1. Add selectedDepartment state
const statePattern = `const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});`;
code = code.replace(
  statePattern,
  statePattern + '\n  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");'
);

// 2. Add createdAt to setDoc
const setDocOld = `        date: new Date().toISOString()
      });`;
const setDocNew = `        date: new Date().toISOString(),
        createdAt: Date.now()
      });`;
code = code.replace(setDocOld, setDocNew);

// 3. Extract unique departments and filter jobs
const filterLogic = `
      <div className="mb-12">
        <Link to="/corporate" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider mb-4 inline-block">&larr; Back to Corporate</Link>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-5xl font-black uppercase tracking-widest"
        >
          {t.careers}
        </motion.h1>
        <p className="text-gray-400 mt-4 max-w-2xl text-lg">
          Join our team and help us create worlds that challenge reality. We are always looking for passionate and talented individuals.
        </p>
      </div>

      {jobs && jobs.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {["All", ...Array.from(new Set(jobs.map(j => j.department)))].map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={\`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors \${selectedDepartment === dept ? 'bg-[var(--color-primary)] text-white shadow-[0_0_10px_var(--color-primary)]' : 'bg-black/50 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'}\`}
            >
              {dept}
            </button>
          ))}
        </div>
      )}
`;

code = code.replace(/<div className="mb-12">[\s\S]*?<\/div>/, filterLogic.trim());

// 4. Update the map to use filteredJobs
const mapOld = `{jobs && jobs.length > 0 ? (
          jobs.map((job, idx) => (`;
const mapNew = `{(jobs || []).filter(j => selectedDepartment === "All" || j.department === selectedDepartment).length > 0 ? (
          (jobs || []).filter(j => selectedDepartment === "All" || j.department === selectedDepartment).map((job, idx) => (`;
code = code.replace(mapOld, mapNew);

fs.writeFileSync('src/pages/Careers.tsx', code);
