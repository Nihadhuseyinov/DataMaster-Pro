import { 
  FileText, 
  Download, 
  Mail, 
  Clock, 
  ChevronRight,
  MoreVertical,
  Printer,
  Share2,
  Calendar,
  Send,
  FileCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function ReportsView({ activeDataset }: { activeDataset: any }) {
  const handleAction = (type: string, name: string) => {
    toast.success(`${type}: ${name}`, {
      description: 'Document processing task queued successfully.'
    });
  };

  const reports = [
    { title: 'Q1 Financial Summary', type: 'Annual', date: 'May 12, 2026', status: 'ready', size: '2.4 MB' },
    { title: 'Employee Compensation Audit', type: 'HR', date: 'May 10, 2026', status: 'ready', size: '1.1 MB' },
    { title: 'Cloud Infrastructure Usage', type: 'Ops', date: 'May 05, 2026', status: 'archived', size: '4.8 MB' },
    { title: 'Marketing Attribution Model', type: 'Growth', date: 'Apr 28, 2026', status: 'ready', size: '840 KB' },
  ];

  return (
    <div className="grid grid-cols-12 grid-rows-12 gap-3 h-full min-h-[800px]">
      {/* Reports Header */}
      <div className="bento-card col-span-12 row-span-2 flex-row items-center justify-between px-8">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Reporting Center</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
            {activeDataset ? `Compiling from ${activeDataset.name}` : 'Automated document generation & distribution'}
          </p>
        </div>
        <button 
          onClick={() => handleAction('Schedule Created', 'New Automation')}
          className="px-6 py-2 bg-brand-500 text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/20 active:scale-95"
        >
          Create Schedule
        </button>
      </div>

      {/* Main Reports List */}
      <div className="bento-card col-span-8 row-span-10">
        <div className="card-header-text">
          <span>Recent Generated Reports</span>
        </div>
        <div className="mt-4 space-y-2 flex-1 overflow-y-auto">
          {reports.map((report) => (
            <div key={report.title} className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-brand-500 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-brand-500 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[13px] font-black text-white tracking-tight">{report.title}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{report.type} • {report.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-right mr-4">
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Generated</p>
                    <p className="text-[11px] text-slate-400 font-mono tracking-tight">{report.date}</p>
                 </div>
                 <button 
                  onClick={() => handleAction('Download Started', report.title)}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-brand-500 transition-all"
                 >
                    <Download className="w-4 h-4" />
                 </button>
                 <button 
                  onClick={() => handleAction('Distribution Dispatched', report.title)}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-brand-500 transition-all"
                 >
                    <Send className="w-4 h-4" />
                 </button>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => handleAction('Accessing Archive', 'Document Vault')}
          className="mt-4 w-full py-2.5 bg-slate-800/50 border border-slate-800 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest transition-all"
        >
          View Archived Documents
        </button>
      </div>

      {/* Distribution Timeline */}
      <div className="bento-card col-span-4 row-span-7">
        <div className="card-header-text">
          <span>Upcoming Distribution</span>
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
        </div>
        <div className="mt-4 space-y-6">
           {[
             { time: '08:00', date: 'Tomorrow', label: 'Daily Sales Flash', target: 'Slack #revenue', color: 'bg-brand-500' },
             { time: '09:00', date: 'Monday', label: 'Weekly Payroll', target: 'Email (Finance)', color: 'bg-emerald-500' },
             { time: '10:00', date: 'June 01', label: 'Monthly Board Deck', target: 'Google Drive', color: 'bg-amber-500' },
           ].map((item, i) => (
             <div key={i} className="relative pl-6 border-l border-slate-800">
                <div className={cn("absolute top-0 left-0 w-2 h-2 rounded-full -ml-[4.5px] ring-4 ring-slate-900", item.color)} />
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-tight">{item.label}</p>
                      <p className="text-[9px] text-slate-600 font-bold uppercase mt-0.5">{item.target}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-white font-mono">{item.time}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.date}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bento-card col-span-2 row-span-3">
        <div className="card-header-text"><span>Success</span></div>
        <div className="flex-1 flex flex-col items-center justify-center">
           <FileCheck className="w-8 h-8 text-emerald-500 mb-2" />
           <div className="text-xl font-black text-white">99.2%</div>
           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Delivery</p>
        </div>
      </div>

      <div className="bento-card col-span-2 row-span-3">
        <div className="card-header-text"><span>Active</span></div>
        <div className="flex-1 flex flex-col items-center justify-center">
           <Clock className="w-8 h-8 text-brand-500 mb-2" />
           <div className="text-xl font-black text-white">12</div>
           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Schedules</p>
        </div>
      </div>
    </div>
  );
}
