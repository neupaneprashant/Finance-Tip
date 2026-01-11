import React, { useState, useEffect } from 'react';
import { SnapshotTable } from './components/SnapshotTable';
import { AlertFeed } from './components/AlertFeed';
import { Analytics } from './components/Analytics';
import { AlertHistory } from './components/AlertHistory';
import { Settings } from './components/Settings';
import { TrendingUp, Bell, BarChart3, History, Settings as SettingsIcon, RefreshCw, Database } from 'lucide-react';
import { mockVolumeAlerts, OptionSnapshot, VolumeAlert } from './utils/mockData';
import * as api from './utils/api';
import { fetchOptionsFromBrowser } from './utils/yahooFinance';

type TabType = 'snapshot' | 'alerts' | 'analytics' | 'history' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('snapshot');
  const [realtimeAlerts, setRealtimeAlerts] = useState<VolumeAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Data mode: 'mock' or 'live'
  const [dataMode, setDataMode] = useState<'mock' | 'live'>('mock');
  const [snapshots, setSnapshots] = useState<OptionSnapshot[]>([]);
  const [alerts, setAlerts] = useState<VolumeAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  // Function to fetch live data
  const fetchLiveData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching options data from Yahoo Finance (client-side)...');
      
      // Fetch options data directly from browser (bypasses server 401 errors)
      const fetchedSnapshots = await fetchOptionsFromBrowser(['AAPL', 'TSLA', 'NVDA'], 60);
      
      console.log(`Fetched ${fetchedSnapshots.length} options`);
      setSnapshots(fetchedSnapshots);
      
      // For now, skip volume spike detection since we need historical data
      // In production, you'd store snapshots in Supabase and compare
      
      setLastFetchTime(new Date());
    } catch (err) {
      console.error('Error fetching live data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Load data when switching modes
  useEffect(() => {
    if (dataMode === 'live') {
      fetchLiveData();
    }
  }, [dataMode]);

  // Auto-refresh live data every 5 minutes
  useEffect(() => {
    if (dataMode === 'live') {
      const interval = setInterval(() => {
        fetchLiveData();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [dataMode]);

  // Simulate real-time alerts for MOCK mode
  useEffect(() => {
    if (dataMode === 'mock') {
      const interval = setInterval(() => {
        const randomAlert = mockVolumeAlerts[Math.floor(Math.random() * 3)];
        const newAlert = {
          ...randomAlert,
          id: Date.now(),
          alert_timestamp: new Date().toISOString()
        };
        setRealtimeAlerts((prev) => [newAlert, ...prev].slice(0, 10));
        setUnreadCount((prev) => prev + 1);
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [dataMode]);

  const tabs = [
    { id: 'snapshot' as TabType, label: 'Live Snapshot', icon: TrendingUp },
    { id: 'alerts' as TabType, label: 'Alerts', icon: Bell, badge: unreadCount },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'history' as TabType, label: 'History', icon: History },
    { id: 'settings' as TabType, label: 'Settings', icon: SettingsIcon },
  ];

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    if (tabId === 'alerts') {
      setUnreadCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100">
      {/* Header */}
      <header className="bg-[#13182b] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Finance@Tip</h1>
                <p className="text-xs text-gray-400">Bloomberg Options Monitor - Volume Spike Detection (2-Month Window)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-400">Last Updated</div>
                <div className="text-sm font-medium text-gray-200">
                  {lastFetchTime ? lastFetchTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZone: 'America/New_York' 
                  }) : 'N/A'} ET
                </div>
              </div>
              <div className="px-3 py-1.5 bg-green-900/30 border border-green-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-400">DEMO MODE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-[#13182b] border-b border-gray-800">
        <div className="max-w-[1920px] mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    relative px-6 py-3 font-medium text-sm transition-all
                    ${isActive 
                      ? 'text-orange-400 bg-[#0a0e1a]' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1f35]'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.badge && tab.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full min-w-[20px] text-center">
                        {tab.badge > 99 ? '99+' : tab.badge}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto p-6">
        {/* Control Panel */}
        <div className="mb-6 bg-[#13182b] rounded-lg border border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Data Source:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setDataMode('mock')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dataMode === 'mock'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#0a0e1a] text-gray-400 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  Mock Data (Demo)
                </button>
                <button
                  onClick={() => setDataMode('live')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dataMode === 'live'
                      ? 'bg-green-600 text-white'
                      : 'bg-[#0a0e1a] text-gray-400 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  Live Data (Yahoo Finance)
                </button>
              </div>
              {error && (
                <div className="ml-4 px-3 py-1.5 bg-red-900/30 border border-red-700 rounded-lg">
                  <span className="text-xs text-red-400">{error}</span>
                </div>
              )}
            </div>
            
            {dataMode === 'live' && (
              <button
                onClick={fetchLiveData}
                disabled={loading}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Fetching...' : 'Refresh Data'}
              </button>
            )}
          </div>
          
          {dataMode === 'live' && snapshots.length > 0 && (
            <div className="mt-3 flex gap-6 text-sm">
              <div>
                <span className="text-gray-400">Options Loaded:</span>{' '}
                <span className="text-white font-medium">{snapshots.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Alerts Found:</span>{' '}
                <span className="text-orange-400 font-medium">{alerts.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Auto-refresh:</span>{' '}
                <span className="text-green-400 font-medium">Every 5 minutes</span>
              </div>
            </div>
          )}
          
          {dataMode === 'live' && !loading && snapshots.length === 0 && lastFetchTime && (
            <div className="mt-3 px-3 py-2 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <div className="text-xs text-yellow-400 space-y-1">
                <div className="font-medium">⚠️ Yahoo Finance API Access Issue</div>
                <div>Yahoo Finance is returning 401 Unauthorized errors. Their unofficial API blocks server-side requests.</div>
                <div className="mt-2 text-yellow-300">
                  <strong>Recommendations:</strong>
                  <ul className="list-disc ml-4 mt-1 space-y-0.5">
                    <li>Use Mock Data mode to demo the full system functionality</li>
                    <li>For production, consider paid APIs like: Polygon.io, Tradier, CBOE DataShop, or Bloomberg Terminal API</li>
                    <li>Alternative free options: Alpha Vantage (limited), IEX Cloud (limited free tier)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {activeTab === 'snapshot' && <SnapshotTable snapshots={snapshots} />}
        {activeTab === 'alerts' && <AlertFeed realtimeAlerts={realtimeAlerts} />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'history' && <AlertHistory alerts={alerts} />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}