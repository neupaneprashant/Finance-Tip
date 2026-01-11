import React, { useState, useEffect } from 'react';
import { Bell, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { mockVolumeAlerts } from '../utils/mockData';

interface AlertFeedProps {
  realtimeAlerts: any[];
}

export function AlertFeed({ realtimeAlerts }: AlertFeedProps) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('today');

  useEffect(() => {
    // Load mock alerts
    setAlerts(mockVolumeAlerts);
  }, []);

  const filteredAlerts = React.useMemo(() => {
    let filtered = alerts;

    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = alerts.filter(a => new Date(a.alert_timestamp) >= today);
    } else if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = alerts.filter(a => new Date(a.alert_timestamp) >= weekAgo);
    }

    return filtered;
  }, [alerts, filter]);

  // Merge realtime alerts with fetched alerts
  const allAlerts = React.useMemo(() => {
    const realtimeIds = new Set(realtimeAlerts.map(a => a.id));
    const existing = filteredAlerts.filter(a => !realtimeIds.has(a.id));
    return [...realtimeAlerts, ...existing];
  }, [realtimeAlerts, filteredAlerts]);

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getAlertSeverity = (pctChange: number) => {
    if (pctChange >= 50) return { color: 'red', label: 'CRITICAL' };
    if (pctChange >= 30) return { color: 'orange', label: 'HIGH' };
    return { color: 'yellow', label: 'MEDIUM' };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#13182b] rounded-lg border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Volume Spike Alerts</h2>
              <p className="text-sm text-gray-400">Real-time notifications when volume exceeds threshold</p>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('today')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'today'
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#0a0e1a] text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'week'
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#0a0e1a] text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#0a0e1a] text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#0a0e1a] rounded-lg p-4 border border-gray-800">
            <div className="text-2xl font-bold text-white">{allAlerts.length}</div>
            <div className="text-xs text-gray-400 mt-1">Total Alerts</div>
          </div>
          <div className="bg-[#0a0e1a] rounded-lg p-4 border border-gray-800">
            <div className="text-2xl font-bold text-red-400">
              {allAlerts.filter(a => a.volume_pct_change >= 50).length}
            </div>
            <div className="text-xs text-gray-400 mt-1">Critical (&gt;50%)</div>
          </div>
          <div className="bg-[#0a0e1a] rounded-lg p-4 border border-gray-800">
            <div className="text-2xl font-bold text-orange-400">
              {allAlerts.filter(a => a.volume_pct_change >= 30 && a.volume_pct_change < 50).length}
            </div>
            <div className="text-xs text-gray-400 mt-1">High (30-50%)</div>
          </div>
          <div className="bg-[#0a0e1a] rounded-lg p-4 border border-gray-800">
            <div className="text-2xl font-bold text-yellow-400">
              {allAlerts.filter(a => a.volume_pct_change < 30).length}
            </div>
            <div className="text-xs text-gray-400 mt-1">Medium (&lt;30%)</div>
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {allAlerts.map((alert, idx) => {
          const severity = getAlertSeverity(alert.volume_pct_change);
          const isNew = realtimeAlerts.some(ra => ra.id === alert.id);
          
          return (
            <div
              key={alert.id || idx}
              className={`bg-[#13182b] rounded-lg border p-4 transition-all ${
                isNew 
                  ? 'border-orange-500 shadow-lg shadow-orange-500/20 animate-pulse' 
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Severity Indicator */}
                <div className={`w-1 h-full rounded-full ${
                  severity.color === 'red' ? 'bg-red-500' :
                  severity.color === 'orange' ? 'bg-orange-500' :
                  'bg-yellow-500'
                }`} />
                
                {/* Alert Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  severity.color === 'red' ? 'bg-red-900/30 border border-red-700' :
                  severity.color === 'orange' ? 'bg-orange-900/30 border border-orange-700' :
                  'bg-yellow-900/30 border border-yellow-700'
                }`}>
                  <TrendingUp className={`w-5 h-5 ${
                    severity.color === 'red' ? 'text-red-400' :
                    severity.color === 'orange' ? 'text-orange-400' :
                    'text-yellow-400'
                  }`} />
                </div>

                {/* Alert Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono text-orange-400">{alert.option_ticker}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          severity.color === 'red' ? 'bg-red-900/50 text-red-300' :
                          severity.color === 'orange' ? 'bg-orange-900/50 text-orange-300' :
                          'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {severity.label}
                        </span>
                        {isNew && (
                          <span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs font-bold">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-300">
                        Volume spike detected: <span className="font-bold text-white">+{alert.volume_pct_change.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(alert.alert_timestamp)}
                    </div>
                  </div>

                  {/* Alert Details */}
                  <div className="grid grid-cols-4 gap-4 mt-3 p-3 bg-[#0a0e1a] rounded border border-gray-800">
                    <div>
                      <div className="text-xs text-gray-400">Current Volume</div>
                      <div className="text-sm font-medium text-white">{alert.current_volume?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Prior Volume</div>
                      <div className="text-sm font-medium text-gray-300">{alert.prior_volume?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Underlying</div>
                      <div className="text-sm font-medium text-gray-300">{alert.underlying_ticker}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Snapshot Date</div>
                      <div className="text-sm font-medium text-gray-300">
                        {new Date(alert.snapshot_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Telegram Status */}
                  {alert.telegram_sent && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      Telegram notification sent
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
