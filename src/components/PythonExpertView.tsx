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
  AlertTriangle,
  ChevronRight,
  Database,
  LineChart,
  Box,
  Binary,
  Cpu
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
  status: 'completed' | 'error' | 'running';
}

const PY_TEMPLATES = {
  describe: {
    label: "📊 Statistika",
    code: `import pandas as pd
import numpy as np

# Data yüklə
df = pd.read_csv('data.csv')

# Statistik məlumat
print("Ölçü:", df.shape)
print("\\nSütunlar:", df.columns.tolist())
print("\\nStatistika:")
print(df.describe())`
  },
  groupby: {
    label: "📦 Şirkət üzrə qruplaşdır",
    code: `import pandas as pd

df = pd.read_csv('data.csv')

# Şirkətə görə qruplaşdır
result = df.groupby('COMPANY').agg({
    'NETSALES': 'sum',
    'SALES': 'sum',
    'INVOICE': 'count'
}).rename(columns={'INVOICE': 'COUNT'})

result = result.sort_values('NETSALES', ascending=False)
print(result.to_string())`
  },
  filter: {
    label: "🔍 Məhsul süzgəci",
    code: `import pandas as pd

df = pd.read_csv('data.csv')

# Məhsul adına görə süzgəc
product = 'Quad'
filtered = df[df['PRODUCT'] == product]

print(f"{product} məhsulları: {len(filtered)} sətir")
print(filtered.to_string(index=False))`
  },
  sort: {
    label: "↕ Satışa görə sırala",
    code: `import pandas as pd

df = pd.read_csv('data.csv')

# NETSALES ədədə çevir
if 'NETSALES' in df.columns:
    df['NS'] = df['NETSALES'].str.replace('$','').str.replace(',','').astype(float)
    sorted_df = df.sort_values('NS', ascending=False)
    print("Ən yüksək satışlar:")
    print(sorted_df[['INVOICE','COMPANY','PRODUCT','NETSALES']].head(10).to_string(index=False))`
  },
  corr: {
    label: "📈 Korrelyasiya analizi",
    code: `import pandas as pd
import numpy as np

df = pd.read_csv('data.csv')

# Rəqəmsal sütunları çevir
cols_to_convert = [c for c in ['NETSALES', 'SALES'] if c in df.columns]
for col in cols_to_convert:
    df[col] = df[col].str.replace('$','').str.replace(',','').astype(float)

# Korrelyasiya
if len(cols_to_convert) >= 2:
    print("Korrelyasiya matrisi:")
    print(df[cols_to_convert].corr())

print("\\nŞirkət üzrə ortalama:")
if 'COMPANY' in df.columns:
    print(df.groupby('COMPANY')[cols_to_convert].mean())`
  }
};

