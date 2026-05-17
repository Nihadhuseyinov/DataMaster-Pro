import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  Code2, 
  Sparkles, 
  FileJson, 
  Download, 
  Trash2, 
  Loader2,
  Copy,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface PythonAnalysis {
  id: string;
  question: string;
  code: string;
  explanation: string;
  timestamp: Date;
}

export default function PythonExpertView({ activeDataset, isAiReady }: { activeDataset: any, isAiReady: boolean | null }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<PythonAnalysis[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleAnalyze = async () => {
    if (!input.trim() || isLoading) return;
    if (!activeDataset) {
      toast.error("Məlumat tapılmadı. Zəhmət olmasa fayl yükləyin.");
      return;
    }
    if (isAiReady === false) {
      toast.error("AI Key is missing.");
      return;
    }

    setIsLoading(true);
    const userQuestion = input.trim();
    setInput('');

    try {
      const schema = activeDataset.headers?.join(", ") || "No headers";
      const sampleData = JSON.stringify(activeDataset.data?.slice(0, 5));

      const response = await fetch("/api/gemini/python-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userQuestion, 
          schema, 
          sampleData 
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Python analizi uğursuz oldu");
      }

      const data = await response.json();
      const newAnalysis: PythonAnalysis = {
        id: Math.random().toString(36).substr(2, 9),
        question: userQuestion,
        code: data.code,
        explanation: data.explanation,
        timestamp: new Date()
      };

      setHistory(prev => [...prev, newAnalysis]);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Xəta baş verdi");
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Kod kopyalandı!");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-950 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-800" ref={scrollRef}>
        {isAiReady === false && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-4 text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold uppercase tracking-widest text-[10px] mb-1">AI Konfiqurasiyası tapılmadı</p>
              <p className="opacity-80">Python analizi üçün Gemini API açarı tələb olunur.</p>
            </div>
          </div>
        )}

        {history.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6 py-20 grayscale opacity-60 hover:grayscale-0 transition-all">
            <div className="w-24 h-24 rounded-[2rem] bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-2xl relative group">
               <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
               <Code2 size={48} className="text-yellow-500 relative z-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Python Data Expert</h2>
              <p className="text-sm text-slate-400 mt-2">Məlumatlarınızı Python (Pandas/Seaborn) gücü ilə analiz edin. Sadəcə nə etmək istədiyinizi yazın.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
               {[
                 "Mənfəəti proqnozlaşdır",
                 "Trend xəttini analiz et",
                 "Anomaliyaları aşkarla",
                 "Pivot cədvəli yarat"
               ].map(s => (
                 <button 
                  key={s} 
                  onClick={() => { setInput(s); }}
                  className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 hover:text-white hover:border-yellow-500/50 transition-all text-left font-medium"
                 >
                   "{s}"
                 </button>
               ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <Play size={16} className="text-yellow-500" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black text-white uppercase tracking-tight">{item.question}</h3>
                    <span className="text-[10px] text-slate-600 font-mono italic">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden mb-4">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-800/50">
                       <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Terminal size={12} /> pandas_analysis.py
                       </div>
                       <button 
                        onClick={() => copyCode(item.code)}
                        className="p-1.5 text-slate-500 hover:text-white transition-colors"
                       >
                          <Copy size={14} />
                       </button>
                    </div>
                    <pre className="p-4 font-mono text-[11px] text-yellow-100/90 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                      {item.code}
                    </pre>
                  </div>

                  <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
                    <div className="flex items-center gap-2 text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2">
                       <Sparkles size={12} /> AI İZAHATI
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 text-yellow-500"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-black uppercase tracking-widest animate-pulse italic">Python Mühərriki Hazırlanır...</span>
          </motion.div>
        )}
      </div>

      <div className="p-6 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Python ilə hansı analizi etmək istəyirsiniz?"
              className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-5 pl-8 pr-32 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500/50 transition-all shadow-2xl"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={() => setHistory([])}
                className="p-2.5 text-slate-500 hover:text-rose-400 transition-colors"
                title="Təmizlə"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !input.trim() || !activeDataset}
                className="h-11 px-6 bg-yellow-500 text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-yellow-400 disabled:bg-slate-800 disabled:text-slate-600 transition-all flex items-center gap-2"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Analiz et
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-[9px] font-black uppercase tracking-widest text-slate-600">
             <div className="flex items-center gap-1.5"><Terminal size={10} /> Python 3.10</div>
             <div className="flex items-center gap-1.5"><FileJson size={10} /> Pandas / Matplotlib</div>
             <div className="flex items-center gap-1.5"><Download size={10} /> Export To Notebook</div>
          </div>
        </div>
      </div>
    </div>
  );
}
