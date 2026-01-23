/**
 * Learn Content Types
 * Types for categories and learning content
 */

export interface LearnCategory {
  id: number;
  name: string;
  description: string;
  icon_url: string | null;
  order?: number;
  is_active?: boolean;
  content_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface LearnContentImage {
  id: number;
  image_url: string;
  caption: string;
  order: number;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LearnContent {
  id: number;
  category: number | LearnCategory;
  title: string;
  description: string;
  content: string;
  difficulty: DifficultyLevel;
  duration_minutes: number;
  images: LearnContentImage[];
  created_at: string;
  updated_at?: string;
}

export interface LearnCategoryListResponse {
  success: boolean;
  count: number;
  data: LearnCategory[];
}

export interface LearnContentListResponse {
  success: boolean;
  count: number;
  data: LearnContent[];
}

export interface LearnContentFilters {
  category?: number;
  difficulty?: DifficultyLevel;
  search?: string;
}
