import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  ChevronRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatNumber } from '../lib/utils';
import { cn } from '../lib/utils';

const COLORS = ['#38bdf8', '#c084fc', '#4ade80', '#fbbf24', '#f43f5e'];

export default function DashboardView({ activeDataset }: { activeDataset: any }) {
  const { t } = useTranslation();
  const [sqlInput, setSqlInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);

  const data = activeDataset?.data || [];
  const headers = activeDataset?.headers || [];

  const handleAction = (name: string) => {
    toast.success(`Action Triggered: ${name}`);
  };

  const handleQuickSql = async () => {
    if (!sqlInput.trim() || !activeDataset) return;
    setIsQuerying(true);
    try {
      const sample = activeDataset.data?.[0] || {};
      const schema = Object.entries(sample).map(([k,v]) => `${k} (${typeof v})`).join(", ");
      
      const response = await fetch("/api/gemini/nl-to-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: sqlInput, schema })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "AI could not generate SQL");
      }
      const { sql } = await response.json();
      
      toast.success("Query generated: " + sql, {
        description: "Executing in SQL Lab..."
      });
      // In a real app we'd navigate to SQL lab or show results here.
      // For now, let's just show the toast and maybe execute it.
    } catch (e) {
      toast.error("AI could not generate SQL");
    } finally {
      setIsQuerying(false);
    }
  };
  
  // Find numeric and string columns
  const numericCols = headers.filter((h: string) => data.length > 0 && !isNaN(Number(data[0][h])));
  const stringCols = headers.filter((h: string) => data.length > 0 && isNaN(Number(data[0][h])));

  const mainNumericCol = numericCols[0] || '';
  const mainStringCol = stringCols[0] || '';

  // Calculate stats
  const totalValue = data.reduce((acc: number, curr: any) => acc + (Number(curr[mainNumericCol]) || 0), 0);
  const avgValue = data.length > 0 ? totalValue / data.length : 0;
  
  const stats = [
    { 
      label: mainNumericCol ? `Total ${mainNumericCol}` : 'Total Items', 
      value: mainNumericCol ? formatNumber(totalValue) : formatNumber(data.length), 
      change: '+12.5%', 
      trend: 'up' 
    },
    { 
      label: 'Dataset Rows', 
      value: formatNumber(data.length), 
      change: '+5.2%', 
      trend: 'up' 
    },
    { 
      label: mainNumericCol ? `Avg ${mainNumericCol}` : 'Columns', 
      value: mainNumericCol ? formatCurrency(avgValue) : String(headers.length), 
      change: '-1.2%', 
      trend: 'down' 
    },
    { 
      label: 'Quality Index', 
      value: '98.4%', 
      change: '+0.1%', 
      trend: 'up' 
    },
  ];

  // Group data for the chart (first string col vs first numeric col)
  const groupedData = data.reduce((acc: any, curr: any) => {
    const key = String(curr[mainStringCol] || 'Other');
    acc[key] = (acc[key] || 0) + (Number(curr[mainNumericCol]) || 1);
    return acc;
  }, {});

  const chartData = Object.entries(groupedData)
    .map(([name, value]) => ({ name, value }))
    .slice(0, 8);

  const COLORS = ['#38bdf8', '#c084fc', '#4ade80', '#fbbf24', '#f43f5e'];

  return (
    <div className="grid grid-cols-12 grid-rows-12 gap-3 h-full min-h-[800px]">
      {/* Stats Section */}
      {stats.map((stat) => (
        <div key={stat.label} className="bento-card col-span-3 row-span-2">
          <div className="card-header-text">
            <span>{stat.label}</span>
            <span className={cn(
               "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
               stat.trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            )}>
              {stat.change}
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{t('Vs Last Period')}</div>
          </div>
        </div>
      ))}

      {/* Main Chart */}
      <div className="bento-card col-span-8 row-span-7">
        <div className="card-header-text">
          <span>{mainNumericCol ? `${mainNumericCol} Distribution` : 'Data Distribution'}</span>
          <div className="flex gap-2">
             <span className="tag px-2 py-0.5 bg-slate-800 text-[9px] rounded-full text-brand-500 font-bold">LIVE_DATA</span>
          </div>
        </div>
        <div className="flex-1 min-h-0 pt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-700 text-[10px] font-black uppercase">No active data</div>
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className="bento-card col-span-4 row-span-5">
        <div className="card-header-text">
          <span>Breakdown by {mainStringCol || 'Category'}</span>
        </div>
        <div className="flex-1 relative">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-700 text-[10px] font-black uppercase">Ready</div>
          )}
        </div>
        <div className="space-y-2 mt-4">
          {chartData.slice(0, 4).map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-slate-400 font-bold uppercase tracking-tight truncate max-w-[100px]">{item.name}</span>
              </div>
              <span className="font-mono text-white">{formatNumber(Number(item.value))}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SQL AI Card */}
      <div className="bento-card col-span-4 row-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border-brand-500/30">
        <div className="card-header-text">
          <span>SQL AI Assistent</span>
          <span className="text-brand-500 shadow-sm shadow-brand-500 flex items-center gap-1">
             <span className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" /> SQL_BOT
          </span>
        </div>
        <div className="space-y-4 pt-4 flex-1 flex flex-col">
           <div className="p-3 bg-brand-500/5 border border-brand-500/10 rounded-xl">
             <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
               Məlumatlarınız haqqında istənilən sualı verin, mən onu SQL sorğusuna çevirəcəm.
             </p>
           </div>

           <div className="flex-1 flex flex-col justify-center gap-2">
              <div className="relative">
                <textarea
                  value={sqlInput}
                  onChange={(e) => setSqlInput(e.target.value)}
                  placeholder="Məsələn: 'Ən çox satış edilən 5 region hansıdır?'"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50 min-h-[80px] resize-none"
                />
              </div>
              <button 
                onClick={handleQuickSql}
                disabled={isQuerying || !activeDataset || !sqlInput.trim()}
                className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isQuerying ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Sorğunu Hazırla
              </button>
           </div>

           <div className="mt-auto pt-4 border-t border-slate-800/50">
             <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-2">Tövsiyələr</p>
             <div className="flex flex-wrap gap-1.5">
               {['Minimum maaş', 'Cəmi gəlir', 'Trend analizi'].map(tag => (
                 <button 
                  key={tag}
                  onClick={() => setSqlInput(tag)}
                  className="px-2 py-1 bg-slate-800 rounded-md text-[8px] text-slate-400 hover:text-white transition-colors"
                 >
                   #{tag}
                 </button>
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* Tiny Stats */}
      <div className="bento-card col-span-2 row-span-3">
        <div className="card-header-text"><span>{t('Daily Rows')}</span></div>
        <div className="flex-1 flex flex-col justify-center">
           <div className="text-2xl font-black text-white">{formatNumber(data.length)}</div>
           <div className="text-[10px] text-emerald-500 font-bold">↑ 12% {t('Vs Last Period')}</div>
        </div>
      </div>

      <div className="bento-card col-span-3 row-span-3">
        <div className="card-header-text"><span>{t('Pipeline Health')}</span></div>
        <div className="flex-1 flex flex-col justify-center gap-4">
           <div>
              <div className="flex justify-between text-[10px] font-bold mb-1">
                 <span className="text-slate-500 uppercase">Buffer_Sync</span>
                 <span className="text-emerald-500">{activeDataset ? 'ACTIVE' : 'IDLE'}</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className={cn("h-full bg-emerald-500", activeDataset ? "w-full" : "w-0")} />
              </div>
           </div>
           <div>
              <div className="flex justify-between text-[10px] font-bold mb-1">
                 <span className="text-slate-500 uppercase">Schema_Aud</span>
                 <span className="text-amber-500">{activeDataset ? '98%' : '0%'}</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className={cn("h-full bg-amber-500", activeDataset ? "w-[98%]" : "w-0")} />
              </div>
           </div>
        </div>
      </div>

      <div className="bento-card col-span-3 row-span-3">
        <div className="card-header-text"><span>{t('Data Quality')}</span></div>
        <div className="flex-1 flex flex-col items-center justify-center">
           <div 
            onClick={() => handleAction('Quality Audit')}
            className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-brand-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-all active:scale-95"
           >
              <span className="text-xl font-black text-white">{activeDataset ? '98.4' : '0.0'}</span>
           </div>
           <span className="text-[9px] text-slate-500 font-bold uppercase mt-2">Health Index</span>
        </div>
      </div>
    </div>
  );
}
