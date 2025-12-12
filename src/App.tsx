import React, { useState, useEffect } from 'react';
import { generateHistory, generateMockLog } from './services/mockDataService';
import type { ThreatLog } from './types';
import { Dashboard } from './components/Dashboard';
import { LogExplorer } from './components/LogExplorer';
import { ThreatMap } from './components/ThreatMap';
import { AIAnalysisModal } from './components/AIAnalysisModal';
import { Layout, Shield, Menu, Bell, User } from 'lucide-react';

const App: React.FC = () => {
  const [logs, setLogs] = useState<ThreatLog[]>(() => generateHistory(50));
  const [selectedThreat, setSelectedThreat] = useState<ThreatLog | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs'>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);


  // Simulate real-time incoming threats
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = generateMockLog();
      setLogs(prev => [newLog, ...prev].slice(0, 500)); // Keep last 500
    }, 5000); // New threat every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = (log: ThreatLog) => {
    setSelectedThreat(log);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-20`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <Shield className="text-cyan-500" size={32} />
          {isSidebarOpen && <span className="ml-3 font-bold text-xl tracking-tight text-white">SENTINEL<span className="text-cyan-500">AI</span></span>}
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Layout size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Dashboard</span>}
          </button>
          <button 
             onClick={() => setActiveTab('logs')}
             className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'logs' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Menu size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Threat Logs</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center justify-center md:justify-start gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
               <User size={16} />
             </div>
             {isSidebarOpen && (
               <div>
                 <p className="text-sm font-medium text-white">Admin User</p>
                 <p className="text-xs text-green-400">System Online</p>
               </div>
             )}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 z-10">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <Bell className="text-slate-400 hover:text-white cursor-pointer" size={20} />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-6 relative">
          {/* Background Grid Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
               style={{
                 backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
               }}
          ></div>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h1 className="text-2xl font-bold text-white">Security Overview</h1>
                 <span className="text-xs font-mono text-cyan-500 bg-cyan-950/30 px-3 py-1 rounded border border-cyan-900/50">
                   LIVE MONITORING ACTIVE
                 </span>
              </div>
              <Dashboard logs={logs} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                <div className="lg:col-span-2 h-full">
                  <LogExplorer logs={logs} onAnalyze={handleAnalyze} />
                </div>
                <div className="lg:col-span-1 h-full">
                  <ThreatMap logs={logs} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="h-full flex flex-col">
              <h1 className="text-2xl font-bold text-white mb-6">Threat Log Analysis</h1>
              <div className="flex-1">
                 <LogExplorer logs={logs} onAnalyze={handleAnalyze} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI Analysis Modal */}
      <AIAnalysisModal 
        threat={selectedThreat} 
        onClose={() => setSelectedThreat(null)} 
      />
    </div>
  );
};

export default App;
