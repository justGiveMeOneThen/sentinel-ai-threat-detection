import React, { useMemo } from 'react';
import type { ThreatLog } from '../types';
import { Severity } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { Shield, Activity, AlertOctagon, Target } from 'lucide-react';

interface DashboardProps {
  logs: ThreatLog[];
}

export const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  // Metrics
  const criticalCount = logs.filter(l => l.severity === Severity.CRITICAL).length;
  const highCount = logs.filter(l => l.severity === Severity.HIGH).length;
  const totalThreats = logs.length;
  const avgConfidence = logs.length > 0 
    ? (logs.reduce((acc, curr) => acc + curr.confidence, 0) / logs.length).toFixed(1)
    : 0;

  // Chart Data: Threats over time (last 20 data points for visualization)
  const timeSeriesData = useMemo(() => {
    // Group by minute or hour roughly for the visual
    // For this mock, we just take the last 20 logs and index them reversed
    return [...logs].reverse().slice(-30).map((log) => ({
      time: new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      severityValue: log.severity === Severity.CRITICAL ? 4 : log.severity === Severity.HIGH ? 3 : 2,
      confidence: log.confidence
    }));
  }, [logs]);

  // Chart Data: Threat Types
  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach(l => counts[l.type] = (counts[l.type] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [logs]);

  const COLORS = ['#06b6d4', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric Cards */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Shield size={64} className="text-cyan-500" />
        </div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Threats</h3>
        <p className="text-3xl font-bold text-white mt-1">{totalThreats}</p>
        <div className="mt-2 text-xs text-green-400 flex items-center">
          <Activity size={12} className="mr-1" /> +12% from last hour
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <AlertOctagon size={64} className="text-red-500" />
        </div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Critical Alerts</h3>
        <p className="text-3xl font-bold text-red-500 mt-1">{criticalCount}</p>
         <div className="mt-2 text-xs text-red-400 flex items-center">
          Needs immediate attention
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Target size={64} className="text-orange-500" />
        </div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">High Severity</h3>
        <p className="text-3xl font-bold text-orange-400 mt-1">{highCount}</p>
         <div className="mt-2 text-xs text-slate-400">
          Monitoring active vectors
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity size={64} className="text-purple-500" />
        </div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Avg Model Confidence</h3>
        <p className="text-3xl font-bold text-purple-400 mt-1">{avgConfidence}%</p>
         <div className="mt-2 text-xs text-slate-400">
          Model v2.5.0 Performance
        </div>
      </div>

      {/* Charts Row */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-slate-900 p-4 rounded-lg border border-slate-800 h-[300px]">
        <h3 className="text-slate-200 font-bold mb-4">Traffic Volume & Anomaly Detection</h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
            <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} domain={[50, 100]} />
            <RechartsTooltip 
               contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
               itemStyle={{ color: '#22d3ee' }}
            />
            <Area type="monotone" dataKey="confidence" stroke="#06b6d4" fillOpacity={1} fill="url(#colorConf)" strokeWidth={2} name="Detection Confidence" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-slate-900 p-4 rounded-lg border border-slate-800 h-[300px]">
        <h3 className="text-slate-200 font-bold mb-2">Threat Distribution</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={typeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {typeData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
              ))}
            </Pie>
            <RechartsTooltip 
               contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            />
            <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};