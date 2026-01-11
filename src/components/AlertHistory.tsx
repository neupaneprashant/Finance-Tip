import React, { useState, useEffect } from 'react';
import { History, Download, Search, Calendar } from 'lucide-react';
import { mockVolumeAlerts, VolumeAlert } from '../utils/mockData';

interface AlertHistoryProps {
  alerts?: VolumeAlert[];
}

export function AlertHistory({ alerts: providedAlerts }: AlertHistoryProps) {
  const [alerts, setAlerts] = useState<VolumeAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'pct_change'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Use provided alerts or fall back to mock data
    const dataToUse = providedAlerts && providedAlerts.length > 0 ? providedAlerts : mockVolumeAlerts;
    setAlerts(dataToUse);
  }, [providedAlerts]);

  const filteredAndSortedAlerts = React.useMemo(() => {
    let filtered = alerts.filter((alert) => {
      const matchesSearch = 
        alert.option_ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.underlying_ticker.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !dateFilter || 
        new Date(alert.alert_timestamp).toISOString().split('T')[0] === dateFilter;
      
      return matchesSearch && matchesDate;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'timestamp') {
        aVal = new Date(a.alert_timestamp).getTime();
        bVal = new Date(b.alert_timestamp).getTime();
      } else {
        aVal = a.volume_pct_change;
        bVal = b.volume_pct_change;
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [alerts, searchTerm, dateFilter, sortBy, sortOrder]);

  const exportToCsv = () => {
    const headers = [
      'Timestamp',
      'Option Ticker',
      'Underlying',
      'Current Volume',
      'Prior Volume',
      'Change %',
      'Snapshot Date',
      'Telegram Sent'
    ];
    
    const rows = filteredAndSortedAlerts.map(alert => [
      new Date(alert.alert_timestamp).toISOString(),
      alert.option_ticker,
      alert.underlying_ticker,
      alert.current_volume,
      alert.prior_volume,
      alert.volume_pct_change,
      alert.snapshot_date,
      alert.telegram_sent ? 'Yes' : 'No'
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alert_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleSort = (key: 'timestamp' | 'pct_change') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#13182b] rounded-lg border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Alert History</h2>
              <p className="text-sm text-gray-400">Complete audit log of all volume spike alerts</p>
            </div>
          </div>
          
          <button
            onClick={exportToCsv}
            disabled={filteredAndSortedAlerts.length === 0}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search ticker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-orange-500"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-gray-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="bg-[#0a0e1a] rounded-lg p-3 border border-gray-800">
            <div className="text-lg font-bold text-white">{filteredAndSortedAlerts.length}</div>
            <div className="text-xs text-gray-400">Total Records</div>
          </div>
          <div className="bg-[#0a0e1a] rounded-lg p-3 border border-gray-800">
            <div className="text-lg font-bold text-green-400">
              {filteredAndSortedAlerts.filter(a => a.telegram_sent).length}
            </div>
            <div className="text-xs text-gray-400">Telegram Sent</div>
          </div>
          <div className="bg-[#0a0e1a] rounded-lg p-3 border border-gray-800">
            <div className="text-lg font-bold text-orange-400">
              {filteredAndSortedAlerts.length > 0 
                ? (filteredAndSortedAlerts.reduce((sum, a) => sum + a.volume_pct_change, 0) / filteredAndSortedAlerts.length).toFixed(1)
                : '0'}%
            </div>
            <div className="text-xs text-gray-400">Avg % Change</div>
          </div>
          <div className="bg-[#0a0e1a] rounded-lg p-3 border border-gray-800">
            <div className="text-lg font-bold text-red-400">
              {filteredAndSortedAlerts.length > 0 
                ? Math.max(...filteredAndSortedAlerts.map(a => a.volume_pct_change)).toFixed(1)
                : '0'}%
            </div>
            <div className="text-xs text-gray-400">Max % Change</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#13182b] rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1a1f35] border-b border-gray-800">
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-orange-400"
                  onClick={() => handleSort('timestamp')}
                >
                  Timestamp {sortBy === 'timestamp' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Option Ticker
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Underlying
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Current Vol
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Prior Vol
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-orange-400"
                  onClick={() => handleSort('pct_change')}
                >
                  Change % {sortBy === 'pct_change' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Snapshot Date
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Telegram
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredAndSortedAlerts.map((alert, idx) => (
                <tr key={alert.id || idx} className="hover:bg-[#1a1f35] transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {new Date(alert.alert_timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-orange-400">
                    {alert.option_ticker}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-200">
                    {alert.underlying_ticker}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-purple-400">
                    {alert.current_volume?.toLocaleString() || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-400">
                    {alert.prior_volume?.toLocaleString() || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-bold ${
                      alert.volume_pct_change >= 50 ? 'text-red-400' :
                      alert.volume_pct_change >= 30 ? 'text-orange-400' :
                      'text-yellow-400'
                    }`}>
                      +{alert.volume_pct_change.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {new Date(alert.snapshot_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {alert.telegram_sent ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-900/30 text-green-400 border border-green-700">
                        Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-800 text-gray-500 border border-gray-700">
                        No
                      </span>
                    )}
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