import { EVENTS_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  Event,
  CreateEventDTO,
  UpdateEventDTO,
  EventType,
  EventStatus,
} from "@/types/event";

// Extended event type used by UI when likes or extra fields are attached
export type EventWithLikes = Event & {
  likes_count?: number;
  has_liked?: boolean;
  user_has_liked?: boolean;
  type?: string; // Alias for event_type for compatibility
};

export interface EventFilters {
  event_type?: EventType;
  status?: EventStatus;
  search?: string;
  tags?: string;
  sort_by?: string;
}

export interface EventListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

export interface LikeResponse {
  action: "liked" | "unliked";
  likes_count: number;
  has_liked: boolean;
}

export interface LikeStatusResponse {
  likes_count: number;
  has_liked: boolean;
  user_id: string;
}

export const eventService = {
  /**
   * Get all events with pagination and filters
   */
  getAll: async (
    limit = 50,
    offset = 0,
    filters: Record<string, string> = {},
  ): Promise<EventListResponse> => {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const response = await fetch(`${EVENTS_ENDPOINTS.LIST}?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    const result = await response.json();

    // Handle both wrapped and unwrapped responses
    if (result.success !== undefined) {
      return {
        count: result.count || result.data?.length || 0,
        next: result.next || null,
        previous: result.previous || null,
        results: result.data || [],
      };
    }

    return {
      count: result.count || result.results?.length || 0,
      next: result.next || null,
      previous: result.previous || null,
      results: result.results || result || [],
    };
  },

  /**
   * Get single event by ID
   */
  getById: async (id: number | string): Promise<Event> => {
    const response = await fetch(EVENTS_ENDPOINTS.DETAIL(String(id)));

    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }

    const result = await response.json();

    // Handle both wrapped and unwrapped responses
    return result.data || result;
  },

  /**
   * Create new event
   */
  create: async (data: CreateEventDTO): Promise<Event> => {
    const response = await fetch(EVENTS_ENDPOINTS.CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    const result = await response.json();
    return result.data || result;
  },

  /**
   * Update event (full update)
   */
  update: async (id: number | string, data: UpdateEventDTO): Promise<Event> => {
    const response = await fetch(EVENTS_ENDPOINTS.UPDATE(String(id)), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update event");
    }

    const result = await response.json();
    return result.data || result;
  },

  /**
   * Update event (partial update)
   */
  patch: async (
    id: number | string,
    data: Partial<UpdateEventDTO>,
  ): Promise<Event> => {
    const response = await fetch(EVENTS_ENDPOINTS.PATCH(String(id)), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update event");
    }

    const result = await response.json();
    return result.data || result;
  },

  /**
   * Delete event
   */
  delete: async (id: number | string): Promise<void> => {
    const response = await fetch(EVENTS_ENDPOINTS.DELETE(String(id)), {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }
  },

  /**
   * Get upcoming events
   */
  getUpcoming: async (days = 30, limit = 20, type = ""): Promise<Event[]> => {
    const params = new URLSearchParams({
      days: String(days),
      limit: String(limit),
    });

    if (type) {
      params.append("event_type", type);
    }

    const response = await fetch(`${EVENTS_ENDPOINTS.UPCOMING}?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch upcoming events");
    }

    const result = await response.json();

    // Handle both wrapped and unwrapped responses
    if (result.data) return result.data;
    if (result.results) return result.results;
    return result;
  },

  /**
   * Like/Unlike event (toggle)
   */
  toggleLike: async (
    eventId: number | string,
    userId: string,
  ): Promise<LikeResponse> => {
    const response = await fetch(EVENTS_ENDPOINTS.LIKE(String(eventId)), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle like");
    }

    const result = await response.json();
    return result.data || result;
  },

  /**
   * Get like status for an event
   */
  getLikeStatus: async (
    eventId: number | string,
    userId: string,
  ): Promise<LikeStatusResponse> => {
    const params = new URLSearchParams({ user_id: userId });
    const response = await fetch(
      `${EVENTS_ENDPOINTS.LIKE(String(eventId))}?${params}`,
    );

    if (!response.ok) {
      throw new Error("Failed to get like status");
    }

    const result = await response.json();
    return result.data || result;
  },
};
