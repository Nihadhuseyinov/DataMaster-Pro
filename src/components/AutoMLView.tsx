"use client";

import { useState } from "react";
import {
  Brain,
  CheckCircle,
  XCircle,
  Loader2,
  Settings,
  Download,
  Eye,
  Trophy,
  Zap,
  ChevronRight,
  ChevronDown,
  Layers,
  Play,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface ModelResult {
  name: string;
  accuracy: number;
  f1Score: number;
  precision: number;
  recall: number;
  trainingTime: string;
  status: "training" | "completed" | "failed";
  features: string[];
}

const MOCK_MODELS: ModelResult[] = [
  { name: "Random Forest", accuracy: 89.4, f1Score: 88.1, precision: 87.5, recall: 88.7, trainingTime: "2.3s", status: "completed", features: ["salary", "experience", "department", "performance"] },
  { name: "XGBoost", accuracy: 92.1, f1Score: 91.3, precision: 90.8, recall: 91.8, trainingTime: "3.1s", status: "completed", features: ["salary", "experience", "department", "performance", "age"] },
  { name: "LightGBM", accuracy: 91.7, f1Score: 90.9, precision: 90.2, recall: 91.6, trainingTime: "1.8s", status: "completed", features: ["salary", "experience", "department", "performance", "education"] },
  { name: "Neural Network", accuracy: 88.3, f1Score: 87.2, precision: 86.5, recall: 87.9, trainingTime: "12.5s", status: "completed", features: ["all features"] },
  { name: "SVM", accuracy: 85.6, f1Score: 84.8, precision: 84.1, recall: 85.5, trainingTime: "4.2s", status: "completed", features: ["salary", "experience", "performance"] },
  { name: "Logistic Regression", accuracy: 82.1, f1Score: 81.3, precision: 80.8, recall: 81.8, trainingTime: "1.1s", status: "completed", features: ["salary", "experience"] },
];

const TRAINING_HISTORY = [
  { epoch: 1, loss: 0.85, valLoss: 0.82, accuracy: 72 },
  { epoch: 5, loss: 0.62, valLoss: 0.58, accuracy: 78 },
  { epoch: 10, loss: 0.45, valLoss: 0.42, accuracy: 84 },
  { epoch: 15, loss: 0.32, valLoss: 0.30, accuracy: 88 },
  { epoch: 20, loss: 0.25, valLoss: 0.24, accuracy: 91 },
  { epoch: 25, loss: 0.20, valLoss: 0.21, accuracy: 92 },
  { epoch: 30, loss: 0.18, valLoss: 0.19, accuracy: 92.1 },
];

const FEATURE_IMPORTANCE = [
  { name: "salary", importance: 0.35 },
  { name: "experience", importance: 0.28 },
  { name: "performance", importance: 0.18 },
  { name: "department", importance: 0.12 },
  { name: "age", importance: 0.05 },
  { name: "education", importance: 0.02 },
];

export default function AutoMLView({ activeDataset }: { activeDataset?: any }) {
  const [activeStep, setActiveStep] = useState(1);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState<ModelResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setShowResults(false);
    
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setShowResults(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 800);
  };

  const steps = [
    { id: 1, title: "Dataset Seçimi", desc: "Hədəf dəyişən və xüsusiyyətləri seçin" },
    { id: 2, title: "AutoML Konfiqurasiya", desc: "Model və hiperparametrləri seçin" },
    { id: 3, title: "Təlim", desc: "Modelləri təlim edin və müqayisə edin" },
    { id: 4, title: "Deploy", desc: "Ən yaxşı modeli istifadəyə verin" },
  ];

  return (
    <div className="p-6 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain size={28} className="text-purple-400" />
            Avto-ML Platforması
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kodsuz maşın öyrənmə - datasetdən deploy-a qədər</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all flex-1 ${
                activeStep === step.id
                  ? "bg-purple-500/20 border border-purple-500/50 text-purple-400"
                  : activeStep > step.id
                  ? "bg-green-500/10 border border-green-500/30 text-green-400"
                  : "bg-gray-800/50 border border-gray-700 text-gray-500"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  activeStep > step.id
                    ? "bg-green-500 text-white"
                    : activeStep === step.id
                    ? "bg-purple-500 text-white"
                    : "bg-gray-700 text-gray-500"
                }`}
              >
                {activeStep > step.id ? <CheckCircle size={16} /> : step.id}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">{step.title}</p>
                <p className="text-[10px] opacity-70">{step.desc}</p>
              </div>
            </button>
            {i < steps.length - 1 && <ChevronRight size={16} className="text-gray-600" />}
          </div>
        ))}
      </div>

      {/* STEP 1: Dataset Selection */}
      {activeStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">Dataset Seçimi</h3>
              <div className="space-y-2">
                {[activeDataset?.name || "employees.csv", "sales_2024.parquet", "customer_churn.json", "marketing_campaign.xlsx"].map((ds, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    i === 0 ? "bg-purple-500/10 border border-purple-500/30" : "hover:bg-gray-800"
                  }`}>
                    <Layers size={16} className={i === 0 ? "text-purple-400" : "text-gray-500"} />
                    <div className="flex-1">
                      <p className="text-white text-sm">{ds}</p>
                      <p className="text-gray-500 text-xs">{activeDataset?.data?.length || [1250, 50000, 12000, 3200][i]} rows</p>
                    </div>
                    {i === 0 && <CheckCircle size={16} className="text-purple-400" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">Hədəf Dəyişən</h3>
              <div className="space-y-2">
                {[
                  { name: "attrition", type: "classification", desc: "İşçi çıxışını proqnozlaşdır" },
                  { name: "salary", type: "regression", desc: "Maaş proqnozu" },
                  { name: "performance", type: "regression", desc: "Performans skoru" },
                ].map((target, i) => (
                  <div key={i} className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    i === 0 ? "bg-purple-500/10 border border-purple-500/30" : "hover:bg-gray-800 border border-transparent"
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-medium">{target.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${
                        target.type === "classification" ? "bg-cyan-500/20 text-cyan-400" : "bg-green-500/20 text-green-400"
                      }`}>
                        {target.type}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">{target.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <h3 className="text-white font-bold text-sm mb-4">Xüsusiyyət Seçimi</h3>
            <div className="grid grid-cols-4 gap-3">
              {["salary", "experience", "age", "department", "performance", "education", "gender", "location"].map((feat, i) => (
                <label key={i} className="flex items-center gap-2 p-2 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <input type="checkbox" defaultChecked={i < 6} className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500" />
                  <span className="text-gray-300 text-sm">{feat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveStep(2)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              Davam Et <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Configuration */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">Model Seçimi</h3>
              <div className="space-y-2">
                {["Random Forest", "XGBoost", "LightGBM", "Neural Network", "SVM", "Logistic Regression"].map((model, i) => (
                  <label key={i} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-600 text-purple-500" />
                    <span className="text-gray-300 text-sm">{model}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">Hiperparametrlər</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Cross-Validation Folds</label>
                  <select className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                    <option>5-fold</option>
                    <option>10-fold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Train/Test Split</label>
                  <select className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                    <option>80/20</option>
                    <option>70/30</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Max Training Time</label>
                  <select className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                    <option>5 minutes</option>
                    <option>15 minutes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">Metriklər</h3>
              <div className="space-y-2">
                {["Accuracy", "F1-Score", "Precision", "Recall", "AUC-ROC", "Log Loss"].map((metric, i) => (
                  <label key={i} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                    <input type="checkbox" defaultChecked={i < 4} className="w-4 h-4 rounded border-gray-600 text-purple-500" />
                    <span className="text-gray-300 text-sm">{metric}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setActiveStep(1)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Geri
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              Təlimə Başla <Zap size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Training */}
      {activeStep === 3 && (
        <div className="space-y-6">
          {!isTraining && !showResults && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play size={32} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Təlimə Hazırsınız?</h3>
              <p className="text-gray-500 mb-6">6 model təlim ediləcək, ən yaxşısı avtomatik seçiləcək</p>
              <button
                onClick={startTraining}
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 mx-auto"
              >
                <Zap size={18} />
                Təlimə Başla
              </button>
            </div>
          )}

          {isTraining && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Təlim Gedir...</h3>
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="text-purple-400 animate-spin" />
                    <span className="text-purple-400 text-sm">{Math.round(trainingProgress)}%</span>
                  </div>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
                    style={{ width: `${trainingProgress}%` }}
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Model {Math.ceil(trainingProgress / 20)} of 6 training... (XGBoost)
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
                <h3 className="text-white font-bold text-sm mb-4">Real-time Loss</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={TRAINING_HISTORY.slice(0, Math.ceil(trainingProgress / 5) + 1)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="epoch" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="valLoss" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {showResults && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trophy size={24} className="text-yellow-400" />
                  Təlim Nəticələri
                </h3>
                <button
                  onClick={() => setActiveStep(4)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Deploy Et <ChevronRight size={16} />
                </button>
              </div>

              {/* Leaderboard */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-900/50">
                        <th className="text-left py-3 px-4 text-gray-400 font-bold text-xs">Rank</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-bold text-xs">Model</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-bold text-xs">Accuracy</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-bold text-xs">F1-Score</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-bold text-xs">Precision</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-bold text-xs">Recall</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-bold text-xs">Time</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-bold text-xs">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_MODELS.sort((a, b) => b.accuracy - a.accuracy).map((model, i) => (
                        <tr
                          key={model.name}
                          className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                            i === 0 ? "bg-yellow-500/5" : ""
                          }`}
                        >
                          <td className="py-3 px-4">
                            {i === 0 ? (
                              <Trophy size={16} className="text-yellow-400" />
                            ) : (
                              <span className="text-gray-500">#{i + 1}</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-white font-medium">{model.name}</p>
                            <p className="text-gray-500 text-[10px]">{model.features.length} features</p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${model.accuracy}%` }} />
                              </div>
                              <span className={`text-xs font-bold ${i === 0 ? "text-cyan-400" : "text-gray-400"}`}>
                                {model.accuracy}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-400">{model.f1Score}%</td>
                          <td className="py-3 px-4 text-gray-400">{model.precision}%</td>
                          <td className="py-3 px-4 text-gray-400">{model.recall}%</td>
                          <td className="py-3 px-4 text-gray-500 text-xs">{model.trainingTime}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelectedModel(model)}
                              className="p-1.5 text-gray-500 hover:text-purple-400 transition-colors"
                            >
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
                  <h3 className="text-white font-bold text-sm mb-4">Model Müqayisəsi</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={MOCK_MODELS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} angle={-45} textAnchor="end" height={60} />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} />
                      <Bar dataKey="accuracy" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="f1Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
                  <h3 className="text-white font-bold text-sm mb-4">Xüsusiyyət Əhəmiyyəti</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={FEATURE_IMPORTANCE} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9ca3af" />
                      <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} />
                      <Bar dataKey="importance" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: Deploy */}
      {activeStep === 4 && (
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Model Deploy Edildi!</h3>
            <p className="text-gray-400">XGBoost modeli (92.1% accuracy) istifadəyə hazırdır</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">API Endpoint</h3>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-gray-400 mb-3">
                POST /api/v1/predict/attrition
              </div>
              <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                <Download size={14} />
                API Docs
              </button>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">Model Monitoring</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Drift Detection</span>
                  <span className="text-green-400 text-sm">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Auto-retrain</span>
                  <span className="text-green-400 text-sm">Weekly</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Latency</span>
                  <span className="text-cyan-400 text-sm">45ms avg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => { setActiveStep(1); setShowResults(false); setSelectedModel(null); }}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Yeni Model Təlim Et
            </button>
          </div>
        </div>
      )}

      {/* Model Detail Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedModel(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedModel.name} Detalları</h3>
              <button onClick={() => setSelectedModel(null)} className="text-gray-500 hover:text-white">
                <XCircle size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: "Accuracy", value: `${selectedModel.accuracy}%` },
                { label: "F1-Score", value: `${selectedModel.f1Score}%` },
                { label: "Precision", value: `${selectedModel.precision}%` },
                { label: "Recall", value: `${selectedModel.recall}%` },
                { label: "Training Time", value: selectedModel.trainingTime },
                { label: "Features Used", value: `${selectedModel.features.length}` },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                  <p className="text-white font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-2">Features</p>
              <div className="flex flex-wrap gap-2">
                {selectedModel.features.map((f, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
