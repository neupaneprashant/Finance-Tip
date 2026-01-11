import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Database, Bell, Code, Info, CheckCircle } from 'lucide-react';

export function Settings() {
  const [config, setConfig] = useState({
    volAlertThreshold: 10,
    daysToExpiry: 7,
    refreshInterval: 60,
    telegramEnabled: true,
    autoRefresh: true,
  });

  const handleSave = () => {
    alert('Settings saved! (Demo Mode - Settings are not persisted)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#13182b] rounded-lg border border-gray-800 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Settings & Configuration</h2>
            <p className="text-sm text-gray-400">Configure monitoring parameters and integrations</p>
          </div>
        </div>
      </div>

      {/* Demo Mode Notice */}
      <div className="bg-green-900/20 rounded-lg border border-green-700 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-green-300 mb-2">Demo Mode Active</h3>
            <p className="text-sm text-green-200 mb-3">
              This is a fully functional UI demo showcasing the Bloomberg Options Monitor dashboard. 
              All data displayed is mock data for demonstration purposes.
            </p>
            <div className="text-sm text-green-100 space-y-2">
              <div className="font-medium">Available Features:</div>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Mock Mode:</strong> 25 sample options with simulated alerts</li>
                <li><strong>Live Mode:</strong> Real Yahoo Finance data for GOOGL, SPY, SHLD</li>
                <li>Automated volume spike detection (10% threshold)</li>
                <li>Auto-refresh every 5 minutes (live mode)</li>
                <li>Full analytics with IV curves and Greek distributions</li>
                <li>CSV export functionality for all data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Configuration */}
      <div className="bg-[#13182b] rounded-lg border border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Alert Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Volume Alert Threshold (%)
            </label>
            <input
              type="number"
              value={config.volAlertThreshold}
              onChange={(e) => setConfig({ ...config, volAlertThreshold: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-orange-500"
              min="1"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Trigger alert when volume increases by this percentage
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Days to Expiry Filter
            </label>
            <input
              type="number"
              value={config.daysToExpiry}
              onChange={(e) => setConfig({ ...config, daysToExpiry: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-orange-500"
              min="1"
              max="30"
            />
            <p className="text-xs text-gray-500 mt-1">
              Only monitor options expiring within this many days
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0a0e1a] rounded-lg border border-gray-800">
            <div>
              <div className="text-sm font-medium text-gray-200">Enable Telegram Notifications</div>
              <div className="text-xs text-gray-500">Send alerts to configured Telegram chat</div>
            </div>
            <button
              onClick={() => setConfig({ ...config, telegramEnabled: !config.telegramEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.telegramEnabled ? 'bg-orange-600' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.telegramEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Configuration */}
      <div className="bg-[#13182b] rounded-lg border border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Dashboard Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Auto-refresh Interval (seconds)
            </label>
            <input
              type="number"
              value={config.refreshInterval}
              onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-orange-500"
              min="10"
              max="300"
            />
            <p className="text-xs text-gray-500 mt-1">
              How often to refresh data automatically (10-300 seconds)
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0a0e1a] rounded-lg border border-gray-800">
            <div>
              <div className="text-sm font-medium text-gray-200">Enable Auto-refresh</div>
              <div className="text-xs text-gray-500">Automatically fetch latest data</div>
            </div>
            <button
              onClick={() => setConfig({ ...config, autoRefresh: !config.autoRefresh })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.autoRefresh ? 'bg-orange-600' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Python Script Info */}
      <div className="bg-[#13182b] rounded-lg border border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Python Backend Integration</h3>
        </div>
        
        <div className="space-y-3 text-sm text-gray-300">
          <div className="p-4 bg-[#0a0e1a] rounded-lg border border-gray-800">
            <div className="font-medium text-white mb-2">Required Database Tables</div>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li><code className="text-orange-400">option_snapshot</code> - Daily options data snapshots</li>
              <li><code className="text-orange-400">volume_alert_log</code> - Volume spike alert records</li>
            </ul>
          </div>

          <div className="p-4 bg-[#0a0e1a] rounded-lg border border-gray-800">
            <div className="font-medium text-white mb-2">Python Script Setup</div>
            <ol className="list-decimal list-inside space-y-1 text-gray-400">
              <li>Install required packages: <code className="text-orange-400">xbbg, supabase-py, python-dotenv</code></li>
              <li>Configure <code className="text-orange-400">.env</code> with Supabase credentials</li>
              <li>Run daily via Windows Task Scheduler at market close (3:55 PM ET)</li>
              <li>Monitor logs for errors and Bloomberg API connectivity</li>
            </ol>
          </div>

          <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-300 mb-1">Important Note</div>
                <div className="text-sm text-blue-200">
                  This dashboard reads data from Supabase tables populated by your Python script. 
                  Make sure your Bloomberg machine is running the daily data collection before expecting data to appear here.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}