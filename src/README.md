# Finance@Tip - Bloomberg Options Monitor

A production-quality dashboard for monitoring short-dated options and detecting volume spikes with **real-time Yahoo Finance data integration**.

## 🎯 Project Overview

**Finance@Tip** is a comprehensive options monitoring dashboard designed to track short-term options (≤7 days to expiry) for equity and ETF underlyings. The system features **live data integration** with Yahoo Finance API, automatic volume spike detection, and a professional Bloomberg-inspired UI.

## ✨ Features

### 🔴 **LIVE DATA MODE** (Yahoo Finance Integration)
- **Real-time options data** fetched directly from Yahoo Finance API
- **Automatic volume spike detection** comparing current vs previous snapshots
- **Auto-refresh** every 5 minutes with manual refresh option
- **Supabase backend** storing historical snapshots and alerts
- **Greeks calculation** using Black-Scholes approximations
- **No API key required** - Yahoo Finance is free and unrestricted

### 1. **Live Snapshot Table**
- Real-time options data with comprehensive Greeks (Delta, Gamma, Theta, Vega)
- Advanced filtering by underlying, option type (calls/puts)
- Sortable columns (Volume, IV, Delta, Gamma, Strike)
- Search functionality for quick option lookup
- CSV export for offline analysis
- **Toggle between Mock and Live data modes**

## 🚀 Tech Stack

### Frontend
- **React** - Component-based UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Hono** - Lightning-fast web framework (Deno runtime)
- **Supabase KV Store** - Key-value database for snapshots and alerts
- **Yahoo Finance API** - Free real-time options data (no auth required)
- **Deno Deploy** - Serverless edge functions

## 📁 Project Structure

```
finance-tip/
├── components/
│   ├── SnapshotTable.tsx     # Live options data table
│   ├── AlertFeed.tsx          # Real-time volume alerts
│   ├── Analytics.tsx          # Charts and analytics
│   ├── AlertHistory.tsx       # Alert audit log
│   └── Settings.tsx           # Configuration panel
├── supabase/functions/server/
│   ├── index.tsx              # Hono web server with API routes
│   └── kv_store.tsx           # Key-value database utilities
├── utils/
│   ├── mockData.ts            # Demo data generators
│   └── api.ts                 # API client for backend
├── App.tsx                    # Main application
└── README.md                  # This file
```

## 🎮 How to Use

### **Switching Between Mock and Live Data**

The dashboard has a control panel at the top with two modes:

1. **Mock Data (Demo)** - Uses pre-generated sample data
   - Perfect for testing UI features
   - Simulates real-time alerts every 30 seconds
   - No backend connection required

2. **Live Data (Yahoo Finance)** - Fetches real options data
   - Click "Live Data (Yahoo Finance)" button
   - System automatically fetches options for GOOGL, SPY, and SHLD
   - Auto-refreshes every 5 minutes
   - Manual refresh available via "Refresh Data" button

### **How Volume Spike Detection Works**

1. **First Fetch**: System pulls current options data and stores as baseline
2. **Subsequent Fetches**: Compares new volume against previous snapshot
3. **Alert Generation**: If volume increases >10%, creates alert
4. **Alert Severity**:
   - 🔴 **Critical** (>50% increase)
   - 🟠 **High** (30-50% increase)
   - 🟡 **Medium** (<30% increase)

### **API Endpoints**

The backend provides these routes:

- `POST /make-server-dd14d4af/fetch-options` - Fetch options from Yahoo Finance
- `GET /make-server-dd14d4af/get-snapshots` - Retrieve current snapshots
- `POST /make-server-dd14d4af/check-volume-spikes` - Detect volume spikes
- `GET /make-server-dd14d4af/get-alerts` - Get alert history
- `DELETE /make-server-dd14d4af/clear-data` - Clear all stored data

## 🔄 Future Enhancements

### Potential Upgrades:
1. **Bloomberg Terminal Integration** 
   - Replace Yahoo Finance with xbbg for more accurate data
   - Access to full Bloomberg option chain data
   - Professional-grade Greeks from Bloomberg models

2. **Advanced Features**
   - Email/SMS notifications via Twilio
   - Custom watchlists for specific underlyings
   - Historical charting of IV and volume trends
   - Options strategy scanner (spreads, straddles, etc.)
   - Real-time P&L tracking

3. **Database Migration**
   - Move from KV store to PostgreSQL tables
   - Better query performance for historical analysis
   - Support for larger datasets

## 📈 Demo Mode Features

✅ **Dual-mode system**: Toggle between Mock and Live data  
✅ **Live Yahoo Finance integration**: Real options data for GOOGL, SPY, SHLD  
✅ **Automated volume spike detection**: 10% threshold with severity levels  
✅ **Full-stack implementation**: React frontend + Hono/Deno backend  
✅ **Real-time alert simulations**: New alerts every 30 seconds (mock mode)  
✅ **Interactive charts and analytics**: IV curves, volume distribution, Greeks  
✅ **CSV export functionality**: Export snapshots and alert history  
✅ **Responsive design**: Works on desktop, tablet, mobile  
✅ **Professional Bloomberg-inspired styling**: Dark theme with financial data focus