import React, { useState, useEffect } from 'react';
import { BarChart3, Activity } from 'lucide-react';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { mockOptionSnapshots } from '../utils/mockData';

export function Analytics() {
  const [data, setData] = useState<any[]>([]);
  const [selectedUnderlying, setSelectedUnderlying] = useState<string>('all');
  const [underlyings, setUnderlyings] = useState<string[]>([]);

  useEffect(() => {
    // Load mock data
    setData(mockOptionSnapshots);
    const uniqueUnderlyings = Array.from(
      new Set(mockOptionSnapshots.map((s) => s.underlying_ticker))
    ).sort();
    setUnderlyings(uniqueUnderlyings as string[]);
  }, []);

  const filteredData = React.useMemo(() => {
    if (selectedUnderlying === 'all') return data;
    return data.filter(d => d.underlying_ticker === selectedUnderlying);
  }, [data, selectedUnderlying]);

  // IV Distribution by Strike
  const ivByStrike = React.useMemo(() => {
    const calls = filteredData.filter(d => d.put_call === 'C' && d.iv && d.strike).map(d => ({
      strike: d.strike,
      iv: d.iv,
      type: 'Call'
    }));
    const puts = filteredData.filter(d => d.put_call === 'P' && d.iv && d.strike).map(d => ({
      strike: d.strike,
      iv: d.iv,
      type: 'Put'
    }));
    return [...calls, ...puts].sort((a, b) => a.strike - b.strike);
  }, [filteredData]);

  // Volume Distribution
  const volumeDistribution = React.useMemo(() => {
    const calls = filteredData.filter(d => d.put_call === 'C').reduce((sum, d) => sum + (d.volume || 0), 0);
    const puts = filteredData.filter(d => d.put_call === 'P').reduce((sum, d) => sum + (d.volume || 0), 0);
    return [
      { name: 'Calls', value: calls, color: '#10b981' },
      { name: 'Puts', value: puts, color: '#ef4444' }
    ];
  }, [filteredData]);

  // Delta Distribution
  const deltaDistribution = React.useMemo(() => {
    const bins = [
      { range: '0.0-0.2', min: 0, max: 0.2, count: 0 },
      { range: '0.2-0.4', min: 0.2, max: 0.4, count: 0 },
      { range: '0.4-0.6', min: 0.4, max: 0.6, count: 0 },
      { range: '0.6-0.8', min: 0.6, max: 0.8, count: 0 },
      { range: '0.8-1.0', min: 0.8, max: 1.0, count: 0 },
    ];

    filteredData.forEach(d => {
      const delta = Math.abs(d.delta || 0);
      const bin = bins.find(b => delta >= b.min && delta < b.max);
      if (bin) bin.count++;
    });

    return bins;
  }, [filteredData]);

  // Top Volume Options
  const topVolume = React.useMemo(() => {
    return [...filteredData]
      .filter(d => d.volume > 0)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10)
      .map(d => ({
        ticker: d.option_ticker,
        volume: d.volume,
        type: d.put_call,
        strike: d.strike
      }));
  }, [filteredData]);

  // Gamma vs Volume scatter
  const gammaVsVolume = React.useMemo(() => {
    return filteredData
      .filter(d => d.gamma && d.volume && d.volume > 0)
      .map(d => ({
        gamma: Math.abs(d.gamma) * 1000, // Scale for visibility
        volume: d.volume,
        type: d.put_call === 'C' ? 'Call' : 'Put'
      }));
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#13182b] rounded-lg border border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Options Analytics</h2>
              <p className="text-sm text-gray-400">Market structure and Greeks analysis</p>
            </div>
          </div>

          <select
            value={selectedUnderlying}
            onChange={(e) => setSelectedUnderlying(e.target.value)}
            className="px-4 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Underlyings</option>
            {underlyings.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#13182b] rounded-lg border border-gray-800 p-4">
          <div className="text-xs text-gray-400 mb-1">Total Options</div>
          <div className="text-2xl font-bold text-white">{filteredData.length}</div>
          <div className="text-xs text-green-400 mt-1">
            {filteredData.filter(d => d.put_call === 'C').length} Calls / {filteredData.filter(d => d.put_call === 'P').length} Puts
          </div>
        </div>
        <div className="bg-[#13182b] rounded-lg border border-gray-800 p-4">
          <div className="text-xs text-gray-400 mb-1">Total Volume</div>
          <div className="text-2xl font-bold text-white">
            {filteredData.reduce((sum, d) => sum + (d.volume || 0), 0).toLocaleString()}
          </div>
          <div className="text-xs text-purple-400 mt-1">Cumulative contracts</div>
        </div>
        <div className="bg-[#13182b] rounded-lg border border-gray-800 p-4">
          <div className="text-xs text-gray-400 mb-1">Avg IV</div>
          <div className="text-2xl font-bold text-white">
            {(filteredData.reduce((sum, d) => sum + (d.iv || 0), 0) / filteredData.filter(d => d.iv).length).toFixed(1)}%
          </div>
          <div className="text-xs text-blue-400 mt-1">Implied Volatility</div>
        </div>
        <div className="bg-[#13182b] rounded-lg border border-gray-800 p-4">
          <div className="text-xs text-gray-400 mb-1">Put/Call Ratio</div>
          <div className="text-2xl font-bold text-white">
            {(filteredData.filter(d => d.put_call === 'P').length / filteredData.filter(d => d.put_call === 'C').length).toFixed(2)}
          </div>
          <div className="text-xs text-orange-400 mt-1">By contract count</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        {/* IV Smile */}
        <div className="bg-[#13182b] rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">IV Smile (Volatility by Strike)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="strike" 
                stroke="#9ca3af" 
                label={{ value: 'Strike Price', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
              />
              <YAxis 
                stroke="#9ca3af" 
                label={{ value: 'IV (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Scatter 
                name="Calls" 
                data={ivByStrike.filter(d => d.type === 'Call')} 
                fill="#10b981" 
              />
              <Scatter 
                name="Puts" 
                data={ivByStrike.filter(d => d.type === 'Put')} 
                fill="#ef4444" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Distribution */}
        <div className="bg-[#13182b] rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Volume Distribution (Calls vs Puts)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {volumeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Delta Distribution */}
        <div className="bg-[#13182b] rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Delta Distribution (Moneyness)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deltaDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="range" 
                stroke="#9ca3af" 
                label={{ value: 'Delta Range', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
              />
              <YAxis 
                stroke="#9ca3af" 
                label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gamma vs Volume */}
        <div className="bg-[#13182b] rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Gamma vs Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="volume" 
                stroke="#9ca3af" 
                label={{ value: 'Volume', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
              />
              <YAxis 
                dataKey="gamma" 
                stroke="#9ca3af" 
                label={{ value: 'Gamma (×1000)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Scatter 
                name="Calls" 
                data={gammaVsVolume.filter(d => d.type === 'Call')} 
                fill="#10b981" 
              />
              <Scatter 
                name="Puts" 
                data={gammaVsVolume.filter(d => d.type === 'Put')} 
                fill="#ef4444" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Volume Table */}
      <div className="bg-[#13182b] rounded-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top 10 by Volume</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Option Ticker</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Type</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Strike</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {topVolume.map((opt, idx) => (
                <tr key={idx} className="hover:bg-[#1a1f35]">
                  <td className="px-4 py-3 text-sm text-gray-400">#{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-mono text-orange-400">{opt.ticker}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-6 rounded text-xs font-bold ${
                      opt.type === 'C'
                        ? 'bg-green-900/30 text-green-400 border border-green-700'
                        : 'bg-red-900/30 text-red-400 border border-red-700'
                    }`}>
                      {opt.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-200">${opt.strike.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-purple-400">
                    {opt.volume.toLocaleString()}
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
