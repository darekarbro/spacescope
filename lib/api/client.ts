/**
 * API Client - Centralized HTTP handler
 * Handles authentication, error handling, and response transformation
 */

import { AuthResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(typeof options.headers === 'object' ? (options.headers as Record<string, string>) : {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        response.status,
        data.message || `HTTP ${response.status}`,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(0, 'Network error', error);
  }
}

// Convenience methods
export const api = {
  get: <T = any>(url: string) => 
    apiCall<T>(url, { method: 'GET' }),

  post: <T = any>(url: string, body?: any) =>
    apiCall<T>(url, { method: 'POST', body: JSON.stringify(body) }),

  put: <T = any>(url: string, body?: any) =>
    apiCall<T>(url, { method: 'PUT', body: JSON.stringify(body) }),

  patch: <T = any>(url: string, body?: any) =>
    apiCall<T>(url, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T = any>(url: string) =>
    apiCall<T>(url, { method: 'DELETE' }),
};
