import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface AutomationTask {
  id: string;
  name: string;
  recipient: string;
  frequency: string;
  status: 'active' | 'paused' | 'failed';
  lastRun: string;
}

export default function GmailAutomationView({ activeDataset }: { activeDataset: any }) {
  const [tasks, setTasks] = useState<AutomationTask[]>([
    { id: '1', name: 'Həftəlik Satış Hesabatı', recipient: 'manager@company.com', frequency: 'Hər Bazar ertəsi', status: 'active', lastRun: '15 May, 09:00' },
    { id: '2', name: 'Gündəlik Stok Xəbərdarlığı', recipient: 'warehouse@company.com', frequency: 'Hər gün, 18:00', status: 'paused', lastRun: '16 May, 18:00' }
  ]);
  const [isSending, setIsSending] = useState(false);
  const [recipient, setRecipient] = useState('');

  const sendTestEmail = async () => {
    if (!activeDataset) {
      toast.error("Məlumat tapılmadı.");
      return;
    }
    if (!recipient.includes('@')) {
      toast.error("Düzgün email daxil edin.");
      return;
    }

    setIsSending(true);
    // Simulated sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSending(false);
    toast.success(`Hesabat ${recipient} ünvanına göndərildi.`);
    setRecipient('');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Gmail Avtomatlaşdırma</h1>
          <p className="text-slate-400 mt-1">Hesabatları avtomatik email olaraq göndərin və paylaşın.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Google OAuth Aktivdir</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Quick Send */}
        <div className="col-span-12 lg:col-span-12 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Mail size={20} className="text-brand-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Sürətli Hesabat Göndər</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Cari məlumatları PDF/Excel olaraq email lə göndərin</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input 
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="resepient@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
               <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none">
                 <option>PDF Hesabat</option>
                 <option>CSV Faylı</option>
                 <option>Excel (xlsx)</option>
               </select>
               <button 
                onClick={sendTestEmail}
                disabled={isSending || !activeDataset}
                className="px-8 py-3 bg-brand-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-400 transition-all flex items-center gap-2"
               >
                 {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                 Göndər
               </button>
            </div>
          </div>
        </div>

        {/* Automation List */}
        <div className="col-span-12 space-y-4">
           <div className="flex items-center justify-between px-2">
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Aktiv Avtomatlaşdırmalar</h3>
             <button className="text-[10px] font-black text-brand-500 uppercase tracking-widest flex items-center gap-1 hover:underline">
               <Plus size={14} /> Yeni yarat
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {tasks.map(task => (
               <div key={task.id} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-brand-500 transition-all group">
                 <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                        task.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-800 text-slate-500"
                      )}>
                        <Zap size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{task.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{task.recipient}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="p-2 text-slate-600 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>

                 <div className="space-y-3">
                   <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} /> Tezlik
                      </span>
                      <span className="text-white font-black">{task.frequency}</span>
                   </div>
                   <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={12} /> Sonuncu İcra
                      </span>
                      <span className="text-emerald-500 font-black">{task.lastRun}</span>
                   </div>
                 </div>

                 <button className="w-full mt-6 py-3 bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-brand-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Konfiqurasiya Et
                 </button>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
