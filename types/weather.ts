export interface SolarStormAlert {
  id: string;
  level: 'G1' | 'G2' | 'G3' | 'G4' | 'G5'; // Geomagnetic storm scale
  timestamp: string;
  expected_impact_time?: string;
  description: string;
  kp_index: number; // 0-9
  solar_flux?: number;
}

export interface AuroraForecast {
  location: string;
  latitude: number;
  longitude: number;
  forecast_date: string;
  probability: number; // 0-100
  intensity: 'low' | 'medium' | 'high' | 'very_high';
  best_time?: string; // Time window for viewing
  cloud_cover?: number; // 0-100
}

export interface RadiationAlert {
  id: string;
  type: 'solar_radiation' | 'cosmic_ray' | 'particle_event';
  timestamp: string;
  intensity_level: number; // 1-5
  affected_satellites?: string[];
  description: string;
}

export interface CosmicWeatherData {
  last_updated: string;
  solar_storms: SolarStormAlert[];
  aurora_forecasts: AuroraForecast[];
  radiation_alerts: RadiationAlert[];
  kp_index_current: number;
  solar_flux_current: number;
  space_weather_summary: string;
}
