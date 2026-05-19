import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import { 
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Settings,
  X,
  Upload,
  FileText,
  CheckCircle2,
  Table as TableIcon,
  Cpu,
  RefreshCcw,
  BarChart3
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function IngestionView({ activeDataset, onDatasetChange }: { activeDataset: any, onDatasetChange: (d: any) => void }) {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const cleanData = (data: any[]) => {
    return data.map(row => {
      const newRow = { ...row };
      Object.keys(newRow).forEach(key => {
        let val = newRow[key];
        if (typeof val === 'string') {
          // Trim whitespace
          val = val.trim();
          // Remove leading/trailing quotes if any
          val = val.replace(/^["']|["']$/g, '');
          newRow[key] = val;
        }
      });
      return newRow;
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    toast.loading(`Processing ${file.name}...`, { id: 'upload' });

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setTimeout(() => {
            setIsUploading(false);
            const cleaned = cleanData(results.data);
            onDatasetChange({
              name: file.name,
              rows: cleaned.length,
              cols: results.meta.fields?.length || 0,
              type: 'Structured CSV',
              timestamp: new Date().toLocaleTimeString(),
              data: cleaned,
              headers: results.meta.fields
            });
            toast.success(`${file.name} successfully ingested!`, { 
              id: 'upload',
              description: `${cleaned.length} rows processed, cleaned and indexed.`
            });
          }, 1500);
        },
        error: (error) => {
          setIsUploading(false);
          toast.error(`Error parsing file: ${error.message}`, { id: 'upload' });
        }
      });
    } else {
      setTimeout(() => {
        setIsUploading(false);
        onDatasetChange({
          name: file.name,
          rows: 'N/A',
          cols: 'N/A',
          type: 'Unstructured Document',
          timestamp: new Date().toLocaleTimeString()
        });
        toast.success(`${file.name} successfully ingested!`, { 
          id: 'upload',
          description: 'Document indexed for semantic search.'
        });
      }, 1500);
    }
  }, [onDatasetChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json']
    },
    multiple: false
  } as any);

  const sources = [
    { name: 'AWS S3', type: 'Blob Storage', status: 'connected', icon: 'S3', color: 'text-amber-500' },
    { name: 'PostgreSQL', type: 'Database', status: 'connected', icon: 'PS', color: 'text-brand-500' },
    { name: 'Redis Cache', type: 'Key-Value', status: 'disconnected', icon: 'RD', color: 'text-rose-500' },
    { name: 'BigQuery', type: 'Data Warehouse', status: 'connected', icon: 'BQ', color: 'text-white' },
    { name: 'Snowflake', type: 'Cloud Data', status: 'connected', icon: 'SF', color: 'text-emerald-500' },
  ];

  const pipelines = [
    { id: 'PIPE_1', name: 'ETL_CORE_SYNC', status: 'running', load: '85%', health: '98%' },
    { id: 'PIPE_2', name: 'PAYROLL_INGEST', status: 'paused', load: '0%', health: '100%' },
    { id: 'PIPE_3', name: 'LOG_AGGREGATOR', status: 'warning', load: '42%', health: '64%' },
  ];

  const handleAction = (action: string) => {
    toast.info(`Executing Action: ${action}`, {
      description: 'Request dispatched to backend engine.'
    });
  };

  return (
    <div className="grid grid-cols-12 gap-3 h-full min-h-[800px]">
      {/* Upload Central */}
      <div className="bento-card col-span-12 lg:col-span-4 row-span-6 border-brand-500/30 bg-brand-500/5 transition-all overflow-hidden relative group">
         <AnimatePresence mode="wait">
           {isUploading ? (
             <motion.div 
               key="uploading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="h-full flex flex-col items-center justify-center p-6 text-center"
             >
                <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin mb-6" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">{t('Ingesting Data...')}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{uploadProgress}% {t('Complete')}</p>
                <div className="mt-8 w-full max-w-[200px] h-1 bg-slate-800 rounded-full overflow-hidden">
                   <motion.div className="h-full bg-brand-500" animate={{ width: `${uploadProgress}%` }} />
                </div>
             </motion.div>
           ) : activeDataset ? (
             <motion.div 
               key="success"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="h-full flex flex-col p-6"
             >
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-xs font-black text-white uppercase tracking-tight truncate max-w-[150px]">{activeDataset.name}</h3>
                         <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Successfully Ingested</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => onDatasetChange(null)}
                     className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                   >
                      <RefreshCcw className="w-4 h-4" />
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6">
                   <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Rows Index</p>
                      <p className="text-lg font-black text-white">{activeDataset.rows}</p>
                   </div>
                   <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Columns</p>
                      <p className="text-lg font-black text-white">{activeDataset.cols}</p>
                   </div>
                </div>

                <div className="space-y-4 mb-auto">
                   <div className="flex items-center gap-3 text-slate-400">
                      <Zap className="w-4 h-4 text-brand-500" />
                      <span className="text-[10px] font-bold uppercase">{activeDataset.type}</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-400">
                      <BarChart3 className="w-4 h-4 text-brand-500" />
                      <span className="text-[10px] font-bold uppercase">Profiling Finished</span>
                   </div>
                </div>

                <div className="flex flex-col gap-2 mt-6">
                   <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-500 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-400 transition-all">
                      Open in Workspace <TableIcon className="w-3 h-3" />
                   </button>
                   <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">
                      Train AutoML Model <Cpu className="w-3 h-3" />
                   </button>
                </div>
             </motion.div>
           ) : (
             <div 
               key="idle"
               {...getRootProps()} 
               className={cn(
                 "w-full h-full border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer text-center",
                 isDragActive ? "border-brand-500 bg-brand-500/10" : "border-slate-800 hover:border-brand-500 group-hover:bg-slate-900/50"
               )}
             >
               <input {...getInputProps()} />
               <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-brand-500" />
               </div>
               <h3 className="text-sm font-black text-white uppercase tracking-tight mb-2">{t('Upload Company Data')}</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed max-w-[200px]">
                 {t('Drag and drop CSV')}
               </p>
               <div className="mt-6 flex gap-2">
                  <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-[8px] font-mono text-slate-400">CSV</span>
                  <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-[8px] font-mono text-slate-400">XLSX</span>
                  <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-[8px] font-mono text-slate-400">JSON</span>
               </div>
             </div>
           )}
         </AnimatePresence>
      </div>

      {/* Active Sources */}
      <div className="bento-card col-span-12 lg:col-span-8 row-span-6">
        <div className="card-header-text">
          <span>{t('Active Data Sources')}</span>
          <button 
            onClick={() => handleAction('Connect New Source')}
            className="px-3 py-1 bg-brand-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded hover:bg-brand-400 transition-all"
          >
            Connect Integration
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sources.map((source) => (
            <div 
              key={source.name} 
              onClick={() => handleAction(`Configure ${source.name}`)}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-4 group hover:border-brand-500/50 transition-all cursor-pointer"
            >
              <div className={cn("w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center font-black text-xs border border-slate-800 group-hover:scale-110 transition-transform", source.color)}>
                {source.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-white uppercase tracking-tight">{source.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{source.type}</p>
              </div>
              <div className={cn(
                "w-2 h-2 rounded-full",
                source.status === 'connected' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-700"
              )} />
            </div>
          ))}
          <div 
            onClick={() => handleAction('Register Custom Source')}
            className="p-4 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 hover:text-brand-500 hover:border-brand-500 transition-all cursor-pointer"
          >
             <Plus className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Connection Stats */}
      <div className="bento-card col-span-12 lg:col-span-4 row-span-4">
        <div className="card-header-text"><span>Transmission Stats</span></div>
        <div className="flex-1 flex flex-col justify-center space-y-8">
           <div>
              <div className="flex justify-between items-end mb-2">
                 <span className="text-[10px] font-bold text-slate-500 uppercase">Ingestion Rate</span>
                 <span className="text-white font-mono text-xl">428.5<span className="text-slate-500 text-sm ml-1 italic">MB/s</span></span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-brand-500 w-[72%] shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
              </div>
           </div>
           <div>
              <div className="flex justify-between items-end mb-2">
                 <span className="text-[10px] font-bold text-slate-500 uppercase">Daily Volume</span>
                 <span className="text-white font-mono text-xl">12.4<span className="text-slate-500 text-sm ml-1 italic">TB</span></span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[58%] shadow-[0_0_12px_rgba(74,222,128,0.5)]" />
              </div>
           </div>
        </div>
      </div>

      {/* Pipelines */}
      <div className="bento-card col-span-12 lg:col-span-8 row-span-4">
        <div className="card-header-text"><span>{t('Transformation Pipeline')}</span></div>
        <div className="flex-1 overflow-x-auto min-h-0">
          <table className="w-full text-left text-[11px]">
            <thead className="sticky top-0 bg-slate-900 text-slate-500 font-bold uppercase tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Pipeline ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Throughput</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {pipelines.map((pipe) => (
                <tr key={pipe.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-brand-500">{pipe.id}</td>
                  <td className="px-6 py-4 font-black uppercase text-white tracking-tight">{pipe.name}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border",
                      pipe.status === 'running' ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5" :
                      pipe.status === 'warning' ? "border-amber-500/30 text-amber-500 bg-amber-500/5" :
                      "border-slate-700 text-slate-500 bg-slate-800/5"
                    )}>
                      {pipe.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-brand-500" style={{ width: pipe.load }} />
                        </div>
                        <span className="text-slate-400 font-mono">{pipe.load}</span>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
