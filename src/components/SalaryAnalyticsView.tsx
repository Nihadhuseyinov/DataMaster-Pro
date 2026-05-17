import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
} from 'recharts';
import { 
  Download,
  Search,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { MOCK_EMPLOYEES } from '../lib/mockData';
import { formatCurrency, formatNumber, cn } from '../lib/utils';

import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const COLORS = ['#38bdf8', '#c084fc', '#4ade80', '#fbbf24', '#f43f5e'];

const SALARY_DISTRIBUTION = [
  { range: '$40k-60k', count: 12 },
  { range: '$60k-80k', count: 25 },
  { range: '$80k-100k', count: 42 },
  { range: '$100k-120k', count: 68 },
  { range: '$120k-150k', count: 95 },
  { range: '$150k-200k', count: 48 },
  { range: '$200k+', count: 15 },
];

export default function SalaryAnalyticsView({ activeDataset }: { activeDataset: any }) {
  const { t } = useTranslation();
  
  const handleAction = (name: string) => {
    toast.info(`Analytics Action: ${name}`, {
      description: 'Calculating complex statistics across current dataset buffers.'
    });
  };

  const data = activeDataset?.data || [];
  const headers = activeDataset?.headers || [];

  // Find numeric columns
  const numericCols = headers.filter((h: string) => data.length > 0 && !isNaN(Number(data[0][h])));
  const mainNumericCol = numericCols[0] || '';

  const totalValue = data.reduce((acc: number, curr: any) => acc + (Number(curr[mainNumericCol]) || 0), 0);
  const avgValue = data.length > 0 ? totalValue / data.length : 0;
  const maxValue = data.reduce((acc: number, curr: any) => Math.max(acc, Number(curr[mainNumericCol]) || 0), 0);

  const exportToExcel = () => {
    if (data.length === 0) return toast.error('No data to export');
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DataExport");
    XLSX.writeFile(wb, "DataMaster_Export.xlsx");
    toast.success('Excel Report Generated', {
      description: 'File downloaded: DataMaster_Export.xlsx'
    });
  };

  const stats = [
    { label: mainNumericCol ? `Avg ${mainNumericCol}` : 'Average', value: mainNumericCol ? formatCurrency(avgValue) : '0', change: '+4.2%' },
    { label: mainNumericCol ? `Total ${mainNumericCol}` : 'Total Sum', value: mainNumericCol ? formatNumber(totalValue) : '0', change: '+2.1%' },
    { label: mainNumericCol ? `Max ${mainNumericCol}` : 'Max Peak', value: mainNumericCol ? formatCurrency(maxValue) : '0', change: '+15.4%' },
  ];

  // Top records by main numeric column
  const topRecords = [...data]
    .sort((a, b) => (Number(b[mainNumericCol]) || 0) - (Number(a[mainNumericCol]) || 0))
    .slice(0, 15);

  // Distribution bins
  const binCount = 7;
  const binWidth = maxValue / binCount;
  const distribution = Array.from({ length: binCount }, (_, i) => {
    const min = i * binWidth;
    const max = (i + 1) * binWidth;
    const count = data.filter((d: any) => {
      const val = Number(d[mainNumericCol]) || 0;
      return val >= min && val < max;
    }).length;
    return {
      range: `${formatNumber(min)}-${formatNumber(max)}`,
      count
    };
  });

  return (
    <div className="grid grid-cols-12 grid-rows-12 gap-3 h-full min-h-[800px]">
      {/* Small Stats */}
      {stats.map((stat) => (
        <div key={stat.label} className="bento-card col-span-4 row-span-2">
          <div className="card-header-text">
            <span>{stat.label}</span>
            <span className="text-emerald-500 font-bold">{stat.change}</span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-2xl font-black text-white">{stat.value}</div>
          </div>
        </div>
      ))}

      {/* Salary Distribution */}
      <div className="bento-card col-span-8 row-span-7">
        <div className="card-header-text">
          <span>{mainNumericCol ? `${mainNumericCol} Distribution` : t('Salary Range Distribution')}</span>
          <div className="flex gap-2">
             <button 
              onClick={exportToExcel} 
              className="px-2 py-0.5 bg-brand-500 text-slate-950 text-[9px] font-black rounded uppercase tracking-widest hover:bg-brand-400 transition-all flex items-center gap-1 active:scale-95"
             >
                <Download className="w-2.5 h-2.5" /> {t('EXPORT')}
             </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 pt-4">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={40}>
                  {distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-700 text-[10px] font-black uppercase">No active dataset</div>
          )}
        </div>
      </div>

      {/* Top Earners */}
      <div className="bento-card col-span-4 row-span-12">
        <div className="card-header-text">
          <span>Top {mainNumericCol || 'Value'} Clusters</span>
          <span className="text-amber-500 font-bold uppercase tracking-widest text-[9px]">HR Intel</span>
        </div>
        <div className="space-y-1 mt-2 flex-grow overflow-y-auto">
          <div className="grid grid-cols-12 gap-2 py-2 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
             <div className="col-span-8">Identifier</div>
             <div className="col-span-4">Value</div>
          </div>
          {topRecords.length > 0 ? topRecords.map((item, idx) => {
            const label = String(item[headers[0]] || idx);
            const val = Number(item[mainNumericCol]) || 0;
            return (
              <div 
                key={idx} 
                onClick={() => handleAction(`Focus: ${label}`)}
                className="grid grid-cols-12 gap-2 py-3 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer group"
              >
                 <div className="col-span-8">
                    <div className="text-[11px] font-black text-white tracking-tight truncate">{label}</div>
                 </div>
                 <div className="col-span-4 flex items-center text-[11px] font-mono text-slate-400 group-hover:text-brand-500 transition-colors">
                    {formatNumber(val)}
                 </div>
              </div>
            );
          }) : (
            <div className="py-20 text-center text-[10px] text-slate-700 font-bold uppercase">Ready for Input</div>
          )}
        </div>
        <button 
          onClick={() => handleAction('Full Roster View')}
          className="mt-auto w-full py-2 bg-slate-800 border border-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all active:scale-95"
        >
          {t('View All Records')}
        </button>
      </div>

      {/* Bonus Stats */}
      <div className="bento-card col-span-3 row-span-3">
        <div className="card-header-text"><span>Variance Gap</span></div>
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-emerald-500">0.98</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Minimal Deviance</div>
        </div>
      </div>

      <div className="bento-card col-span-5 row-span-3">
        <div className="card-header-text"><span>Dataset Entropy</span></div>
        <div className="flex-1 flex items-center gap-6">
           <div className="flex-1">
              <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-widest">
                 <span className="text-slate-500">Noise Level</span>
                 <span className="text-emerald-500">Low</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[15%]" />
              </div>
           </div>
           <div className="w-px h-10 bg-slate-800" />
           <div className="text-center">
              <div className="text-xl font-black text-white">2.4%</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase">Outliers</div>
           </div>
        </div>
      </div>
    </div>
  );
}
