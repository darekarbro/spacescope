import { useState, useCallback } from 'react';
import { EVENTS_ENDPOINTS } from '@/lib/api/endpoints';

interface LikeData {
  event_id: string;
  likes_count: number;
  has_liked: boolean;
}

export function useEventLike(eventId: string, userId?: string) {
  const [likeData, setLikeData] = useState<LikeData>({
    event_id: eventId,
    likes_count: 0,
    has_liked: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch like status
  const fetchLikeStatus = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${EVENTS_ENDPOINTS.LIKE(eventId)}?user_id=${userId}`
      );
      const data = await response.json();

      if (data.success) {
        setLikeData({
          event_id: data.data.event_id,
          likes_count: data.data.likes_count,
          has_liked: data.data.has_liked,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch like status');
    } finally {
      setIsLoading(false);
    }
  }, [eventId, userId]);

  // Toggle like/unlike
  const toggleLike = useCallback(async () => {
    if (!userId) {
      setError('Please log in to like events');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(EVENTS_ENDPOINTS.LIKE(eventId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await response.json();

      if (data.success) {
        setLikeData({
          event_id: data.data.event_id,
          likes_count: data.data.likes_count,
          has_liked: data.data.has_liked,
        });
        setError(null);
      } else {
        setError(data.message || 'Failed to toggle like');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like');
    } finally {
      setIsLoading(false);
    }
  }, [eventId, userId]);

  return {
    isLiked: likeData.has_liked,
    likesCount: likeData.likes_count,
    isLoading,
    error,
    fetchLikeStatus,
    toggleLike,
  };
}
