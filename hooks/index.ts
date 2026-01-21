/**
 * Custom Hooks
 */

'use client';

import { useAuth } from '@/context/AuthContext';
import { useCallback, useState } from 'react';
import { useEventLike } from './use-event-like';

export { useAuth, useEventLike };

// Hook for fetching with loading state
export function useFetch<T>(
  fetcher: () => Promise<T>,
  immediate = true
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  if (immediate && data === null && !error) {
    execute();
  }

  return { data, loading, error, refetch: execute };
}

// Hook for API calls with error handling
export function useApiCall<T, P = any>(
  fetcher: (params?: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (params?: P) => {
      setLoading(true);
      setError(null);
      try {
        return await fetcher(params);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetcher]
  );

  return { loading, error, execute };
}
