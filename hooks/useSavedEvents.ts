import { useState, useEffect, useCallback } from "react";

const SAVED_EVENTS_KEY = "spacescope_saved_events";

export function useSavedEvents() {
  const [savedEventIds, setSavedEventIds] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);

  // Load saved events from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_EVENTS_KEY);
    if (saved) {
      try {
        const ids = JSON.parse(saved);
        setSavedEventIds(new Set(ids));
      } catch (e) {
        console.error("Failed to parse saved events:", e);
      }
    }
    setIsMounted(true);
  }, []);

  // Save to localStorage whenever savedEventIds changes
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(Array.from(savedEventIds)));
  }, [savedEventIds, isMounted]);

  const toggleSaved = useCallback((eventId: string) => {
    setSavedEventIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  }, []);

  const isSaved = useCallback((eventId: string) => {
    return savedEventIds.has(eventId);
  }, [savedEventIds]);

  return { savedEventIds, toggleSaved, isSaved, isMounted };
}
