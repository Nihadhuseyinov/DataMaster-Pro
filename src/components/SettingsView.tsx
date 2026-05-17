import React from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Key, 
  Bell, 
  User, 
  Moon, 
  Smartphone,
  Globe,
  Database,
  Cloud
} from 'lucide-react';
import { useApp } from '../App';

export default function SettingsView() {
  const { darkMode, setDarkMode } = useApp();

  const sections = [
    {
      title: "Hesab və Təhlükəsizlik",
      icon: <User size={18} />,
      items: [
        { label: "Profil Məlumatları", value: "İstifadəçi: Nihad", action: "Dəyiş" },
        { label: "API Açarları (Secrets)", value: "Gemini / OpenAI / Google", action: "İdarə et" },
      ]
    },
    {
      title: "Görünüş",
      icon: <Moon size={18} />,
      items: [
        { label: "Qaranlıq Rejim", value: darkMode ? "Aktiv" : "Deaktiv", toggle: true, checked: darkMode, onToggle: () => setDarkMode(!darkMode) },
        { label: "Dil", value: "Azərbaycan", action: "Dəyiş" },
      ]
    },
    {
      title: "Sistem",
      icon: <Database size={18} />,
      items: [
        { label: "Məlumat Bazası", value: "Alasql (In-memory)", status: "connected" },
        { label: "AI Model", value: "Gemini 1.5 Flash", status: "online" },
      ]
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Ayarlar</h1>
          <p className="text-slate-400 text-sm">Platforma və tətbiq ayarlarını idarə edin.</p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/30 flex items-center gap-3">
              <div className="text-brand-500">{section.icon}</div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest">{section.title}</h3>
            </div>
            <div className="p-2">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-4 hover:bg-slate-800/30 rounded-2xl transition-all">
                  <div className="text-sm font-medium text-slate-300">{item.label}</div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 font-bold uppercase">{item.value}</span>
                    {item.toggle ? (
                      <button 
                        onClick={item.onToggle}
                        className={`w-10 h-5 rounded-full transition-all relative ${item.checked ? 'bg-brand-500' : 'bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.checked ? 'left-6' : 'left-1'}`} />
                      </button>
                    ) : item.action ? (
                      <button className="text-[10px] font-black text-brand-500 hover:text-white uppercase tracking-widest px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-md transition-all">
                        {item.action}
                      </button>
                    ) : item.status ? (
                      <div className="flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-bold text-emerald-500 uppercase">{item.status}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-3xl flex items-center justify-between">
         <div>
            <h4 className="text-sm font-bold text-rose-500">Məlumatları Təmizlə</h4>
            <p className="text-xs text-slate-500 mt-1">Bütün lokal keş və yüklənmiş datasetləri silin.</p>
         </div>
         <button className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all">
            Format Et
         </button>
      </div>
    </div>
  );
}
