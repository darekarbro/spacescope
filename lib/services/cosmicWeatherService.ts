/**
 * Cosmic Weather Service
 * Handles all API calls related to space weather data
 */

import { WEATHER_ENDPOINTS } from '@/lib/api/endpoints';
import { 
  CosmicWeatherData, 
  CosmicWeatherSummary, 
  CosmicWeatherIndicators,
  SolarActivityResponse, 
  AuroraResponse,
  RefreshResponse,
} from '@/types/weather';

/**
 * Fetch complete cosmic weather data
 * Used for SSR on the cosmic weather page
 */
export async function getCosmicWeather(): Promise<CosmicWeatherData | null> {
  try {
    const res = await fetch(WEATHER_ENDPOINTS.FULL, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch cosmic weather:', res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching cosmic weather:', error);
    return null;
  }
}

/**
 * Fetch cosmic weather summary (lightweight)
 */
export async function getCosmicWeatherSummary(): Promise<CosmicWeatherSummary | null> {
  try {
    const res = await fetch(WEATHER_ENDPOINTS.SUMMARY, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch cosmic weather summary:', res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching cosmic weather summary:', error);
    return null;
  }
}

/**
 * Fetch all weather indicators with metadata
 */
export async function getWeatherIndicators(): Promise<CosmicWeatherIndicators | null> {
  try {
    const res = await fetch(WEATHER_ENDPOINTS.INDICATORS, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch weather indicators:', res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching weather indicators:', error);
    return null;
  }
}

/**
 * Fetch solar activity data only
 */
export async function getSolarActivity(): Promise<SolarActivityResponse | null> {
  try {
    const res = await fetch(WEATHER_ENDPOINTS.SOLAR, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch solar activity:', res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching solar activity:', error);
    return null;
  }
}

/**
 * Fetch aurora data only
 */
export async function getAuroraData(): Promise<AuroraResponse | null> {
  try {
    const res = await fetch(WEATHER_ENDPOINTS.AURORA, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch aurora data:', res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching aurora data:', error);
    return null;
  }
}

/**
 * Force refresh weather data from NOAA (requires auth in production)
 * This is typically an admin/scientist action
 */
export async function refreshWeatherData(): Promise<RefreshResponse | null> {
  try {
    const res = await fetch(WEATHER_ENDPOINTS.REFRESH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to refresh weather data:', res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error refreshing weather data:', error);
    return null;
  }
}

/**
 * Get mock cosmic weather data for development/fallback
 */
export function getMockCosmicWeather(): CosmicWeatherData {
  return {
    id: 1,
    kp_index: 5,
    solar_activity: {
      value: 5,
      status: 'High',
      emoji: '🔴',
      description: 'Kp index 5 or higher - Strong geomagnetic storm possible'
    },
    aurora_chance: {
      value: true,
      status: 'Yes',
      emoji: '🟢',
      description: 'Kp >= 5, Aurora visible at northern latitudes (55°+)',
      visible: true,
      best_time: '21:00-03:00 UTC',
      latitude_range: '55°N - 75°N'
    },
    radiation_level: {
      value: 'elevated',
      status: 'Alert',
      emoji: '🔴',
      description: 'Elevated radiation detected - Minor impact on satellites'
    },
    gps_impact: {
      value: 'normal',
      status: 'Normal',
      emoji: '🟢',
      description: 'GPS signals operating normally'
    },
    solar_wind_speed: 450.5,
    fetched_at: new Date().toISOString(),
    cache_age_minutes: 2,
    is_cached: true
  };
}
