"use client";

import { useState } from "react";
import {
  Database,
  Code2,
  Brain,
  FileText,
  TrendingUp,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
} from "lucide-react";

export default function HomePanel({ activeDataset }: { activeDataset?: any }) {
  const [timeRange, setTimeRange] = useState("7d");

  const stats = [
    {
      label: "Total Datasets",
      value: "24",
      change: "+3",
      changeType: "up",
      period: "this week",
      icon: <Database size={20} />,
      color: "cyan",
    },
    {
      label: "Queries Run",
      value: "1,482",
      change: "+128",
      changeType: "up",
      period: "today",
      icon: <Code2 size={20} />,
      color: "green",
    },
    {
      label: "AI Models",
      value: "12",
      change: "4",
      changeType: "neutral",
      period: "training",
      icon: <Brain size={20} />,
      color: "purple",
    },
    {
      label: "Reports Generated",
      value: "8",
      change: "2",
      changeType: "neutral",
      period: "scheduled",
      icon: <FileText size={20} />,
      color: "orange",
    },
  ];

  const recentActivity = [
    { action: "Dataset uploaded", target: activeDataset?.name || "sales_q2_2024.csv", time: "5 dəq əvvəl", type: "upload" },
    { action: "Query executed", target: "Top Performers Analysis", time: "15 dəq əvvəl", type: "query" },
    { action: "AI Model trained", target: "Churn Prediction v2.1", time: "1 saat əvvəl", type: "ml" },
    { action: "Report generated", target: "Monthly HR Summary", time: "2 saat əvvəl", type: "report" },
    { action: "Data synced", target: "Production DB", time: "3 saat əvvəl", type: "sync" },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-slate-950">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Dashboard Overview</h2>
        <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1">
          {["24h", "7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                timeRange === range ? "bg-cyan-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-slate-800`}
              >
                <div className={`text-${stat.color}-400`}>{stat.icon}</div>
              </div>
              <div
                className={`flex items-center gap-1 text-xs ${
                  stat.changeType === "up"
                    ? "text-green-400"
                    : stat.changeType === "down"
                    ? "text-red-400"
                    : "text-slate-400"
                }`}
              >
                {stat.changeType === "up" && <ArrowUpRight size={14} />}
                {stat.changeType === "down" && <ArrowDownRight size={14} />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-slate-500 text-xs">
              {stat.label} • {stat.period}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Activity Chart */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">Query Activity</h3>
            <Activity size={16} className="text-slate-500" />
          </div>
          <div className="h-48 flex items-end gap-2">
            {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-cyan-500/30 rounded-t hover:bg-cyan-500/50 transition-colors relative group"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {h * 10} queries
                  </div>
                </div>
                <span className="text-slate-500 text-[10px]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Ingestion Chart */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">Data Ingestion (MB)</h3>
            <TrendingUp size={16} className="text-slate-500" />
          </div>
          <div className="h-48 flex items-end gap-2">
            {[30, 55, 40, 75, 60, 85, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-green-500/30 rounded-t hover:bg-green-500/50 transition-colors relative group"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {h * 12} MB
                  </div>
                </div>
                <span className="text-slate-500 text-[10px]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">Recent Activity</h3>
            <Clock size={16} className="text-slate-500" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-800"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === "upload"
                      ? "bg-green-500/20 text-green-400"
                      : activity.type === "query"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : activity.type === "ml"
                      ? "bg-purple-500/20 text-purple-400"
                      : activity.type === "report"
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {activity.type === "upload" && <Database size={14} />}
                  {activity.type === "query" && <Code2 size={14} />}
                  {activity.type === "ml" && <Brain size={14} />}
                  {activity.type === "report" && <FileText size={14} />}
                  {activity.type === "sync" && <Zap size={14} />}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    {activity.action}: <span className="text-cyan-400">{activity.target}</span>
                  </p>
                  <p className="text-slate-500 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "New SQL Query", icon: <Code2 size={16} />, color: "cyan" },
              { label: "Upload Dataset", icon: <Database size={16} />, color: "green" },
              { label: "Train AI Model", icon: <Brain size={16} />, color: "purple" },
              { label: "Generate Report", icon: <FileText size={16} />, color: "orange" },
            ].map((action, i) => (
              <button
                key={i}
                className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors bg-slate-950 hover:bg-slate-800 border border-slate-800 group"
              >
                <div className={`text-${action.color}-400`}>{action.icon}</div>
                <span className="text-slate-300 text-sm">{action.label}</span>
                <ArrowUpRight size={14} className="ml-auto text-slate-600 group-hover:text-white" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
