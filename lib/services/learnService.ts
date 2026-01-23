/**
 * Learn Service
 * API calls for Learn Categories and Content
 */

import { api } from '../api/client';
import { LEARN_ENDPOINTS } from '../api/endpoints';
import type {
  LearnCategory,
  LearnCategoryListResponse,
  LearnContent,
  LearnContentListResponse,
  LearnContentFilters,
} from '@/types/learn';

/**
 * Fetch all learn categories
 */
export async function getLearnCategories(): Promise<LearnCategoryListResponse> {
  return api.get<LearnCategoryListResponse>(LEARN_ENDPOINTS.CATEGORIES);
}

/**
 * Fetch a single category by ID
 */
export async function getLearnCategory(id: number): Promise<LearnCategory> {
  return api.get<LearnCategory>(LEARN_ENDPOINTS.CATEGORY_DETAIL(id));
}

/**
 * Fetch learn contents with optional filters
 */
export async function getLearnContents(
  filters?: LearnContentFilters
): Promise<LearnContentListResponse> {
  let url = LEARN_ENDPOINTS.CONTENTS;
  
  if (filters) {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category.toString());
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return api.get<LearnContentListResponse>(url);
}

/**
 * Fetch a single content by ID
 */
export async function getLearnContent(id: number): Promise<LearnContent> {
  return api.get<LearnContent>(LEARN_ENDPOINTS.CONTENT_DETAIL(id));
}

/**
 * Get difficulty badge color
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'intermediate':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'advanced':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

/**
 * Get difficulty icon
 */
export function getDifficultyIcon(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return '🌱';
    case 'intermediate':
      return '🌿';
    case 'advanced':
      return '🌳';
    default:
      return '📚';
  }
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMinutes} min`;
}
