import { useStore } from "../store";
import { translations } from "../translations";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { loginWithGoogle } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";

export default function Careers() {
  
  const { themeSettings, language, jobs } = useStore();
  const t = translations[language];
  const auth = getAuth();
  const user = auth.currentUser;
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");

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
        subject: `⭐ JOB APPLICATION: ${job.title} (${selectedRoles[job.id]})`,
        message: `[CANDIDATURA]\n\nUser ${user.displayName} (${user.email}) wants to apply for the position: ${job.title}.\nSelected Role: ${selectedRoles[job.id]}\n\nPlease review their application.`,
        date: new Date().toISOString(),
        createdAt: Date.now()
      });
      setApplied([...applied, job.id]);
    } catch (e) {
      console.error(e);
    }
    setApplying(null);
  };


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen"
    >
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
              className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${selectedDepartment === dept ? 'bg-[var(--color-primary)] text-white shadow-[0_0_10px_var(--color-primary)]' : 'bg-black/50 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'}`}
            >
              {dept}
            </button>
          ))}
        </div>
      )}
      
      <div className="space-y-6">
        {(jobs || []).filter(j => selectedDepartment === "All" || j.department === selectedDepartment).length > 0 ? (
          (jobs || []).filter(j => selectedDepartment === "All" || j.department === selectedDepartment).map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-black/50 p-6 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_5px_15px_-5px_var(--color-accent)] hover:border-[var(--color-accent)]/50 transition-all duration-300 group flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-wider text-white mb-2 group-hover:text-[var(--color-accent)] transition-colors">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full"><Briefcase className="w-4 h-4" /> {job.department}</span>
                  <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full"><MapPin className="w-4 h-4" /> {job.location}</span>
                  <span className="bg-white/5 px-3 py-1 rounded-full">{job.type}</span>
                </div>
                <p className="text-gray-300 max-w-3xl whitespace-pre-wrap">{job.description}</p>
              </div>
              
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

            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-black/30 rounded-xl border border-gray-800">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-wider">No open positions right now</h3>
            <p className="text-gray-500 mt-2">Check back later or send us a general application.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
