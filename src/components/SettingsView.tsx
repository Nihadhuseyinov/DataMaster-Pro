import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Key, 
  Bell, 
  User, 
  Moon, 
  Sun,
  Smartphone,
  Globe,
  Database,
  Cloud,
  Mail,
  ChevronRight,
  Fingerprint,
  Zap,
  Palette,
  Eye,
  Lock,
  Brain
} from 'lucide-react';
import { useApp } from '../App';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function SettingsView() {
  const { darkMode, setDarkMode, isAiReady } = useApp();
  const [activeTab, setActiveTab ] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profil', icon: <User size={16} /> },
    { id: 'appearance', label: 'Görünüş', icon: <Palette size={16} /> },
    { id: 'notifs', label: 'Bildirişlər', icon: <Bell size={16} /> },
    { id: 'integrations', label: 'İnteqrasiyalar', icon: <Zap size={16} /> },
    { id: 'security', label: 'Təhlükəsizlik', icon: <Lock size={16} /> },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-950 overflow-y-auto scrollbar-thin">
      <div className="p-8 max-w-5xl mx-auto space-y-12 pb-24">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-500 shadow-2xl">
            <SettingsIcon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Ayarlar</h1>
            <p className="text-slate-400 text-sm mt-1">Platforma və tətbiq ayarlarını idarə edin.</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Nav */}
          <div className="col-span-12 md:col-span-3 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                    : "text-slate-500 hover:text-white hover:bg-slate-900"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="col-span-12 md:col-span-9 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
               {/* Body will change based on tab */}
               {activeTab === 'profile' && (
                 <div className="divide-y divide-slate-800">
                    <div className="p-8 bg-slate-950/30">
                       <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Profil Məlumatları</h3>
                       <div className="flex items-center gap-6 mb-8">
                          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-black italic">A</div>
                          <div className="space-y-2">
                             <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Şəkil dəyiş</button>
                             <p className="text-[10px] text-slate-500 font-bold uppercase">JPG, PNG · max 2MB</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ad Soyad</label>
                            <input type="text" defaultValue="Admin User" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">E-poçt</label>
                            <input type="email" defaultValue="admin@datamasterpro.az" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all" />
                          </div>
                       </div>
                    </div>
                    <div className="p-8 flex justify-between items-center bg-slate-950/10">
                       <div className="space-y-1">
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Görünürlük</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Profilinizi hamı görə bilsin?</p>
                       </div>
                       <button className="w-12 h-6 bg-cyan-500 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                       </button>
                    </div>
                 </div>
               )}

               {activeTab === 'appearance' && (
                 <div className="divide-y divide-slate-800">
                    <div className="p-8">
                       <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Görünüş Parametrləri</h3>
                       <div className="flex items-center justify-between py-4">
                          <div>
                            <div className="text-xs font-black text-white uppercase tracking-tight">Qaranlıq Rejim</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Interfeysi tünd rənglərdə seçin</div>
                          </div>
                          <button 
                            onClick={() => setDarkMode(!darkMode)}
                            className={cn("w-12 h-6 rounded-full relative transition-all", darkMode ? "bg-cyan-500" : "bg-slate-700")}
                          >
                             <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", darkMode ? "right-1" : "left-1")} />
                          </button>
                       </div>
                       <div className="flex items-center justify-between py-4 border-t border-slate-800/50">
                          <div>
                            <div className="text-xs font-black text-white uppercase tracking-tight">Vurğu Rəngi</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Əsas interaktiv rəngi seçin</div>
                          </div>
                          <div className="flex gap-2">
                             {['bg-cyan-500', 'bg-blue-500', 'bg-purple-500', 'bg-emerald-500'].map(c => (
                               <div key={c} className={cn("w-6 h-6 rounded-full cursor-pointer border-2 border-transparent hover:border-white transition-all", c)} />
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'integrations' && (
                 <div className="p-8 space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Xarici İnteqrasiyalar</h3>
                    
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-500">
                             <Brain size={24} />
                          </div>
                          <div>
                             <div className="text-xs font-black text-white uppercase tracking-tight italic">Gemini Pro AI</div>
                             <div className="text-[10px] text-slate-500 font-bold uppercase">Google Generative AI Engine</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                            isAiReady ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                          )}>
                             <div className={cn("w-1.5 h-1.5 rounded-full", isAiReady ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                             {isAiReady ? "AKTİVDİR" : "AÇAR TAPILMADI"}
                          </div>
                          {!isAiReady && (
                            <button 
                             onClick={() => toast.info("Gemini API açarını 'Settings -> Secrets' panelindən GEMINI_API_KEY olaraq əlavə edin.")}
                             className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              Necə qoşum?
                            </button>
                          )}
                       </div>
                    </div>

                    {[
                      { name: 'Gmail', desc: 'admin@gmail.com', status: 'Aktiv', icon: <Mail size={18} /> },
                      { name: 'Google Drive', desc: 'Faylları birbaşa yüklə', status: 'Deaktiv', icon: <Cloud size={18} /> },
                    ].map(int => (
                      <div key={int.name} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                               {int.icon}
                            </div>
                            <div>
                               <div className="text-xs font-black text-white uppercase tracking-tight">{int.name}</div>
                               <div className="text-[10px] text-slate-500 font-bold uppercase">{int.desc}</div>
                            </div>
                         </div>
                         <button className={cn(
                           "px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                           int.status === 'Aktiv' ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-slate-900 text-slate-500 border-slate-800 hover:text-white"
                         )}>
                           {int.status}
                         </button>
                      </div>
                    ))}
                 </div>
               )}

               {activeTab === 'security' && (
                 <div className="p-8 space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Təhlükəsizlik</h3>
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-cyan-500 shadow-lg">
                          <Fingerprint size={24} />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-xs font-black text-white uppercase tracking-tight italic">İki Faktorlu Doğrulama</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 leading-relaxed">Hesabınızı SMS və ya authenticator tətbiqi ilə qoruyun.</p>
                       </div>
                       <button className="px-6 py-2 bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all">Aktiv et</button>
                    </div>
                 </div>
               )}
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => toast.info("Dəyişikliklər ləğv edildi")}
                className="px-8 py-3 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all"
              >
                Geri qaytar
              </button>
              <button 
                onClick={() => {
                  toast.success("Ayarlar yadda saxlandı!");
                }}
                className="px-12 py-3 bg-cyan-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-400 shadow-xl shadow-cyan-500/20 transition-all"
              >
                Yadda saxla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
