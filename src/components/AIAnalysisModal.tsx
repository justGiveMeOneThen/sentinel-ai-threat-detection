import React, { useEffect, useState } from 'react';
import type { ThreatLog, AIAnalysisResult } from '../types';
import { analyzeThreatWithGemini } from '../services/geminiService';
import { X, ShieldAlert, CheckCircle, Activity, Loader2 } from 'lucide-react';

interface AIAnalysisModalProps {
  threat: ThreatLog | null;
  onClose: () => void;
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({ threat, onClose }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!threat) return;

    // Use an async function inside useEffect to properly handle the promise
    const analyzeAsync = async () => {
      setLoading(true);
      setAnalysis(null);
      
      try {
        const result = await analyzeThreatWithGemini(threat);
        setAnalysis(result);
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeAsync();
  }, [threat]);

  if (!threat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold text-white">Threat Intelligence</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Threat Type</span>
              <div className="text-lg font-mono text-cyan-300">{threat.type}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Source IP</span>
              <div className="text-lg font-mono text-cyan-300">{threat.sourceIP}</div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="animate-spin text-cyan-500" size={48} />
              <p className="text-slate-400 animate-pulse">Analyzing vector signatures...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="text-purple-400" size={20} /> Analysis
                   </h3>
                   <div className="flex items-center gap-2">
                     <span className="text-slate-400 text-sm">Risk Score:</span>
                     <span className={`text-xl font-bold ${analysis.riskScore > 80 ? 'text-red-500' : analysis.riskScore > 50 ? 'text-orange-500' : 'text-green-500'}`}>
                       {analysis.riskScore}/100
                     </span>
                   </div>
                </div>
                <p className="text-slate-300 leading-relaxed">{analysis.analysis}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="text-green-400" size={20} /> Recommended Remediation
                </h3>
                <ul className="space-y-2">
                  {analysis.remediationSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start bg-slate-950 p-3 rounded border border-slate-800">
                      <span className="text-cyan-500 font-mono mr-3">0{idx + 1}</span>
                      <span className="text-slate-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-red-400 text-center">Analysis failed.</div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-800 p-4 border-t border-slate-700 flex justify-end">
           <button 
             onClick={onClose}
             className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
           >
             Close Report
           </button>
        </div>
      </div>
    </div>
  );
};