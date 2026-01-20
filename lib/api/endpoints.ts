/**
 * API Endpoints Contract
 * Maps to Django backend routes
 * Update this file when backend APIs change
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE}/api/auth/login/`,
  SIGNUP: `${API_BASE}/api/auth/signup/`,
  LOGOUT: `${API_BASE}/api/auth/logout/`,
  REFRESH: `${API_BASE}/api/auth/refresh/`,
  ME: `${API_BASE}/api/auth/me/`,
};

// Events Endpoints
export const EVENTS_ENDPOINTS = {
  LIST: `${API_BASE}/api/events/`,
  CREATE: `${API_BASE}/api/events/`,
  DETAIL: (id: string) => `${API_BASE}/api/events/${id}/`,
  UPDATE: (id: string) => `${API_BASE}/api/events/${id}/`,
  DELETE: (id: string) => `${API_BASE}/api/events/${id}/`,
  MY_SUBMISSIONS: `${API_BASE}/api/events/my-submissions/`,
  PENDING: `${API_BASE}/api/events/pending/`,
  APPROVE: (id: string) => `${API_BASE}/api/events/${id}/approve/`,
  REJECT: (id: string) => `${API_BASE}/api/events/${id}/reject/`,
};

// Cosmic Weather Endpoints
export const WEATHER_ENDPOINTS = {
  CURRENT: `${API_BASE}/api/cosmic-weather/current/`,
  FORECAST: `${API_BASE}/api/cosmic-weather/forecast/`,
  AURORA_FORECAST: `${API_BASE}/api/cosmic-weather/aurora/`,
  SOLAR_STORMS: `${API_BASE}/api/cosmic-weather/solar-storms/`,
  RADIATION_ALERTS: `${API_BASE}/api/cosmic-weather/radiation-alerts/`,
};

// Missions Endpoints
export const MISSIONS_ENDPOINTS = {
  LIST: `${API_BASE}/api/v1/missions/`,
  DETAIL: (id: string) => `${API_BASE}/api/v1/missions/${id}/`,
  TIMELINE: `${API_BASE}/api/v1/missions/timeline/`,
};

// Earth Impact / Satellite Data Endpoints
export const EARTH_IMPACT_ENDPOINTS = {
  AGRICULTURE: `${API_BASE}/api/satellite-data/agriculture/`,
  CLIMATE: `${API_BASE}/api/satellite-data/climate/`,
  DISASTERS: `${API_BASE}/api/satellite-data/disasters/`,
  POLLUTION: `${API_BASE}/api/satellite-data/pollution/`,
};

// Learning Zone Endpoints
export const LEARNING_ENDPOINTS = {
  QUIZZES: `${API_BASE}/api/learning/quizzes/`,
  QUIZ_DETAIL: (id: string) => `${API_BASE}/api/learning/quizzes/${id}/`,
  QUIZ_SUBMIT: (id: string) => `${API_BASE}/api/learning/quizzes/${id}/submit/`,
  INFOGRAPHICS: `${API_BASE}/api/learning/infographics/`,
  CARDS: `${API_BASE}/api/learning/cards/`,
};

// Admin Endpoints
export const ADMIN_ENDPOINTS = {
  DASHBOARD: `${API_BASE}/api/admin/dashboard/`,
  PENDING_EVENTS: `${API_BASE}/api/admin/events/pending/`,
  MANAGE_SCIENTISTS: `${API_BASE}/api/admin/scientists/`,
  APPROVE_EVENT: (id: string) => `${API_BASE}/api/admin/events/${id}/approve/`,
  REJECT_EVENT: (id: string) => `${API_BASE}/api/admin/events/${id}/reject/`,
};

// External APIs (NASA, etc)
export const EXTERNAL_APIS = {
  NASA_KEY: process.env.NEXT_PUBLIC_NASA_API_KEY,
  NASA_BASE: 'https://api.nasa.gov',
  NASA_EVENTS: 'https://api.nasa.gov/planetary/earth/events',
  SPACE_WEATHER: 'https://api.nasa.gov/planetary/geomag',
};
