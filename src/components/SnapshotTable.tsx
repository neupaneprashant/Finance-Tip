import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw, ArrowUpDown } from 'lucide-react';
import { mockOptionSnapshots, OptionSnapshot } from '../utils/mockData';

type SortKey = 'volume' | 'iv' | 'delta' | 'gamma' | 'strike';
type SortOrder = 'asc' | 'desc';

interface SnapshotTableProps {
  snapshots?: OptionSnapshot[];
}

export function SnapshotTable({ snapshots }: SnapshotTableProps) {
  const [data, setData] = useState<OptionSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnderlying, setSelectedUnderlying] = useState<string>('all');
  const [optionType, setOptionType] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('volume');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [underlyings, setUnderlyings] = useState<string[]>([]);

  useEffect(() => {
    // Use provided snapshots or fall back to mock data
    const dataToUse = snapshots && snapshots.length > 0 ? snapshots : mockOptionSnapshots;
    setData(dataToUse);
    const uniqueUnderlyings = Array.from(
      new Set(dataToUse.map((s) => s.underlying_ticker))
    ).sort();
    setUnderlyings(uniqueUnderlyings as string[]);
  }, [snapshots]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedData = React.useMemo(() => {
    let filtered = data.filter((row) => {
      const matchesSearch = row.option_ticker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUnderlying = selectedUnderlying === 'all' || row.underlying_ticker === selectedUnderlying;
      const matchesType = optionType === 'all' || 
        (optionType === 'call' && row.put_call === 'C') ||
        (optionType === 'put' && row.put_call === 'P');
      return matchesSearch && matchesUnderlying && matchesType;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortKey] || 0;
      let bVal = b[sortKey] || 0;
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [data, searchTerm, selectedUnderlying, optionType, sortKey, sortOrder]);

  const formatNumber = (num: number | null | undefined, decimals: number = 2) => {
    if (num === null || num === undefined) return '-';
    return num.toFixed(decimals);
  };

  const formatVolume = (vol: number | null | undefined) => {
    if (vol === null || vol === undefined) return '-';
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toString();
  };

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="bg-[#13182b] rounded-lg border border-gray-800 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search option ticker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Underlying Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
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

          {/* Option Type Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setOptionType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                optionType === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#0a0e1a] text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setOptionType('call')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                optionType === 'call'
                  ? 'bg-green-600 text-white'
                  : 'bg-[#0a0e1a] text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              Calls
            </button>
            <button
              onClick={() => setOptionType('put')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                optionType === 'put'
                  ? 'bg-red-600 text-white'
                  : 'bg-[#0a0e1a] text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              Puts
            </button>
          </div>

          {/* Download Button */}
          <button
            onClick={() => {
              const csv = [
                Object.keys(filteredAndSortedData[0] || {}).join(','),
                ...filteredAndSortedData.map(row => Object.values(row).join(','))
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `options_snapshot_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Stats Summary */}
        <div className="mt-4 flex gap-6 text-sm">
          <div>
            <span className="text-gray-400">Total Options:</span>{' '}
            <span className="text-white font-medium">{filteredAndSortedData.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Calls:</span>{' '}
            <span className="text-green-400 font-medium">
              {filteredAndSortedData.filter(r => r.put_call === 'C').length}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Puts:</span>{' '}
            <span className="text-red-400 font-medium">
              {filteredAndSortedData.filter(r => r.put_call === 'P').length}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#13182b] rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1a1f35] border-b border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Option Ticker
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Underlying
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-orange-400"
                  onClick={() => handleSort('strike')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Strike
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Bid/Ask/Last
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Mid
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-orange-400"
                  onClick={() => handleSort('iv')}
                >
                  <div className="flex items-center justify-end gap-1">
                    IV
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-orange-400"
                  onClick={() => handleSort('delta')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Delta
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-orange-400"
                  onClick={() => handleSort('gamma')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Gamma
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Theta
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Vega
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-orange-400"
                  onClick={() => handleSort('volume')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Volume
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Open Int
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredAndSortedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#1a1f35] transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-orange-400">
                    {row.option_ticker}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-200">
                    {row.underlying_ticker}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {row.expiry_date ? new Date(row.expiry_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-6 rounded text-xs font-bold ${
                        row.put_call === 'C'
                          ? 'bg-green-900/30 text-green-400 border border-green-700'
                          : 'bg-red-900/30 text-red-400 border border-red-700'
                      }`}
                    >
                      {row.put_call}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-200 font-medium">
                    ${formatNumber(row.strike)}
                  </td>
                  <td className="px-4 py-3 text-xs text-right text-gray-400 font-mono">
                    {formatNumber(row.bid, 2)}/{formatNumber(row.ask, 2)}/{formatNumber(row.last, 2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-200 font-medium">
                    ${formatNumber(row.mid, 2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-blue-400">
                    {formatNumber(row.iv, 1)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-300">
                    {formatNumber(row.delta, 3)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-300">
                    {formatNumber(row.gamma, 4)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-300">
                    {formatNumber(row.theta, 3)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-300">
                    {formatNumber(row.vega, 3)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-purple-400">
                    {formatVolume(row.volume)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-400">
                    {formatVolume(row.open_interest)}
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