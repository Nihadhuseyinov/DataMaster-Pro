"use client";

import { useState } from "react";
import {
  Code2,
  Sparkles,
  Search,
  Database,
  Terminal,
  History,
  AlertCircle,
  Loader2,
  Table as Table2,
} from "lucide-react";
import alasql from "alasql";
import { toast } from "sonner";
import { cn } from "../lib/utils";

import { useApp } from "../App";

export default function SqlLabView({ activeDataset }: { activeDataset?: any }) {
  const { isAiReady } = useApp();
  const [prompt, setPrompt] = useState("");
  const [sqlCode, setSqlCode] = useState(`-- Məlumatları görmək üçün SQL sorğusu\nSELECT * FROM data;`);
  const [results, setResults] = useState<any[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [activeResultTab, setActiveResultTab] = useState<"results" | "logs" | "history">("results");
  const [error, setError] = useState<string | null>(null);

  const generateSql = async () => {
    if (!prompt.trim()) {
      toast.error("Zəhmət olmasa AI üçün sualınızı daxil edin.");
      return;
    }
    if (!activeDataset) {
      toast.error("Zəhmət olmasa əvvəlcə məlumatı yükləyin.");
      return;
    }
    if (isAiReady === false) {
      toast.error("GEMINI_API_KEY tapılmadı. Zəhmət olmasa Ayarlar bölməsindən AI qoşulmasını yoxlayın.");
      return;
    }

    setIsGenerating(true);
    setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] AI sorğu hazırlayır: "${prompt}"`]);
    
    try {
      // Create a simplified schema from the data
      const sample = activeDataset.data?.[0] || {};
      const schema = Object.entries(sample)
        .map(([key, val]) => `${key} (${typeof val})`)
        .join(", ");
      
      const response = await fetch("/api/gemini/nl-to-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: prompt, 
          schema: `Table 'data' with columns: ${schema}. Provide standard SQL compatible with alasql.` 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate SQL");
      }

      const { sql: generatedSql } = await response.json();
      const finalSql = generatedSql.replace(/employees|table_name|dataset/gi, 'data');
      setSqlCode(finalSql);
      setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Sorğu uğurla yaradıldı.`]);
      toast.success("Sorğu yaradıldı!");
    } catch (err) {
      console.error(err);
      setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Sorğu yaradılarkən xəta baş verdi.`]);
      toast.error("Sorğu yaradılmadı.");
    } finally {
      setIsGenerating(false);
    }
  };

  const runQuery = async () => {
    if (!activeDataset) {
      toast.error("Məlumat tapılmadı. Zəhmət olmasa fayl yükləyin.");
      return;
    }

    setIsRunning(true);
    setError(null);
    setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Sorğu icra olunur...`]);

    try {
      alasql('CREATE TABLE IF NOT EXISTS data');
      alasql.tables.data.data = activeDataset.data;
      
      const result = alasql(sqlCode);
      
      setResults(Array.isArray(result) ? result : [result]);
      setQueryHistory((prev) => [sqlCode, ...prev].slice(0, 10));
      setConsoleLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Sorğu tamamlandı: ${Array.isArray(result) ? result.length : 1} sətir tapıldı.`,
      ]);
      setActiveResultTab("results");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Yanlış SQL sorğusu");
      setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Xəta: ${err.message}`]);
      toast.error("Sorğu icra olunmadı");
    } finally {
      setIsRunning(false);
    }
  };

  const dynamicHeaders = results && results.length > 0 ? Object.keys(results[0]) : [];

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* AI Query Input */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/20">
        <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 focus-within:border-cyan-500/50 transition-all">
          <Sparkles size={20} className="text-cyan-400 shrink-0" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateSql()}
            placeholder="AI-dan soruşun: 'ən çox maaş alanı göstər' və ya 'regionlar üzrə cəmi gəliri hesabla'..."
            className="flex-1 bg-transparent text-white placeholder-slate-600 outline-none text-sm"
          />
          <button 
            onClick={generateSql}
            disabled={isGenerating || !activeDataset}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
          >
            {isGenerating ? <Loader2 size={14} /> : <Sparkles size={14} />}
            SORĞU YARAT
          </button>
        </div>
        {!activeDataset && (
          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
            <AlertCircle size={10} /> Zəhmət olmasa əvvəlcə 'Məlumat Yükləmə' bölməsindən fayl yükləyin
          </p>
        )}
      </div>

      {/* Editor Control */}
      <div className="flex items-center gap-1 px-4 pt-3 bg-slate-900/10">
        <div className="flex gap-1">
          <button className="px-4 py-2 rounded-t-lg text-sm font-bold bg-slate-900 text-cyan-400 border-t border-x border-slate-800 flex items-center gap-2">
            <Database size={14} /> SQL REDAKTOR
          </button>
        </div>
        <div className="flex-1 border-b border-slate-800" />
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => setSqlCode(`SELECT * FROM data;`)}
            className="text-[10px] text-slate-500 hover:text-white font-bold uppercase tracking-widest"
          >
            Reset
          </button>
          <button
            onClick={runQuery}
            disabled={isRunning || !activeDataset}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-900 text-white px-5 py-2 rounded-lg text-sm font-black transition-all"
          >
            {isRunning ? (
              <Loader2 size={16} />
            ) : (
              <Terminal size={16} />
            )}
            İCRA ET
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 bg-slate-950 border-x border-slate-800 overflow-auto relative">
        <div className="flex h-full font-mono text-sm leading-6">
          <div className="w-12 bg-slate-900/50 border-r border-slate-800 text-slate-700 text-right pr-3 pt-4 select-none">
            {sqlCode.split("\n").map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={sqlCode}
            onChange={(e) => setSqlCode(e.target.value)}
            className="flex-1 bg-transparent text-slate-300 p-4 resize-none outline-none"
            spellCheck={false}
          />
        </div>
        {error && (
          <div className="absolute bottom-4 right-4 max-w-sm bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-400 text-xs font-mono">{error}</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="h-72 border-t border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="flex items-center border-b border-slate-800 px-2">
          <button
            onClick={() => setActiveResultTab("results")}
            className={cn(
              "px-4 py-3 text-[10px] font-black tracking-widest flex items-center gap-2 transition-all",
              activeResultTab === "results" ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Table2 size={14} /> NƏTİCƏLƏR {results ? `(${results.length})` : ''}
          </button>
          <button
            onClick={() => setActiveResultTab("logs")}
            className={cn(
              "px-4 py-3 text-[10px] font-black tracking-widest flex items-center gap-2 transition-all",
              activeResultTab === "logs" ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <History size={14} /> KONSOLE
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeResultTab === "results" && (
            <div className="h-full">
              {!results ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50 grayscale">
                  <Code2 size={48} className="mb-4" />
                  <p className="text-xs font-black tracking-[0.2em] uppercase">Göstəriləcək nəticə yoxdur</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs font-medium">
                    <thead className="bg-slate-900 text-slate-500 font-bold uppercase tracking-widest h-10 border-b border-slate-800">
                      <tr>
                        {dynamicHeaders.map((h) => (
                          <th key={h} className="px-4 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {results.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                          {dynamicHeaders.map((h) => {
                            const val = row[h];
                            const isNumeric = typeof val === 'number' || (!isNaN(Number(val)) && typeof val === 'string' && val.length > 0);
                            return (
                              <td key={h} className={cn(
                                "px-4 py-3 whitespace-nowrap",
                                isNumeric ? "font-mono text-cyan-400" : "text-slate-300"
                              )}>
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeResultTab === "logs" && (
            <div className="space-y-1 font-mono text-[10px]">
              {consoleLogs.map((log, i) => (
                <div key={i} className="text-slate-500 border-l-2 border-slate-800 pl-3">
                  <span className="text-cyan-700 font-bold tracking-tighter">{">>>"}</span> {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


