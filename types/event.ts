export type EventType = 'meteor_shower' | 'planetary_alignment' | 'iss_pass' | 'aurora' | 'lunar_eclipse' | 'solar_eclipse' | 'comet' | 'other';

export type EventStatus = 'pending' | 'approved' | 'rejected';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  start_time: string; // ISO 8601
  end_time: string;
  latitude?: number;
  longitude?: number;
  visibility_map_url?: string;
  magnitude?: number;
  created_by: string; // scientist ID
  status: EventStatus;
  created_at: string;
  updated_at: string;
  image_url?: string;
  tags?: string[];
}

export interface EventFilters {
  type?: EventType;
  start_date?: string;
  end_date?: string;
  visibility_region?: 'global' | 'northern' | 'southern' | 'equatorial';
}

export interface CreateEventDTO {
  title: string;
  description: string;
  type: EventType;
  start_time: string;
  end_time: string;
  latitude?: number;
  longitude?: number;
  magnitude?: number;
  image_url?: string;
  tags?: string[];
}
