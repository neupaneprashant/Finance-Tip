// Client-side Yahoo Finance fetcher (bypasses server-side 401 errors)
import { OptionSnapshot } from './mockData';

interface YahooOption {
  contractSymbol: string;
  strike: number;
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
}

interface YahooOptionsResponse {
  optionChain: {
    result: Array<{
      quote: {
        regularMarketPrice: number;
        symbol: string;
      };
      expirationDates: number[];
      options?: Array<{
        expirationDate: number;
        calls: YahooOption[];
        puts: YahooOption[];
      }>;
    }>;
  };
}

// Fetch options data directly from browser (avoids 401 errors)
export async function fetchOptionsFromBrowser(
  symbols: string[],
  maxDaysToExpiry: number = 60
): Promise<OptionSnapshot[]> {
  const allSnapshots: OptionSnapshot[] = [];

  for (const symbol of symbols) {
    try {
      console.log(`Fetching options for ${symbol}...`);

      // Step 1: Get available expiration dates
      const response = await fetch(
        `https://query1.finance.yahoo.com/v7/finance/options/${symbol}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch ${symbol}: ${response.status}`);
        continue;
      }

      const data: YahooOptionsResponse = await response.json();
      const result = data.optionChain?.result?.[0];

      if (!result) {
        console.error(`No options data for ${symbol}`);
        continue;
      }

      const spotPrice = result.quote.regularMarketPrice;
      const expirations = result.expirationDates || [];

      console.log(`${symbol}: $${spotPrice.toFixed(2)}, ${expirations.length} expirations`);

      // Step 2: Filter expirations within date range
      const now = Date.now() / 1000;
      const maxExpiry = now + maxDaysToExpiry * 86400;

      const validExpirations = expirations.filter(exp => {
        const days = (exp - now) / 86400;
        return days >= 0 && days <= maxDaysToExpiry;
      });

      console.log(`  ${validExpirations.length} expirations within ${maxDaysToExpiry} days`);

      // Step 3: Fetch options for each valid expiration
      for (const expiry of validExpirations.slice(0, 5)) { // Limit to first 5 to avoid rate limits
        try {
          const expiryResponse = await fetch(
            `https://query1.finance.yahoo.com/v7/finance/options/${symbol}?date=${expiry}`,
            {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            }
          );

          if (!expiryResponse.ok) {
            console.error(`Failed to fetch options for ${symbol} expiry ${expiry}`);
            continue;
          }

          const expiryData: YahooOptionsResponse = await expiryResponse.json();
          const expiryResult = expiryData.optionChain?.result?.[0];

          if (!expiryResult?.options?.[0]) {
            continue;
          }

          const options = expiryResult.options[0];
          const expiryDate = new Date(expiry * 1000);

          // Process calls
          for (const call of options.calls || []) {
            if (call.volume > 0) {
              allSnapshots.push(createSnapshot(
                symbol,
                spotPrice,
                call,
                'C',
                expiryDate
              ));
            }
          }

          // Process puts
          for (const put of options.puts || []) {
            if (put.volume > 0) {
              allSnapshots.push(createSnapshot(
                symbol,
                spotPrice,
                put,
                'P',
                expiryDate
              ));
            }
          }
        } catch (err) {
          console.error(`Error fetching expiry ${expiry} for ${symbol}:`, err);
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error);
    }
  }

  console.log(`Total options fetched: ${allSnapshots.length}`);
  return allSnapshots;
}

function createSnapshot(
  symbol: string,
  spotPrice: number,
  option: YahooOption,
  type: 'C' | 'P',
  expiryDate: Date
): OptionSnapshot {
  const mid = (option.bid + option.ask) / 2;
  
  return {
    id: option.contractSymbol,
    ticker: formatOptionTicker(symbol, expiryDate, option.strike, type),
    underlying: `${symbol} US Equity`,
    expiry: expiryDate.toISOString().split('T')[0],
    type,
    strike: option.strike,
    bid_ask_last: `${option.bid.toFixed(2)}/${option.ask.toFixed(2)}/${option.lastPrice.toFixed(2)}`,
    mid_price: mid,
    implied_vol: option.impliedVolatility * 100,
    delta: option.delta || (type === 'C' ? 0.5 : -0.5),
    gamma: option.gamma || 0.05,
    theta: option.theta || -0.05,
    vega: option.vega || 0.1,
    volume: option.volume,
    open_interest: option.openInterest,
    timestamp: new Date().toISOString(),
  };
}

function formatOptionTicker(
  symbol: string,
  expiry: Date,
  strike: number,
  type: 'C' | 'P'
): string {
  const yy = expiry.getFullYear().toString().slice(2);
  const mm = String(expiry.getMonth() + 1).padStart(2, '0');
  const dd = String(expiry.getDate()).padStart(2, '0');
  const strikeStr = String(Math.floor(strike * 1000)).padStart(8, '0');
  return `${symbol} ${yy}${mm}${dd}${type}${strikeStr}`;
}
