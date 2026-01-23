'use server';

/**
 * Learn Admin Server Actions
 * CRUD operations for Learn Categories and Contents
 */

import { revalidatePath } from 'next/cache';
import type { LearnCategory, LearnContent, LearnContentImage } from '@/types/learn';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'spacescope-admin-secret';

// Helper function for admin API calls
async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': ADMIN_TOKEN,
        ...options.headers,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || `HTTP ${response.status}` };
    }

    // Handle DELETE requests which may not return JSON
    if (options.method === 'DELETE') {
      return { data: undefined };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Admin API Error:', error);
    return { error: 'Network error. Please try again.' };
  }
}

// ============= CATEGORIES =============

export async function getCategories(): Promise<{ categories: LearnCategory[]; error?: string }> {
  const result = await adminFetch<{ success: boolean; count: number; data: LearnCategory[] }>('/api/learn/categories/');
  if (result.error) {
    return { categories: [], error: result.error };
  }
  return { categories: result.data?.data || [] };
}

export async function getCategory(id: number): Promise<{ category?: LearnCategory; error?: string }> {
  const result = await adminFetch<LearnCategory>(`/api/learn/categories/${id}/`);
  return { category: result.data, error: result.error };
}

export async function createCategory(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    icon_url: formData.get('icon') as string || '',
  };

  const result = await adminFetch<LearnCategory>('/api/learn/categories/', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (result.error) {
    return { success: false, error: result.error };
  }

  revalidatePath('/admin/learn');
  revalidatePath('/learn');
  return { success: true };
}

export async function updateCategory(id: number, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    icon_url: formData.get('icon') as string || '',
  };

  const result = await adminFetch<LearnCategory>(`/api/learn/categories/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (result.error) {
    return { success: false, error: result.error };
  }

  revalidatePath('/admin/learn');
  revalidatePath('/learn');
  return { success: true };
}

export async function deleteCategory(id: number): Promise<{ success: boolean; error?: string }> {
  const result = await adminFetch(`/api/learn/categories/${id}/`, {
    method: 'DELETE',
  });

  if (result.error) {
    return { success: false, error: result.error };
  }

  revalidatePath('/admin/learn');
  revalidatePath('/learn');
  return { success: true };
}

// ============= CONTENTS =============

export async function getContents(categoryId?: number): Promise<{ contents: LearnContent[]; error?: string }> {
  let url = '/api/learn/contents/';
  if (categoryId) {
    url += `?category=${categoryId}`;
  }
  
  const result = await adminFetch<{ success: boolean; count: number; data: LearnContent[] }>(url);
  if (result.error) {
    return { contents: [], error: result.error };
  }
  return { contents: result.data?.data || [] };
}

export async function getContent(id: number): Promise<{ content?: LearnContent; error?: string }> {
  const result = await adminFetch<LearnContent>(`/api/learn/contents/${id}/`);
  return { content: result.data, error: result.error };
}

export async function createContent(formData: FormData): Promise<{ success: boolean; error?: string; id?: number }> {
  const imagesJson = formData.get('images') as string;
  let images: Partial<LearnContentImage>[] = [];
  
  try {
    images = imagesJson ? JSON.parse(imagesJson) : [];
  } catch {
    images = [];
  }

  const data = {
    category: Number(formData.get('category')),
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    content: formData.get('content') as string,
    difficulty: formData.get('difficulty') as string,
    duration_minutes: Number(formData.get('duration_minutes')),
    images,
  };

  const result = await adminFetch<LearnContent>('/api/learn/contents/', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (result.error) {
    return { success: false, error: result.error };
  }

  revalidatePath('/admin/learn');
  revalidatePath('/learn');
  return { success: true, id: result.data?.id };
}

export async function updateContent(id: number, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const imagesJson = formData.get('images') as string;
  let images: Partial<LearnContentImage>[] = [];
  
  try {
    images = imagesJson ? JSON.parse(imagesJson) : [];
  } catch {
    images = [];
  }

  const data = {
    category: Number(formData.get('category')),
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    content: formData.get('content') as string,
    difficulty: formData.get('difficulty') as string,
    duration_minutes: Number(formData.get('duration_minutes')),
    images,
  };

  const result = await adminFetch<LearnContent>(`/api/learn/contents/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (result.error) {
    return { success: false, error: result.error };
  }

  revalidatePath('/admin/learn');
  revalidatePath('/learn');
  revalidatePath(`/learn/${id}`);
  return { success: true };
}

export async function deleteContent(id: number): Promise<{ success: boolean; error?: string }> {
  const result = await adminFetch(`/api/learn/contents/${id}/`, {
    method: 'DELETE',
  });

  if (result.error) {
    return { success: false, error: result.error };
  }

  revalidatePath('/admin/learn');
  revalidatePath('/learn');
  return { success: true };
}
