// Mock data for Finance@Tip dashboard demo

export interface OptionSnapshot {
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

export interface VolumeAlert {
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

// Generate mock option snapshots
export const mockOptionSnapshots: OptionSnapshot[] = [
  // GOOGL Calls
  {
    id: 1,
    option_ticker: 'GOOGL 240115C00175000',
    underlying_ticker: 'GOOGL US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-15',
    strike: 175.00,
    put_call: 'C',
    bid: 3.50,
    ask: 3.65,
    last: 3.58,
    mid: 3.575,
    iv: 32.5,
    delta: 0.62,
    gamma: 0.038,
    theta: -0.25,
    vega: 0.15,
    volume: 8450,
    open_interest: 12350
  },
  {
    id: 2,
    option_ticker: 'GOOGL 240115C00180000',
    underlying_ticker: 'GOOGL US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-15',
    strike: 180.00,
    put_call: 'C',
    bid: 1.85,
    ask: 1.95,
    last: 1.90,
    mid: 1.90,
    iv: 35.8,
    delta: 0.42,
    gamma: 0.045,
    theta: -0.28,
    vega: 0.18,
    volume: 15230,
    open_interest: 18940
  },
  {
    id: 3,
    option_ticker: 'GOOGL 240118C00172500',
    underlying_ticker: 'GOOGL US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-18',
    strike: 172.50,
    put_call: 'C',
    bid: 5.20,
    ask: 5.35,
    last: 5.28,
    mid: 5.275,
    iv: 28.9,
    delta: 0.71,
    gamma: 0.032,
    theta: -0.18,
    vega: 0.22,
    volume: 3280,
    open_interest: 8760
  },
  // GOOGL Puts
  {
    id: 4,
    option_ticker: 'GOOGL 240115P00170000',
    underlying_ticker: 'GOOGL US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-15',
    strike: 170.00,
    put_call: 'P',
    bid: 2.10,
    ask: 2.20,
    last: 2.15,
    mid: 2.15,
    iv: 30.2,
    delta: -0.38,
    gamma: 0.042,
    theta: -0.22,
    vega: 0.14,
    volume: 6840,
    open_interest: 11230
  },
  {
    id: 5,
    option_ticker: 'GOOGL 240118P00165000',
    underlying_ticker: 'GOOGL US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-18',
    strike: 165.00,
    put_call: 'P',
    bid: 1.45,
    ask: 1.55,
    last: 1.50,
    mid: 1.50,
    iv: 33.6,
    delta: -0.28,
    gamma: 0.038,
    theta: -0.19,
    vega: 0.16,
    volume: 4520,
    open_interest: 9850
  },
  // SPY Calls
  {
    id: 6,
    option_ticker: 'SPY 240112C00475000',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-12',
    strike: 475.00,
    put_call: 'C',
    bid: 4.25,
    ask: 4.35,
    last: 4.30,
    mid: 4.30,
    iv: 18.5,
    delta: 0.58,
    gamma: 0.155,
    theta: -0.82,
    vega: 0.08,
    volume: 28450,
    open_interest: 45230
  },
  {
    id: 7,
    option_ticker: 'SPY 240112C00477500',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-12',
    strike: 477.50,
    put_call: 'C',
    bid: 2.85,
    ask: 2.95,
    last: 2.90,
    mid: 2.90,
    iv: 19.8,
    delta: 0.45,
    gamma: 0.168,
    theta: -0.88,
    vega: 0.09,
    volume: 52180,
    open_interest: 38920
  },
  {
    id: 8,
    option_ticker: 'SPY 240115C00480000',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-15',
    strike: 480.00,
    put_call: 'C',
    bid: 2.15,
    ask: 2.25,
    last: 2.20,
    mid: 2.20,
    iv: 17.2,
    delta: 0.38,
    gamma: 0.095,
    theta: -0.45,
    vega: 0.12,
    volume: 18750,
    open_interest: 52340
  },
  // SPY Puts
  {
    id: 9,
    option_ticker: 'SPY 240112P00472500',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-12',
    strike: 472.50,
    put_call: 'P',
    bid: 3.15,
    ask: 3.25,
    last: 3.20,
    mid: 3.20,
    iv: 18.9,
    delta: -0.42,
    gamma: 0.162,
    theta: -0.85,
    vega: 0.08,
    volume: 41520,
    open_interest: 62850
  },
  {
    id: 10,
    option_ticker: 'SPY 240112P00470000',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-12',
    strike: 470.00,
    put_call: 'P',
    bid: 1.95,
    ask: 2.05,
    last: 2.00,
    mid: 2.00,
    iv: 20.1,
    delta: -0.35,
    gamma: 0.148,
    theta: -0.78,
    vega: 0.07,
    volume: 35280,
    open_interest: 48750
  },
  {
    id: 11,
    option_ticker: 'SPY 240115P00468000',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-15',
    strike: 468.00,
    put_call: 'P',
    bid: 2.55,
    ask: 2.65,
    last: 2.60,
    mid: 2.60,
    iv: 17.5,
    delta: -0.32,
    gamma: 0.088,
    theta: -0.42,
    vega: 0.11,
    volume: 22340,
    open_interest: 38950
  },
  {
    id: 12,
    option_ticker: 'SPY 240118P00465000',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-18',
    strike: 465.00,
    put_call: 'P',
    bid: 3.10,
    ask: 3.20,
    last: 3.15,
    mid: 3.15,
    iv: 16.8,
    delta: -0.30,
    gamma: 0.072,
    theta: -0.35,
    vega: 0.14,
    volume: 14520,
    open_interest: 42180
  },
  // Additional GOOGL options
  {
    id: 13,
    option_ticker: 'GOOGL 240112C00177500',
    underlying_ticker: 'GOOGL US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-12',
    strike: 177.50,
    put_call: 'C',
    bid: 2.25,
    ask: 2.40,
    last: 2.32,
    mid: 2.325,
    iv: 36.2,
    delta: 0.48,
    gamma: 0.125,
    theta: -0.68,
    vega: 0.09,
    volume: 12450,
    open_interest: 15820
  },
  {
    id: 14,
    option_ticker: 'GOOGL 240112P00172500',
    underlying_ticker: 'GOOGL US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-12',
    strike: 172.50,
    put_call: 'P',
    bid: 1.85,
    ask: 1.95,
    last: 1.90,
    mid: 1.90,
    iv: 34.8,
    delta: -0.40,
    gamma: 0.118,
    theta: -0.65,
    vega: 0.08,
    volume: 9850,
    open_interest: 13240
  },
  {
    id: 15,
    option_ticker: 'SPY 240117C00476000',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-17',
    strike: 476.00,
    put_call: 'C',
    bid: 3.45,
    ask: 3.55,
    last: 3.50,
    mid: 3.50,
    iv: 16.5,
    delta: 0.52,
    gamma: 0.082,
    theta: -0.38,
    vega: 0.13,
    volume: 19840,
    open_interest: 35670
  },
  // SHLD (Global X Defense) Calls
  {
    id: 16,
    option_ticker: 'SHLD 240112C00034000',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-12',
    strike: 34.00,
    put_call: 'C',
    bid: 0.65,
    ask: 0.75,
    last: 0.70,
    mid: 0.70,
    iv: 24.3,
    delta: 0.54,
    gamma: 0.185,
    theta: -0.95,
    vega: 0.05,
    volume: 9850,
    open_interest: 6420
  },
  {
    id: 17,
    option_ticker: 'SHLD 240115C00035000',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-15',
    strike: 35.00,
    put_call: 'C',
    bid: 0.45,
    ask: 0.55,
    last: 0.50,
    mid: 0.50,
    iv: 26.8,
    delta: 0.38,
    gamma: 0.142,
    theta: -0.58,
    vega: 0.08,
    volume: 18920,
    open_interest: 12850
  },
  {
    id: 18,
    option_ticker: 'SHLD 240115C00033500',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-15',
    strike: 33.50,
    put_call: 'C',
    bid: 1.05,
    ask: 1.15,
    last: 1.10,
    mid: 1.10,
    iv: 22.5,
    delta: 0.68,
    gamma: 0.168,
    theta: -0.72,
    vega: 0.09,
    volume: 6340,
    open_interest: 8920
  },
  {
    id: 19,
    option_ticker: 'SHLD 240118C00036000',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-18',
    strike: 36.00,
    put_call: 'C',
    bid: 0.30,
    ask: 0.40,
    last: 0.35,
    mid: 0.35,
    iv: 28.2,
    delta: 0.28,
    gamma: 0.112,
    theta: -0.42,
    vega: 0.11,
    volume: 11450,
    open_interest: 15280
  },
  {
    id: 20,
    option_ticker: 'SHLD 240112C00033000',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-12',
    strike: 33.00,
    put_call: 'C',
    bid: 1.15,
    ask: 1.25,
    last: 1.20,
    mid: 1.20,
    iv: 21.8,
    delta: 0.72,
    gamma: 0.192,
    theta: -1.05,
    vega: 0.04,
    volume: 24680,
    open_interest: 18740
  },
  // SHLD Puts
  {
    id: 21,
    option_ticker: 'SHLD 240112P00033000',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-12',
    strike: 33.00,
    put_call: 'P',
    bid: 0.40,
    ask: 0.50,
    last: 0.45,
    mid: 0.45,
    iv: 23.1,
    delta: -0.28,
    gamma: 0.175,
    theta: -0.88,
    vega: 0.04,
    volume: 15280,
    open_interest: 9650
  },
  {
    id: 22,
    option_ticker: 'SHLD 240115P00032500',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-15',
    strike: 32.50,
    put_call: 'P',
    bid: 0.35,
    ask: 0.45,
    last: 0.40,
    mid: 0.40,
    iv: 25.4,
    delta: -0.24,
    gamma: 0.135,
    theta: -0.52,
    vega: 0.07,
    volume: 8920,
    open_interest: 11430
  },
  {
    id: 23,
    option_ticker: 'SHLD 240115P00034000',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-15',
    strike: 34.00,
    put_call: 'P',
    bid: 0.80,
    ask: 0.90,
    last: 0.85,
    mid: 0.85,
    iv: 24.7,
    delta: -0.46,
    gamma: 0.158,
    theta: -0.68,
    vega: 0.08,
    volume: 32150,
    open_interest: 22840
  },
  {
    id: 24,
    option_ticker: 'SHLD 240118P00033500',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-18',
    strike: 33.50,
    put_call: 'P',
    bid: 0.65,
    ask: 0.75,
    last: 0.70,
    mid: 0.70,
    iv: 23.9,
    delta: -0.36,
    gamma: 0.122,
    theta: -0.48,
    vega: 0.10,
    volume: 19640,
    open_interest: 16520
  },
  {
    id: 25,
    option_ticker: 'SHLD 240112P00034500',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    expiry_date: '2024-01-12',
    strike: 34.50,
    put_call: 'P',
    bid: 0.95,
    ask: 1.05,
    last: 1.00,
    mid: 1.00,
    iv: 26.5,
    delta: -0.52,
    gamma: 0.188,
    theta: -1.02,
    vega: 0.05,
    volume: 7850,
    open_interest: 5920
  }
];

// Generate mock volume alerts
export const mockVolumeAlerts: VolumeAlert[] = [
  {
    id: 1,
    option_ticker: 'SPY 240112C00477500',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 52180,
    prior_volume: 28450,
    volume_pct_change: 83.4,
    alert_timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 min ago
    telegram_sent: true
  },
  {
    id: 2,
    option_ticker: 'GOOGL 240115C00180000',
    underlying_ticker: 'GOOGL US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 15230,
    prior_volume: 8920,
    volume_pct_change: 70.7,
    alert_timestamp: new Date(Date.now() - 18 * 60000).toISOString(), // 18 min ago
    telegram_sent: true
  },
  {
    id: 3,
    option_ticker: 'SPY 240112P00472500',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 41520,
    prior_volume: 25680,
    volume_pct_change: 61.7,
    alert_timestamp: new Date(Date.now() - 32 * 60000).toISOString(), // 32 min ago
    telegram_sent: true
  },
  {
    id: 4,
    option_ticker: 'SPY 240115C00480000',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 18750,
    prior_volume: 11820,
    volume_pct_change: 58.6,
    alert_timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 min ago
    telegram_sent: true
  },
  {
    id: 5,
    option_ticker: 'GOOGL 240112C00177500',
    underlying_ticker: 'GOOGL US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 12450,
    prior_volume: 8320,
    volume_pct_change: 49.6,
    alert_timestamp: new Date(Date.now() - 67 * 60000).toISOString(), // 1h 7min ago
    telegram_sent: true
  },
  {
    id: 6,
    option_ticker: 'SPY 240112P00470000',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 35280,
    prior_volume: 24150,
    volume_pct_change: 46.1,
    alert_timestamp: new Date(Date.now() - 92 * 60000).toISOString(), // 1h 32min ago
    telegram_sent: true
  },
  {
    id: 7,
    option_ticker: 'SPY 240115P00468000',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 22340,
    prior_volume: 16580,
    volume_pct_change: 34.7,
    alert_timestamp: new Date(Date.now() - 125 * 60000).toISOString(), // 2h 5min ago
    telegram_sent: true
  },
  {
    id: 8,
    option_ticker: 'GOOGL 240115C00175000',
    underlying_ticker: 'GOOGL US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 8450,
    prior_volume: 6350,
    volume_pct_change: 33.1,
    alert_timestamp: new Date(Date.now() - 158 * 60000).toISOString(), // 2h 38min ago
    telegram_sent: true
  },
  {
    id: 9,
    option_ticker: 'SPY 240117C00476000',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 19840,
    prior_volume: 15120,
    volume_pct_change: 31.2,
    alert_timestamp: new Date(Date.now() - 182 * 60000).toISOString(), // 3h 2min ago
    telegram_sent: true
  },
  {
    id: 10,
    option_ticker: 'SPY 240118P00465000',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 14520,
    prior_volume: 11850,
    volume_pct_change: 22.5,
    alert_timestamp: new Date(Date.now() - 215 * 60000).toISOString(), // 3h 35min ago
    telegram_sent: false
  },
  {
    id: 11,
    option_ticker: 'GOOGL 240115P00170000',
    underlying_ticker: 'GOOGL US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 6840,
    prior_volume: 5620,
    volume_pct_change: 21.7,
    alert_timestamp: new Date(Date.now() - 248 * 60000).toISOString(), // 4h 8min ago
    telegram_sent: false
  },
  {
    id: 12,
    option_ticker: 'SPY 240112C00475000',
    underlying_ticker: 'SPY US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 28450,
    prior_volume: 23820,
    volume_pct_change: 19.4,
    alert_timestamp: new Date(Date.now() - 285 * 60000).toISOString(), // 4h 45min ago
    telegram_sent: false
  },
  // SHLD (Global X Defense) Alerts
  {
    id: 13,
    option_ticker: 'SHLD 240115P00034000',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 32150,
    prior_volume: 17850,
    volume_pct_change: 80.1,
    alert_timestamp: new Date(Date.now() - 12 * 60000).toISOString(), // 12 min ago
    telegram_sent: true
  },
  {
    id: 14,
    option_ticker: 'SHLD 240112C00033000',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 24680,
    prior_volume: 14250,
    volume_pct_change: 73.2,
    alert_timestamp: new Date(Date.now() - 38 * 60000).toISOString(), // 38 min ago
    telegram_sent: true
  },
  {
    id: 15,
    option_ticker: 'SHLD 240118P00033500',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 19640,
    prior_volume: 11480,
    volume_pct_change: 71.1,
    alert_timestamp: new Date(Date.now() - 54 * 60000).toISOString(), // 54 min ago
    telegram_sent: true
  },
  {
    id: 16,
    option_ticker: 'SHLD 240115C00035000',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 18920,
    prior_volume: 11240,
    volume_pct_change: 68.4,
    alert_timestamp: new Date(Date.now() - 78 * 60000).toISOString(), // 1h 18min ago
    telegram_sent: true
  },
  {
    id: 17,
    option_ticker: 'SHLD 240112P00033000',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 15280,
    prior_volume: 9820,
    volume_pct_change: 55.6,
    alert_timestamp: new Date(Date.now() - 112 * 60000).toISOString(), // 1h 52min ago
    telegram_sent: true
  },
  {
    id: 18,
    option_ticker: 'SHLD 240118C00036000',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 11450,
    prior_volume: 7380,
    volume_pct_change: 55.1,
    alert_timestamp: new Date(Date.now() - 145 * 60000).toISOString(), // 2h 25min ago
    telegram_sent: true
  },
  {
    id: 19,
    option_ticker: 'SHLD 240112C00034000',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 9850,
    prior_volume: 6420,
    volume_pct_change: 53.4,
    alert_timestamp: new Date(Date.now() - 192 * 60000).toISOString(), // 3h 12min ago
    telegram_sent: true
  },
  {
    id: 20,
    option_ticker: 'SHLD 240115P00032500',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 8920,
    prior_volume: 6180,
    volume_pct_change: 44.3,
    alert_timestamp: new Date(Date.now() - 228 * 60000).toISOString(), // 3h 48min ago
    telegram_sent: true
  },
  {
    id: 21,
    option_ticker: 'SHLD 240112P00034500',
    underlying_ticker: 'SHLD US Equity',
    snapshot_date: '2024-01-11',
    current_volume: 7850,
    prior_volume: 5520,
    volume_pct_change: 42.2,
    alert_timestamp: new Date(Date.now() - 268 * 60000).toISOString(), // 4h 28min ago
    telegram_sent: true
  }
];