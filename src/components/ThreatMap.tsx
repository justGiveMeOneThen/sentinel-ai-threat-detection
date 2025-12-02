import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import type { ThreatLog } from '../types';

interface ThreatMapProps {
  logs: ThreatLog[];
}

export const ThreatMap: React.FC<ThreatMapProps> = ({ logs }) => {
  // Aggregate data by country
  const data = React.useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach(log => {
      counts[log.country] = (counts[log.country] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8
  }, [logs]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-slate-200 font-bold mb-4 flex items-center justify-between">
        <span>Top Threat Origins</span>
        <span className="text-xs font-normal text-slate-500 bg-slate-950 px-2 py-1 rounded">Last 24h</span>
      </h3>
      <div className="flex-grow min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={60} />
            <Tooltip 
              cursor={{fill: '#1e293b'}}
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={index < 3 ? '#ef4444' : '#06b6d4'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
