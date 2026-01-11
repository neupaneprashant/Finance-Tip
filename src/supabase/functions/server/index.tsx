import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Types matching frontend
interface OptionSnapshot {
  id: number;
  option_ticker: string;
  underlying_ticker: string;
  snapshot_date: string;
  expiry_date: string;
  strike: number;
  put_call: 'C' | 'P';
  bid: number;
  ask: number;
  last: number;
  mid: number;
  iv: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  volume: number;
  open_interest: number;
}

interface VolumeAlert {
  id: number;
  option_ticker: string;
  underlying_ticker: string;
  snapshot_date: string;
  current_volume: number;
  prior_volume: number;
  volume_pct_change: number;
  alert_timestamp: string;
  telegram_sent: boolean;
}

// Helper: Fetch options data from Yahoo Finance
async function fetchYahooOptions(symbol: string, maxDaysToExpiry: number = 7) {
  try {
    console.log(`Fetching options for ${symbol}...`);
    
    // Use Yahoo Finance v10 API endpoint (more reliable)
    const baseUrl = `https://query1.finance.yahoo.com/v7/finance/options/${symbol}`;
    
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data?.optionChain?.result?.[0]) {
      throw new Error(`No options data in response`);
    }
    
    const result = data.optionChain.result[0];
    const quote = result.quote;
    const spotPrice = quote.regularMarketPrice || quote.ask || 0;
    const expirations = result.expirationDates || [];
    
    console.log(`${symbol} spot: $${spotPrice.toFixed(2)}, ${expirations.length} expiration dates`);
    
    return {
      symbol,
      spotPrice,
      expirations,
    };
    
  } catch (error) {
    console.error(`Yahoo Finance API error for ${symbol}:`, error);
    throw error;
  }
}

// Helper: Calculate days to expiry
function daysToExpiry(expiryTimestamp: number): number {
  const now = Date.now() / 1000;
  const days = (expiryTimestamp - now) / 86400;
  return Math.ceil(days);
}

// Helper: Format option ticker in Bloomberg style
function formatOptionTicker(
  symbol: string,
  expiry: number,
  strike: number,
  type: 'C' | 'P'
): string {
  const date = new Date(expiry * 1000);
  const yy = date.getFullYear().toString().slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const strikeStr = String(Math.floor(strike * 1000)).padStart(8, '0');
  return `${symbol} ${yy}${mm}${dd}${type}${strikeStr}`;
}

// Helper: Calculate Greeks (simplified Black-Scholes approximations)
function calculateGreeks(
  spot: number,
  strike: number,
  daysToExp: number,
  iv: number,
  type: 'C' | 'P'
): { delta: number; gamma: number; theta: number; vega: number } {
  // Simplified calculations - real implementation would use proper Black-Scholes
  const timeToExp = daysToExp / 365;
  const moneyness = spot / strike;
  
  // Delta approximation
  let delta = 0;
  if (type === 'C') {
    delta = moneyness > 1 ? 0.5 + (moneyness - 1) * 0.3 : 0.5 * moneyness;
    delta = Math.min(Math.max(delta, 0.01), 0.99);
  } else {
    delta = moneyness < 1 ? -0.5 - (1 - moneyness) * 0.3 : -0.5 * (2 - moneyness);
    delta = Math.max(Math.min(delta, -0.01), -0.99);
  }
  
  // Gamma approximation (peaks at ATM)
  const atmFactor = Math.exp(-Math.pow((moneyness - 1) * 5, 2));
  const gamma = (0.1 + atmFactor * 0.15) / Math.sqrt(timeToExp + 0.01);
  
  // Theta approximation (time decay)
  const theta = -(iv * spot * 0.01) / (2 * Math.sqrt(timeToExp + 0.01));
  
  // Vega approximation
  const vega = spot * Math.sqrt(timeToExp) * 0.01 * atmFactor;
  
  return {
    delta: Number(delta.toFixed(3)),
    gamma: Number(gamma.toFixed(3)),
    theta: Number(theta.toFixed(2)),
    vega: Number(vega.toFixed(2))
  };
}

