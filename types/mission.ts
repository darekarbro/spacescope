export type MissionStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export type MissionAgency = 'NASA' | 'ESA' | 'ISRO' | 'CNSA' | 'Roscosmos' | 'JAXA' | 'Private';

export interface Mission {
  id: string;
  name: string;
  agency: MissionAgency;
  status: MissionStatus;
  launch_date?: string; // ISO 8601
  expected_end_date?: string;
  return_date?: string;
  banner_image?: string;
  description: string;
  objectives?: string[];
  image_url?: string;
  website_url?: string;
  live_tracking_url?: string;
  tags?: string[];
  timeline?: { date: string; title: string; description?: string }[];
  crew?: { name: string; role: string; country?: string; photo?: string }[];
  related_ids?: string[];
}

export interface MissionTimeline {
  missions: Mission[];
  current_year: number;
  upcoming_count: number;
  active_count: number;
}
