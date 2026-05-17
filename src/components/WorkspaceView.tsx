"use client";

import { useState } from "react";
import {
  Table2,
  Search,
  Filter,
  Download,
  MoreVertical,
  Plus,
  ArrowUpDown,
  FileText,
  Database,
  Grid,
  List,
} from "lucide-react";
import { cn } from "../lib/utils";

export default function WorkspaceView({ activeDataset }: { activeDataset?: any }) {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState("");

  const tables = [
    { name: "employees", rows: 1250, size: "2.4 MB", lastModified: "2 saat əvvəl", type: "system" },
    { name: "departments", rows: 8, size: "12 KB", lastModified: "1 gün əvvəl", type: "system" },
    { name: "salaries", rows: 4500, size: "8.1 MB", lastModified: "30 dəq əvvəl", type: "system" },
    { name: "projects", rows: 45, size: "156 KB", lastModified: "3 gün əvvəl", type: "system" },
    { name: "logs", rows: 50000, size: "45 MB", lastModified: "5 dəq əvvəl", type: "system" },
  ];

  if (activeDataset) {
    tables.unshift({
      name: activeDataset.name,
      rows: activeDataset.rows,
      size: "N/A",
      lastModified: "İndi",
      type: "uploaded"
    });
  }

  const filteredTables = tables.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-full flex flex-col bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Table2 size={28} className="text-cyan-400" />
            İş Sahəsi
          </h1>
          <p className="text-slate-500 text-sm mt-1">Datasetləri idarə edin, cədvəlləri nəzərdən keçirin</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === "table" ? "bg-slate-800 text-cyan-400" : "text-slate-500 hover:text-white"
              )}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === "grid" ? "bg-slate-800 text-cyan-400" : "text-slate-500 hover:text-white"
              )}
            >
              <Grid size={18} />
            </button>
          </div>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
            <Plus size={18} />
            Yeni Cədvəl
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Cədvəl axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:border-cyan-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-400 px-4 py-2.5 rounded-xl hover:text-white transition-colors">
          <Filter size={18} />
          Filtrlər
        </button>
        <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-400 px-4 py-2.5 rounded-xl hover:text-white transition-colors">
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto min-h-0">
        {viewMode === "table" ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-slate-500 font-bold uppercase tracking-widest text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Cədvəl Adı</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Sətir Sayı</th>
                  <th className="px-6 py-4">Ölçü</th>
                  <th className="px-6 py-4">Son Dəyişiklik</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTables.map((table) => (
                  <tr key={table.name} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          table.type === "uploaded" ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400"
                        )}>
                          <Database size={16} />
                        </div>
                        <span className="text-white font-bold tracking-tight">{table.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase leading-none",
                        table.type === "uploaded" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                      )}>
                        {table.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">{table.rows.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono">{table.size}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{table.lastModified}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-600 hover:text-white transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTables.map((table) => (
              <div
                key={table.name}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                    table.type === "uploaded" ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400"
                  )}>
                    <Database size={20} />
                  </div>
                  <button className="p-2 text-slate-600 hover:text-white">
                    <MoreVertical size={16} />
                  </button>
                </div>
                <h3 className="text-white font-bold tracking-tight mb-1 truncate">{table.name}</h3>
                <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-4">{table.type}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <p className="text-[9px] text-slate-600 font-bold uppercase mb-0.5">Rows</p>
                    <p className="text-sm font-mono text-white">{table.rows.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <p className="text-[9px] text-slate-600 font-bold uppercase mb-0.5">Size</p>
                    <p className="text-sm font-mono text-white">{table.size}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-600 font-bold uppercase">Last Sync</span>
                  <span className="text-[10px] text-slate-400 font-medium">{table.lastModified}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