// Route: Fetch and store current options snapshots
app.post("/make-server-dd14d4af/fetch-options", async (c) => {
  try {
    const body = await c.req.json();
    const symbols = body.symbols || ['AAPL', 'TSLA', 'NVDA'];
    const maxDaysToExpiry = body.maxDaysToExpiry || 7;
    
    console.log(`Fetching options for symbols: ${symbols.join(', ')}`);
    
    const allSnapshots: OptionSnapshot[] = [];
    let snapshotId = 1;
    
    for (const symbol of symbols) {
      const optionData = await fetchYahooOptions(symbol, maxDaysToExpiry);
      
      if (!optionData) {
        console.log(`No data for ${symbol}, skipping`);
        continue;
      }
      
      const underlyingPrice = optionData.spotPrice || 0;
      const expirations = optionData.expirations || [];
      
      console.log(`${symbol} spot: $${underlyingPrice}, ${expirations.length} expiration dates`);
      
      for (const expiry of expirations) {
        const days = daysToExpiry(expiry);
        
        // Log expiry details for debugging
        const expiryDate = new Date(expiry * 1000);
        console.log(`  Expiry: ${expiryDate.toISOString().split('T')[0]}, Days to expiry: ${days}`);
        
        // Only process short-dated options (≤7 days) and skip expired options
        if (days > maxDaysToExpiry || days < 0) {
          console.log(`  Skipping - outside date range`);
          continue;
        }
        
        // Fetch options chain for this expiry
        const url = `https://query2.finance.yahoo.com/v7/finance/options/${symbol}?date=${expiry}`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://finance.yahoo.com/',
            'Origin': 'https://finance.yahoo.com'
          }
        });
        const chainData = await response.json();
        const contracts = chainData.optionChain?.result?.[0];
        
        if (!contracts) continue;
        
        const calls = contracts.options?.[0]?.calls || [];
        const puts = contracts.options?.[0]?.puts || [];
        
        // Process calls
        for (const call of calls) {
          const iv = (call.impliedVolatility || 0) * 100; // Convert to percentage
          const strike = call.strike || 0;
          const greeks = calculateGreeks(underlyingPrice, strike, days, iv, 'C');
          
          allSnapshots.push({
            id: snapshotId++,
            option_ticker: formatOptionTicker(symbol, expiry, strike, 'C'),
            underlying_ticker: `${symbol} US Equity`,
            snapshot_date: new Date().toISOString().split('T')[0],
            expiry_date: new Date(expiry * 1000).toISOString().split('T')[0],
            strike: strike,
            put_call: 'C',
            bid: call.bid || 0,
            ask: call.ask || 0,
            last: call.lastPrice || 0,
            mid: ((call.bid || 0) + (call.ask || 0)) / 2,
            iv: Number(iv.toFixed(1)),
            delta: greeks.delta,
            gamma: greeks.gamma,
            theta: greeks.theta,
            vega: greeks.vega,
            volume: call.volume || 0,
            open_interest: call.openInterest || 0
          });
        }
        
        // Process puts
        for (const put of puts) {
          const iv = (put.impliedVolatility || 0) * 100;
          const strike = put.strike || 0;
          const greeks = calculateGreeks(underlyingPrice, strike, days, iv, 'P');
          
          allSnapshots.push({
            id: snapshotId++,
            option_ticker: formatOptionTicker(symbol, expiry, strike, 'P'),
            underlying_ticker: `${symbol} US Equity`,
            snapshot_date: new Date().toISOString().split('T')[0],
            expiry_date: new Date(put.expiration * 1000).toISOString().split('T')[0],
            strike: strike,
            put_call: 'P',
            bid: put.bid || 0,
            ask: put.ask || 0,
            last: put.lastPrice || 0,
            mid: ((put.bid || 0) + (put.ask || 0)) / 2,
            iv: Number(iv.toFixed(1)),
            delta: greeks.delta,
            gamma: greeks.gamma,
            theta: greeks.theta,
            vega: greeks.vega,
            volume: put.volume || 0,
            open_interest: put.openInterest || 0
          });
        }
      }
    }
    
    console.log(`Fetched ${allSnapshots.length} total option contracts`);
    
    // Store current snapshots
    const snapshotKey = `snapshots:current`;
    await kv.set(snapshotKey, JSON.stringify(allSnapshots));
    
    return c.json({
      success: true,
      count: allSnapshots.length,
      snapshots: allSnapshots
    });
    
  } catch (error) {
    console.error('Error in fetch-options:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Route: Get current snapshots
app.get("/make-server-dd14d4af/get-snapshots", async (c) => {
  try {
    const snapshotKey = `snapshots:current`;
    const data = await kv.get(snapshotKey);
    
    if (!data) {
      return c.json({ success: true, snapshots: [] });
    }
    
    const snapshots = JSON.parse(data);
    return c.json({ success: true, snapshots });
    
  } catch (error) {
    console.error('Error in get-snapshots:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Route: Check for volume spikes and generate alerts
app.post("/make-server-dd14d4af/check-volume-spikes", async (c) => {
  try {
    const body = await c.req.json();
    const threshold = body.threshold || 10; // Default 10% threshold
    
    // Get current snapshots
    const currentData = await kv.get(`snapshots:current`);
    if (!currentData) {
      return c.json({ success: true, alerts: [] });
    }
    
    const currentSnapshots: OptionSnapshot[] = JSON.parse(currentData);
    
    // Get previous snapshots
    const previousData = await kv.get(`snapshots:previous`);
    const previousSnapshots: OptionSnapshot[] = previousData ? JSON.parse(previousData) : [];
    
    // Create lookup map for previous volumes
    const previousVolumeMap = new Map<string, number>();
    previousSnapshots.forEach(snap => {
      previousVolumeMap.set(snap.option_ticker, snap.volume);
    });
    
    // Generate alerts for volume spikes
    const alerts: VolumeAlert[] = [];
    let alertId = 1;
    
    for (const current of currentSnapshots) {
      const previousVolume = previousVolumeMap.get(current.option_ticker);
      
      if (previousVolume && previousVolume > 0) {
        const pctChange = ((current.volume - previousVolume) / previousVolume) * 100;
        
        if (pctChange >= threshold) {
          alerts.push({
            id: alertId++,
            option_ticker: current.option_ticker,
            underlying_ticker: current.underlying_ticker,
            snapshot_date: current.snapshot_date,
            current_volume: current.volume,
            prior_volume: previousVolume,
            volume_pct_change: Number(pctChange.toFixed(1)),
            alert_timestamp: new Date().toISOString(),
            telegram_sent: false
          });
        }
      }
    }
    
    // Sort alerts by % change descending
    alerts.sort((a, b) => b.volume_pct_change - a.volume_pct_change);
    
    // Store alerts
    if (alerts.length > 0) {
      const existingAlertsData = await kv.get(`alerts:history`);
      const existingAlerts: VolumeAlert[] = existingAlertsData ? JSON.parse(existingAlertsData) : [];
      
      // Append new alerts
      const updatedAlerts = [...alerts, ...existingAlerts];
      await kv.set(`alerts:history`, JSON.stringify(updatedAlerts));
    }
    
    // Move current to previous for next comparison
    await kv.set(`snapshots:previous`, currentData);
    
    console.log(`Generated ${alerts.length} volume spike alerts`);
    
    return c.json({ success: true, alerts });
    
  } catch (error) {
    console.error('Error in check-volume-spikes:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Route: Get all alerts
app.get("/make-server-dd14d4af/get-alerts", async (c) => {
  try {
    const alertsData = await kv.get(`alerts:history`);
    
    if (!alertsData) {
      return c.json({ success: true, alerts: [] });
    }
    
    const alerts = JSON.parse(alertsData);
    return c.json({ success: true, alerts });
    
  } catch (error) {
    console.error('Error in get-alerts:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Route: Clear all data (for testing)
app.delete("/make-server-dd14d4af/clear-data", async (c) => {
  try {
    await kv.del(`snapshots:current`);
    await kv.del(`snapshots:previous`);
    await kv.del(`alerts:history`);
    
    return c.json({ success: true, message: 'All data cleared' });
  } catch (error) {
    console.error('Error in clear-data:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Health check endpoint
app.get("/make-server-dd14d4af/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);