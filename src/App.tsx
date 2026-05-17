import { useState, createContext, useContext, useEffect } from "react";
import {
  Database,
  FileUp,
  Brain,
  Settings,
  Home,
  Menu,
  Bell,
  Search,
  User,
  Moon,
  Sun,
  Code2,
  Table2,
  DollarSign,
  Bot,
  FileText,
  X,
  Sparkles,
  Terminal,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";
import { cn } from "./lib/utils";
import { View } from "./types";

// Views
import HomePanel from "./components/HomePanel";
import IngestionView from "./components/IngestionView";
import SqlLabView from "./components/SqlLabView";
import PythonExpertView from "./components/PythonExpertView";
import GmailAutomationView from "./components/GmailAutomationView";
import WorkspaceView from "./components/WorkspaceView";
import SalaryAnalyticsView from "./components/SalaryAnalyticsView";
import AutoMLView from "./components/AutoMLView";
import ReportsView from "./components/ReportsView";
import SettingsView from "./components/SettingsView";

// ===== GLOBAL CONTEXT =====
interface AppContextType {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  currentView: View;
  setCurrentView: (v: View) => void;
  notifications: Notification[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "SQL Query Completed", message: "Top Salaries query finished in 1.2s", time: "2 dəq əvvəl", read: false },
  { id: "2", title: "Report Generated", message: "Monthly HR Summary is ready", time: "15 dəq əvvəl", read: false },
  { id: "3", title: "AI Model Trained", message: "Churn prediction: 96.5% accuracy", time: "1 saat əvvəl", read: true },
  { id: "4", title: "Data Uploaded", message: "sales_q2_2024.csv imported", time: "2 saat əvvəl", read: true },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<View>("upload");
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  const [activeDataset, setActiveDataset] = useState<any>(null);

  const [isAiReady, setIsAiReady] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch("/api/health");
        const data = await response.json();
        setIsAiReady(data.geminiKeySet);
        if (!data.geminiKeySet) {
          toast.warning("AI features require a Gemini API Key. Please add it in the Settings panel (Secrets).", {
            duration: 10000,
          });
        }
      } catch (err) {
        console.error("Health check failed", err);
      }
    };
    checkHealth();
  }, []);

  const renderView = () => {
    switch (currentView) {
      case "upload": return <IngestionView activeDataset={activeDataset} onDatasetChange={setActiveDataset} />;
      case "sql": return <SqlLabView activeDataset={activeDataset} />;
      case "python": return <PythonExpertView activeDataset={activeDataset} isAiReady={isAiReady} />;
      case "gmail": return <GmailAutomationView activeDataset={activeDataset} />;
      case "settings": return <SettingsView />;
      default: return <IngestionView activeDataset={activeDataset} onDatasetChange={setActiveDataset} />;
    }
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
        sidebarOpen,
        setSidebarOpen,
        currentView,
        setCurrentView,
        notifications,
      }}
    >
      <div className={`min-h-screen ${darkMode ? "bg-slate-950" : "bg-slate-50"} transition-colors text-slate-100`}>
        <Toaster position="top-right" theme="dark" richColors />
        <Sidebar />
        <TopBar />
        <main
          className={cn(
            "pt-16 transition-all duration-300 min-h-screen",
            sidebarOpen ? "ml-64" : "ml-16"
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </AppContext.Provider>
  );
}

function Sidebar() {
  const { sidebarOpen, currentView, setCurrentView } = useApp();

  const menuItems = [
    { icon: <FileUp size={20} />, label: "Məlumat Yükləmə", id: "upload" as View },
    { icon: <Terminal size={20} />, label: "Python Expert", id: "python" as View },
    { icon: <Mail size={20} />, label: "Gmail Automation", id: "gmail" as View },
    { icon: <Code2 size={20} />, label: "SQL Laboratoriya", id: "sql" as View },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 z-40",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="h-16 flex items-center px-4 border-b border-slate-800">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <Database size={18} className="text-white" />
        </div>
        {sidebarOpen && (
          <span className="ml-3 font-bold text-white text-sm tracking-wider">
            DATAMASTER<span className="text-cyan-400">PRO</span>
          </span>
        )}
      </div>

      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-left",
                isActive
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              {item.icon}
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-slate-800">
        <button
          onClick={() => setCurrentView("settings")}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all w-full",
            !sidebarOpen && "justify-center"
          )}
        >
          <Settings size={20} />
          {sidebarOpen && <span className="text-sm font-medium">Ayarlar</span>}
        </button>
      </div>
    </aside>
  );
}

function TopBar() {
  const { sidebarOpen, setSidebarOpen, darkMode, setDarkMode, notifications } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-30 transition-all duration-300",
        sidebarOpen ? "left-64" : "left-16"
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm">
          <span className="font-medium text-slate-400">WORKSPACE:</span>
          <span className="text-cyan-400 font-bold">GLOBAL OPERATIONS</span>
          <span className="mx-2">|</span>
          <span className="text-xs uppercase font-bold tracking-widest">Last Sync: 2 mins ago</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Axtar..."
            className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder-slate-600 focus:border-cyan-500 outline-none w-32 md:w-48 transition-all"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                <span className="text-white font-bold text-sm uppercase tracking-widest">Bildirişlər</span>
                <button onClick={() => setNotifOpen(false)} className="text-slate-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "p-3 border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors",
                      !n.read && "bg-cyan-500/5"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 shrink-0" />}
                      <div>
                        <p className="text-white text-sm font-medium">{n.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{n.message}</p>
                        <p className="text-slate-600 text-[10px] mt-1 font-bold uppercase">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border border-slate-700/50">
          <User size={16} className="text-white" />
        </div>
      </div>
    </header>
  );
}
