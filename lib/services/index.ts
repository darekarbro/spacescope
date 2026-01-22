/**
 * Service Layer - Data transformation & business logic
 * Abstracts API responses from components
 */

import { api } from "@/lib/api/client";
import {
  EVENTS_ENDPOINTS,
  WEATHER_ENDPOINTS,
  MISSIONS_ENDPOINTS,
} from "@/lib/api/endpoints";
import {
  Event,
  CreateEventDTO,
  EventFilters,
  Mission,
  CosmicWeatherData,
} from "@/types";

// Events Service
export const eventService = {
  async getUpcomingEvents(filters?: EventFilters) {
    const params = new URLSearchParams();
    if (filters?.event_type) params.append("event_type", filters.event_type);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);

    const url = `${EVENTS_ENDPOINTS.LIST}${params.toString() ? "?" + params : ""}`;
    return api.get<Event[]>(url);
  },

  async getEventDetail(id: string) {
    return api.get<Event>(EVENTS_ENDPOINTS.DETAIL(id));
  },

  async createEvent(data: CreateEventDTO) {
    return api.post<Event>(EVENTS_ENDPOINTS.CREATE, data);
  },

  async updateEvent(id: string, data: Partial<CreateEventDTO>) {
    return api.patch<Event>(EVENTS_ENDPOINTS.UPDATE(id), data);
  },

  async deleteEvent(id: string) {
    return api.delete(EVENTS_ENDPOINTS.DELETE(id));
  },

  async getMySubmissions() {
    return api.get<Event[]>(EVENTS_ENDPOINTS.MY_SUBMISSIONS);
  },

  async getPendingEvents() {
    return api.get<Event[]>(EVENTS_ENDPOINTS.PENDING);
  },

  async approveEvent(id: string) {
    return api.post(EVENTS_ENDPOINTS.APPROVE(id));
  },

  async rejectEvent(id: string) {
    return api.post(EVENTS_ENDPOINTS.REJECT(id));
  },
};

// Cosmic Weather Service
export const weatherService = {
  async getCurrentWeather() {
    return api.get<CosmicWeatherData>(WEATHER_ENDPOINTS.CURRENT);
  },

  async getWeatherForecast(days: number = 7) {
    return api.get<CosmicWeatherData>(
      `${WEATHER_ENDPOINTS.FORECAST}?days=${days}`,
    );
  },

  async getAuroraForecast(latitude: number, longitude: number) {
    return api.get(
      `${WEATHER_ENDPOINTS.AURORA_FORECAST}?lat=${latitude}&lon=${longitude}`,
    );
  },

  async getSolarStorms() {
    return api.get(WEATHER_ENDPOINTS.SOLAR_STORMS);
  },

  async getRadiationAlerts() {
    return api.get(WEATHER_ENDPOINTS.RADIATION_ALERTS);
  },
};

// Missions Service
export const missionService = {
  async getAllMissions() {
    return api.get<Mission[]>(MISSIONS_ENDPOINTS.LIST);
  },

  async getMissionDetail(id: string) {
    return api.get<Mission>(MISSIONS_ENDPOINTS.DETAIL(id));
  },

  async getMissionTimeline() {
    return api.get(MISSIONS_ENDPOINTS.TIMELINE);
  },
};
