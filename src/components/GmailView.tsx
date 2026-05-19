import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Search,
  Star,
  Trash2, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Loader2,
  Inbox,
  Clock,
  AlertCircle,
  X,
  FileText,
  User,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  starred: boolean;
  color: string;
  initials: string;
}

const MOCK_MAILS: Message[] = [
  { id: '1', from: 'Aysel Həsənova', email: 'aysel@company.az', subject: 'Q1 2025 hesabatı hazırdır', preview: 'Salam, birinci rüb üçün bütün məlumatlar sistemə daxil edilib...', time: '10:24', unread: true, starred: false, color: 'bg-cyan-500', initials: 'AH' },
  { id: '2', from: 'DataMaster Pro', email: 'noreply@datamasterpro.az', subject: 'Həftəlik istifadə hesabatı', preview: 'Bu həftə 47 sorğu icra edildi, 3 yeni fayl yükləndi...', time: '09:15', unread: true, starred: true, color: 'bg-blue-500', initials: 'DM' },
  { id: '3', from: 'Murad Əliyev', email: 'murad@analytics.az', subject: 'Yeni data seti göndərirəm', preview: 'Əlavə etdiyim CSV faylında yanvar-mart ayları üçün satış rəqəmləri var...', time: 'Dünən', unread: true, starred: false, color: 'bg-purple-500', initials: 'MƏ' },
  { id: '4', from: 'Leyla Mahmudova', email: 'leyla@corp.az', subject: 'Dashboard dizaynı haqqında', preview: 'Baxdım, çox gözəldir! Bir neçə kiçik dəyişiklik təklif edirəm...', time: 'Dünən', unread: false, starred: true, color: 'bg-emerald-500', initials: 'LM' },
  { id: '5', from: 'Sistem Bildirişi', email: 'system@datamasterpro.az', subject: 'Data sinxronizasiyası tamamlandı', preview: 'Bütün fayllar uğurla sinxronizasiya edildi. Cəmi 1,247 sətir...', time: '17 May', unread: false, starred: false, color: 'bg-amber-500', initials: 'SB' },
  { id: '6', from: 'Rauf İsmayılov', email: 'rauf@startup.az', subject: 'SQL sorğusu problemi', preview: 'WHERE şərti ilə bağlı bir problem yaşayıram, kömək edə bilərsinizmi?', time: '16 May', unread: false, starred: false, color: 'bg-rose-500', initials: 'Rİ' },
];

export default function GmailView() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MAILS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState<Message | null>(null);

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return m.unread;
    if (filter === 'starred') return m.starred;
    return true;
  });

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
  };

  const markRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));
    setSelectedMail(messages.find(m => m.id === id) || null);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-950 overflow-hidden relative">
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">Gmail</h1>
            <div className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-700">
              user@gmail.com
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsComposeOpen(true)}
              className="px-6 py-2 bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-2"
            >
              <Plus size={14} /> Yeni Məktub
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex gap-1">
            {(['all', 'unread', 'starred'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  filter === f ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-slate-500 hover:text-white"
                )}
              >
                {f === 'all' ? 'Hamısı' : f === 'unread' ? 'Oxunmamış' : 'Ulduzlu'}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            {filteredMessages.length} Mesaj tapıldı
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => markRead(msg.id)}
              className={cn(
                "group flex items-start gap-4 px-6 py-4 border-b border-slate-900 hover:bg-slate-900/50 cursor-pointer transition-all",
                msg.unread && "bg-cyan-500/[0.02]"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs", msg.color)}>
                {msg.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("text-sm truncate", msg.unread ? "text-white font-bold" : "text-slate-400")}>
                    {msg.from}
                  </span>
                  <span className="text-[10px] text-slate-600 font-bold uppercase">{msg.time}</span>
                </div>
                <h4 className={cn("text-xs mb-1 truncate", msg.unread ? "text-slate-200 font-bold" : "text-slate-500")}>
                  {msg.subject}
                </h4>
                <p className="text-xs text-slate-600 truncate leading-relaxed">
                  {msg.preview}
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => toggleStar(msg.id, e)}
                  className={cn("transition-colors", msg.starred ? "text-yellow-500 opacity-100" : "text-slate-400")}
                >
                  <Star size={16} fill={msg.starred ? "currentColor" : "none"} />
                </button>
                {msg.unread && <div className="w-2 h-2 bg-cyan-400 rounded-full" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsComposeOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Yeni Məktub</h3>
                <button onClick={() => setIsComposeOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Kimə</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all" placeholder="misal@domin.com" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Mövzu</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all" placeholder="Hesabat haqqında..." />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Məktub</label>
                  <textarea className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all min-h-[160px] resize-none" placeholder="Məktubun mətni..." />
                </div>
              </div>
              <div className="px-8 py-6 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-3">
                <button onClick={() => setIsComposeOpen(false)} className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Ləğv et</button>
                <button 
                  onClick={() => {
                    toast.success("Məktub göndərildi!");
                    setIsComposeOpen(false);
                  }}
                  className="px-8 py-3 bg-cyan-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-2"
                >
                  <Send size={16} /> Göndər
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mail View Modal */}
      <AnimatePresence>
        {selectedMail && (
          <div className="absolute inset-0 z-40 bg-slate-950 flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <button 
                onClick={() => setSelectedMail(null)}
                className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
              >
                <ChevronRight size={14} className="rotate-180" /> Geri qayıt
              </button>
              <div className="flex gap-1">
                <button className="p-2 text-slate-500 hover:text-white transition-colors"><Star size={18} /></button>
                <button className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12">
               <div className="max-w-3xl mx-auto space-y-8">
                  <div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4 leading-tight">
                      {selectedMail.subject}
                    </h2>
                    <div className="flex items-center gap-4">
                       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold", selectedMail.color)}>
                         {selectedMail.initials}
                       </div>
                       <div>
                         <div className="text-sm font-bold text-white uppercase tracking-tight">{selectedMail.from}</div>
                         <div className="text-[10px] text-slate-500 font-bold uppercase">{selectedMail.email}</div>
                       </div>
                    </div>
                  </div>
                  <div className="h-px bg-slate-800" />
                  <div className="text-base text-slate-300 leading-relaxed space-y-4 font-medium">
                    <p>{selectedMail.preview}</p>
                    <p>Bütün detallar faylda qeyd olunub. Zəhmət olmasa yoxlayın və rəy bildirin.</p>
                    <p>Hörmətlə, <br/> {selectedMail.from.split(' ')[0]}</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
