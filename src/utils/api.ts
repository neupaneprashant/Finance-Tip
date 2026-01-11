// API service for Finance@Tip backend
import { projectId, publicAnonKey } from './supabase/info';
import { OptionSnapshot, VolumeAlert } from './mockData';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-dd14d4af`;

// Helper to make authenticated requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Fetch options data from Yahoo Finance and store
export async function fetchOptions(
  symbols: string[] = ['GOOGL', 'SPY', 'SHLD'],
  maxDaysToExpiry: number = 7
): Promise<{ success: boolean; count: number; snapshots: OptionSnapshot[] }> {
  return apiRequest('/fetch-options', {
    method: 'POST',
    body: JSON.stringify({ symbols, maxDaysToExpiry }),
  });
}

// Get current snapshots
export async function getSnapshots(): Promise<{ success: boolean; snapshots: OptionSnapshot[] }> {
  return apiRequest('/get-snapshots');
}

// Check for volume spikes
export async function checkVolumeSpikes(
  threshold: number = 10
): Promise<{ success: boolean; alerts: VolumeAlert[] }> {
  return apiRequest('/check-volume-spikes', {
    method: 'POST',
    body: JSON.stringify({ threshold }),
  });
}

// Get all alerts
export async function getAlerts(): Promise<{ success: boolean; alerts: VolumeAlert[] }> {
  return apiRequest('/get-alerts');
}

// Clear all data (for testing)
export async function clearData(): Promise<{ success: boolean; message: string }> {
  return apiRequest('/clear-data', {
    method: 'DELETE',
  });
}

// Health check
export async function healthCheck(): Promise<{ status: string }> {
  return apiRequest('/health');
}
