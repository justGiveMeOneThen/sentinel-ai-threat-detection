import React, { useState, useMemo } from 'react';
import type { ThreatLog } from '../types';
import { Severity } from '../types';
import { Search, Filter, Download, Eye, AlertTriangle } from 'lucide-react';

interface LogExplorerProps {
  logs: ThreatLog[];
  onAnalyze: (log: ThreatLog) => void;
}

export const LogExplorer: React.FC<LogExplorerProps> = ({ logs, onAnalyze }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.sourceIP.includes(searchTerm) || 
        log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.country.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = filterSeverity === 'All' || log.severity === filterSeverity;

      return matchesSearch && matchesSeverity;
    });
  }, [logs, searchTerm, filterSeverity]);

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Type', 'Severity', 'Source IP', 'Destination IP', 'Country', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => 
        [log.timestamp, log.type, log.severity, log.sourceIP, log.destinationIP, log.country, log.status].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'threat_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
           <Filter size={20} className="text-cyan-400" /> Threat Log Explorer
        </h2>
        
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search IP, Type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-cyan-500 w-full"
            />
          </div>
          
          <select 
            value={filterSeverity} 
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white text-sm rounded px-3 py-2 focus:outline-none"
          >
            <option value="All">All Severities</option>
            {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded border border-slate-700 transition-colors"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="overflow-auto flex-grow">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950 text-slate-200 font-medium sticky top-0">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Source IP</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{new Date(log.timestamp).toLocaleTimeString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold
                    ${log.severity === Severity.CRITICAL ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                      log.severity === Severity.HIGH ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                      log.severity === Severity.MEDIUM ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                      'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                    {log.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-200">{log.type}</td>
                <td className="px-4 py-3 font-mono">{log.sourceIP}</td>
                <td className="px-4 py-3">{log.country}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1
                     ${log.status === 'Blocked' ? 'text-red-400' : 'text-blue-400'}`}>
                    {log.status === 'Blocked' ? <AlertTriangle size={14}/> : <Eye size={14}/>}
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => onAnalyze(log)}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-medium border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 rounded hover:bg-cyan-500/20 transition-all"
                  >
                    AI Analyze
                  </button>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
               <tr>
                 <td colSpan={7} className="text-center py-8 text-slate-500">No logs found matching criteria.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};