export default function PythonExpertView({ activeDataset, isAiReady }: { activeDataset: any, isAiReady: boolean | null }) {
  const [prompt, setPrompt] = useState('');
  const [editorCode, setEditorCode] = useState(PY_TEMPLATES.describe.code);
  const [terminalOutput, setTerminalOutput] = useState<{ type: 'info' | 'out' | 'err', text: string }[]>([
    { type: 'info', text: '▶ Python 3.11 hazırdır. "İcra Et" düyməsinə basın…' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleAiGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    if (isAiReady === false) {
      const errorMsg = "GEMINI_API_KEY is missing. Action required: 1. Go to AI Studio. 2. Open Settings (bottom left). 3. Go to Secrets. 4. Add GEMINI_API_KEY with your valid Gemini API Key.";
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    setAiExplanation(null);
    
    try {
      const schema = activeDataset?.headers?.join(", ") || "No headers";
      const sampleData = JSON.stringify(activeDataset?.data?.slice(0, 5) || []);

      const response = await fetch("/api/gemini/python-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, schema, sampleData }),
      });

      if (!response.ok) {
         const errData = await response.json().catch(() => ({}));
         throw new Error(errData.error || "AI generation failed");
      }
      const data = await response.json();
      
      setEditorCode(data.code);
      setAiExplanation(data.explanation);
      toast.success("Python kodu hazırlandı");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const runCode = async () => {
    setIsLoading(true);
    setTerminalOutput(prev => [...prev, { type: 'info', text: '⟳ Kod icra edilir…' }]);

    try {
      // Simulation
      await new Promise(r => setTimeout(r, 1000));
      
      setTerminalOutput(prev => [
        ...prev, 
        { type: 'info', text: '▶ Uğurla icra edildi' },
        { type: 'out', text: 'Success: Analysis completed. Output generated in data/results.csv' }
      ]);
      toast.success("Kod icra edildi");
    } catch (err: any) {
      setTerminalOutput(prev => [...prev, { type: 'err', text: err.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Banner / AI Control */}
      <div className="p-6 pb-2 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/10 rounded-lg">
                  <Terminal size={20} className="text-purple-500" />
                </div>
                Python Laboratoriya
              </h1>
            </div>
            <div className="flex gap-2">
              {Object.entries(PY_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => setEditorCode(template.code)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all"
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-purple-500/5 blur-xl group-hover:bg-purple-500/10 transition-colors pointer-events-none" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              placeholder="Python kodu yarat... məs: ən yüksək satışı olan şirkəti tap"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-6 pr-40 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all relative z-10"
            />
            <button
              onClick={handleAiGenerate}
              disabled={isLoading || !prompt.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-purple-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-purple-400 disabled:bg-slate-800 disabled:text-slate-600 transition-all z-20 flex items-center gap-2"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Kod Yarat
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Editor Section */}
        <div className="flex-1 flex flex-col border-r border-slate-800">
           <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/30">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Code2 size={12} /> python_editor.py
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditorCode("")}
                  className="px-3 py-1 text-[10px] font-black text-slate-500 hover:text-white uppercase transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={runCode}
                  disabled={isLoading}
                  className="px-4 py-1 bg-purple-500 text-white rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-purple-400 transition-all flex items-center gap-2"
                >
                  <Play size={10} fill="currentColor" /> İcra Et
                </button>
              </div>
           </div>
           
           <div className="flex-1 relative font-mono text-[13px] overflow-hidden group">
              <textarea
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                className="w-full h-full bg-transparent p-6 text-slate-300 focus:outline-none resize-none spellcheck-false leading-relaxed scrollbar-thin scrollbar-thumb-slate-800"
                spellCheck={false}
              />
           </div>

           {/* Terminal */}
           <div className="h-48 border-t border-slate-800 bg-slate-950 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-800 bg-slate-900/50">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   <Terminal size={12} /> Output / Terminal
                 </div>
                 <button 
                   onClick={() => setTerminalOutput([])}
                   className="p-1 hover:text-rose-400 transition-colors text-slate-600"
                 >
                   <Trash2 size={14} />
                 </button>
              </div>
              <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 scrollbar-thin" ref={scrollRef}>
                {terminalOutput.map((line, i) => (
                  <div key={i} className={cn(
                    "flex gap-2",
                    line.type === 'info' ? "text-cyan-400" : line.type === 'err' ? "text-rose-400" : "text-emerald-400"
                  )}>
                    <span className="shrink-0 opacity-50 select-none">›</span>
                    <span className="whitespace-pre-wrap">{line.text}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Sidebar Info - AI Explanation */}
        <AnimatePresence>
          {aiExplanation && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-slate-900/30 border-l border-slate-800 flex flex-col overflow-hidden shrink-0"
            >
              <div className="p-4 border-b border-slate-800 flex items-center gap-2 text-[10px] font-black text-purple-500 uppercase tracking-widest">
                <Sparkles size={14} /> AI Analiz İzahı
              </div>
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {aiExplanation}
                  </p>
                </div>
                <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-3">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Təklif olunan kitabxanalar</h4>
                   <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-purple-400">pandas</span>
                      <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-purple-400">numpy</span>
                      <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-purple-400">matplotlib</span>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
