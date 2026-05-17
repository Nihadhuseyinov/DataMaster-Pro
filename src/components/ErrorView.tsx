"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorView({ 
  error, 
  reset 
}: { 
  error?: Error; 
  reset?: () => void 
}) {
  return (
    <div className="h-full flex items-center justify-center p-6 bg-slate-950">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Something Went Wrong</h1>
        <p className="text-slate-500 mb-6">
          We apologize for the inconvenience. Our team has been notified.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset || (() => window.location.reload())}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all"
          >
            <Home size={18} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
