// Status levels for cosmic weather indicators
export type WeatherStatus = 'Low' | 'Medium' | 'High' | 'Yes' | 'No' | 'Safe' | 'Alert' | 'Normal' | 'Disturbed';
export type WeatherLevel = 'green' | 'yellow' | 'red';

// Base indicator structure
export interface WeatherIndicator {
  value?: number | string | boolean;
  status: string;
  level: WeatherLevel;
  emoji: string;
  description?: string;
}

// Solar Activity indicator
export interface SolarActivityIndicator {
  value: number;
  status: 'Low' | 'Medium' | 'High';
  level: WeatherLevel;
  emoji: string;
  description?: string;
}

// Aurora indicator
export interface AuroraIndicator {
  visible: boolean;
  status: 'Yes' | 'No';
  level: WeatherLevel;
  emoji: string;
  description?: string;
}

// Radiation indicator
export interface RadiationIndicator {
  value: string;
  status: 'Safe' | 'Alert';
  level: WeatherLevel;
  emoji: string;
  description?: string;
}

// GPS Impact indicator
export interface GpsIndicator {
  status: 'Normal' | 'Disturbed';
  level: WeatherLevel;
  emoji: string;
  description?: string;
}

// Complete Cosmic Weather response (inner data object)
export interface CosmicWeatherData {
  kp_index: number;
  solar_activity: SolarActivityIndicator;
  aurora_chance: AuroraIndicator;
  radiation: RadiationIndicator;
  gps_impact: GpsIndicator;
  solar_wind_speed: number | null;
  last_updated: string | null;
  data_source: string;
  cache_source?: string;
  success?: boolean;
}

// API Response wrapper
export interface CosmicWeatherApiResponse {
  success: boolean;
  data: CosmicWeatherData;
  message: string;
}

// Summary response (from /api/v1/cosmic-weather/summary/)
export interface CosmicWeatherSummary {
  solar_activity: string;
  aurora_chance: string;
  radiation_level: string;
  gps_impact: string;
  kp_index: number;
  fetched_at: string;
}

// Indicators list response (from /api/v1/cosmic-weather/indicators/)
export interface CosmicWeatherIndicators {
  indicators: Array<{
    name: string;
    display_name: string;
    description: string;
    value: number | string | boolean;
    status: string;
    emoji: string;
    level?: WeatherLevel;
  }>;
  total_indicators: number;
  last_update: string;
}

// Solar endpoint response (from /api/v1/cosmic-weather/solar/)
export interface SolarActivityResponse {
  solar_activity: SolarActivityIndicator;
  fetched_at: string;
  cache_age_minutes: number;
}

// Aurora endpoint response (from /api/v1/cosmic-weather/aurora/)
export interface AuroraResponse {
  aurora_chance: AuroraIndicator;
  fetched_at: string;
  cache_age_minutes: number;
}

// Refresh response (from POST /api/v1/cosmic-weather/refresh/)
export interface RefreshResponse {
  message: string;
  status: string;
  data: CosmicWeatherData;
  fetch_time_ms: number;
}

// Legacy types for backward compatibility
export interface SolarStormAlert {
  id: string;
  level: 'G1' | 'G2' | 'G3' | 'G4' | 'G5';
  timestamp: string;
  expected_impact_time?: string;
  description: string;
  kp_index: number;
  solar_flux?: number;
}

export interface AuroraForecast {
  location: string;
  latitude: number;
  longitude: number;
  forecast_date: string;
  probability: number;
  intensity: 'low' | 'medium' | 'high' | 'very_high';
  best_time?: string;
  cloud_cover?: number;
}

export interface RadiationAlert {
  id: string;
  type: 'solar_radiation' | 'cosmic_ray' | 'particle_event';
  timestamp: string;
  intensity_level: number;
  affected_satellites?: string[];
  description: string;
}
