export type EventType = 
  | 'solar_eclipse' 
  | 'lunar_eclipse' 
  | 'meteor_shower' 
  | 'aurora' 
  | 'iss_pass' 
  | 'comet' 
  | 'conjunction' 
  | 'transit'
  | 'planetary_alignment'
  | 'other';

export type EventStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';

export interface User {
  id: number;
  username: string;
  email?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  event_type: EventType;
  start_time: string; // ISO 8601
  end_time?: string;
  latitude?: number;
  longitude?: number;
  visibility_map_url?: string;
  magnitude?: number;
  submitted_by?: User;
  status: EventStatus;
  created_at: string;
  updated_at: string;
  image?: string;
  tags?: string[];
  likes_count?: number;
  user_has_liked?: boolean;
}

export interface EventFilters {
  event_type?: EventType;
  start_date?: string;
  end_date?: string;
  visibility_region?: 'global' | 'northern' | 'southern' | 'equatorial';
  status?: EventStatus;
  search?: string;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  event_type: EventType;
  start_time: string;
  end_time?: string;
  latitude?: number;
  longitude?: number;
  magnitude?: number;
  image?: string;
  tags?: string[];
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {
  status?: EventStatus;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
