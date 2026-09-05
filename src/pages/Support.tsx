import { useState, FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useStore } from "../store";
import { translations } from "../translations";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { motion } from "motion/react";

export default function Support() {
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { faqs, language } = useStore();
  const t = translations[language];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        subject,
        message,
        createdAt: new Date().toISOString()
      });
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Error sending message. Please try again.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen"
    >
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-12">{t.support}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">{t.howCanWeHelp}</h2>
          
          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{t.messageSent}</h3>
              <p className="text-gray-400">{t.messageSentDesc}</p>
              <button 
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] hover:underline"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">{t.name}</label>
                  <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">{t.email}</label>
                  <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">{t.subject}</label>
                <select required value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors appearance-none">
                  <option value="">Select a topic</option>
                  <option value="tech">Technical Support</option>
                  <option value="billing">Billing / Store</option>
                  <option value="account">Account Issues</option>
                  <option value="feedback">General Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">{t.message}</label>
                <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={5} className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === "sending"}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 disabled:opacity-50 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {status === "sending" ? t.sending : (
                  <>{t.sendMessage} <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">{t.faq}</h2>
          {faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  key={faq.id} 
                  className="bg-black/50 border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-colors"
                >
                  <h3 className="font-bold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 py-8 text-center border border-dashed border-gray-800 rounded-xl">
              No FAQs available yet.
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
