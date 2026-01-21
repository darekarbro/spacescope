import { EVENTS_ENDPOINTS } from '@/lib/api/endpoints';
import { Event } from '@/types/event';

export interface EventWithLikes extends Event {
  likes_count: number;
}

export interface EventFilters {
  type?: string;
  status?: string;
  search?: string;
  tags?: string;
  sort_by?: string;
}

export interface EventListResponse {
  success: boolean;
  count: number;
  next: string | null;
  previous: string | null;
  data: EventWithLikes[];
}

export interface EventResponse {
  success: boolean;
  data: EventWithLikes;
  message?: string;
}

export interface LikeResponse {
  success: boolean;
  data: {
    action: 'liked' | 'unliked';
    likes_count: number;
    has_liked: boolean;
  };
}

export interface LikeStatusResponse {
  success: boolean;
  data: {
    likes_count: number;
    has_liked: boolean;
    user_id: string;
  };
}

export const eventService = {
  /**
   * Get all events with pagination and filters
   */
  getAll: async (
    limit = 50,
    offset = 0,
    filters: EventFilters = {}
  ): Promise<EventWithLikes[]> => {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      ...filters,
    });

    const response = await fetch(`${EVENTS_ENDPOINTS.LIST}?${params}`);
    const result: EventListResponse = await response.json();

    if (!result.success) {
      throw new Error('Failed to fetch events');
    }

    return result.data;
  },

  /**
   * Get single event by ID
   */
  getById: async (id: string): Promise<EventWithLikes> => {
    const response = await fetch(EVENTS_ENDPOINTS.DETAIL(id));
    const result: EventResponse = await response.json();

    if (!result.success) {
      throw new Error('Failed to fetch event');
    }

    return result.data;
  },

  /**
   * Create new event
   */
  create: async (data: Partial<Event>): Promise<EventWithLikes> => {
    const response = await fetch(EVENTS_ENDPOINTS.CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result: EventResponse = await response.json();

    if (!result.success) {
      throw new Error('Failed to create event');
    }

    return result.data;
  },

  /**
   * Update event (full update)
   */
  update: async (id: string, data: Partial<Event>): Promise<EventWithLikes> => {
    const response = await fetch(EVENTS_ENDPOINTS.UPDATE(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result: EventResponse = await response.json();

    if (!result.success) {
      throw new Error('Failed to update event');
    }

    return result.data;
  },

  /**
   * Update event (partial update)
   */
  patch: async (id: string, data: Partial<Event>): Promise<EventWithLikes> => {
    const response = await fetch(EVENTS_ENDPOINTS.PATCH(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result: EventResponse = await response.json();

    if (!result.success) {
      throw new Error('Failed to update event');
    }

    return result.data;
  },

  /**
   * Delete event
   */
  delete: async (id: string): Promise<void> => {
    const response = await fetch(EVENTS_ENDPOINTS.DELETE(id), {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error('Failed to delete event');
    }
  },

  /**
   * Get upcoming events
   */
  getUpcoming: async (
    days = 30,
    limit = 20,
    type = ''
  ): Promise<EventWithLikes[]> => {
    const params = new URLSearchParams({
      days: String(days),
      limit: String(limit),
    });

    if (type) {
      params.append('type', type);
    }

    const response = await fetch(`${EVENTS_ENDPOINTS.UPCOMING}?${params}`);
    const result: EventListResponse = await response.json();

    if (!result.success) {
      throw new Error('Failed to fetch upcoming events');
    }

    return result.data;
  },

  /**
   * Like/Unlike event (toggle)
   */
  toggleLike: async (eventId: string, userId: string): Promise<LikeResponse['data']> => {
    const response = await fetch(EVENTS_ENDPOINTS.LIKE(eventId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    const result: LikeResponse = await response.json();

    if (!result.success) {
      throw new Error('Failed to toggle like');
    }

    return result.data;
  },

  /**
   * Get like status for an event
   */
  getLikeStatus: async (
    eventId: string,
    userId: string
  ): Promise<LikeStatusResponse['data']> => {
    const params = new URLSearchParams({ user_id: userId });
    const response = await fetch(`${EVENTS_ENDPOINTS.LIKE(eventId)}?${params}`);

    const result: LikeStatusResponse = await response.json();

    if (!result.success) {
      throw new Error('Failed to get like status');
    }

    return result.data;
  },
};
