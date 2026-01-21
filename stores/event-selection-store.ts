import { create } from 'zustand';
import type { CelestialEvent } from '@/mock/events';

interface EventSelectionStore {
  selectedEvent: CelestialEvent | null;
  selectEvent: (event: CelestialEvent | null) => void;
}

export const useEventSelection = create<EventSelectionStore>((set) => ({
  selectedEvent: null,
  selectEvent: (event) => set({ selectedEvent: event }),
}));
