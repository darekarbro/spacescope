# Phase 1 Implementation: Event-to-Map Visibility Integration

## Overview
Phase 1 connects celestial events to the map, displaying visibility zones where each event is visible from Earth.

## Files Created/Modified

### 1. New Files Created

#### `/lib/visibilityGeoJSON.ts`
- Defines visibility region polygons for 9 regions:
  - **global**: Entire Earth
  - **northern**: Northern Hemisphere (0° to 90°N)
  - **southern**: Southern Hemisphere (90°S to 0°)
  - **europe**: Europe & Africa (W15° to E40°, 35°N to 70°N)
  - **asia**: Asia & Australia (E40° to 180°, 60°S to 60°N)
  - **africa**: Africa & South America (W90° to E60°, 60°S to 40°N)
  - **americas**: North & South America (W170° to W30°, 60°S to 75°N)
  - **arctic**: Arctic Regions (60°N to 90°N)
  - **antarctic**: Antarctic Regions (90°S to 60°S)
- Exports `visibilityPolygons` object with GeoJSON Feature polygons
- Exports `createVisibilityGeoJSON()` function to generate FeatureCollections

#### `/stores/event-selection-store.ts`
- Zustand store for managing selected event state
- Provides `selectedEvent` state and `selectEvent` action
- Used by MapsPanel and MapView to communicate event selection

### 2. Modified Files

#### `/components/dashboard/maps-panel.tsx`
- Added import for `useEventSelection` hook
- Updated event card onClick handler to:
  - Update UI selected state
  - Call `selectEvent()` to update global store
  - Pass `null` when deselecting

#### `/components/dashboard/map-view.tsx`
- Added imports:
  - `useEventSelection` from event-selection-store
  - `createVisibilityGeoJSON` from lib/visibilityGeoJSON
- Added `selectedEvent` from hook
- New useEffect for visibility layer management:
  - Detects when `selectedEvent` changes
  - Removes layer when no event selected
  - Adds GeoJSON source with visibility polygon
  - Creates two layers: "visibility-fill" (semi-transparent) and "visibility-border" (outline)
  - Handles map style loading properly

#### `/mock/events.ts` (Previously Updated)
- All 17 events have `visibilityRegion` field assigned:
  - Meteor showers: northern/global
  - Eclipses: asia/africa/europe
  - Aurora: arctic/antarctic
  - ISS passes: americas/europe
  - Conjunctions: global/asia

## User Flow

1. User opens the dashboard and views the map
2. User clicks on an event card in the sidebar/panel
3. MapsPanel registers the click and calls `selectEvent(event)`
4. MapView detects the `selectedEvent` change via hook
5. Map renders visibility polygon for the selected event
6. User can click again to deselect (polygon disappears)

## Visual Design

- **Fill Color**: Light blue (#3b82f6) with 15% opacity
- **Border Color**: Blue (#3b82f6) with 2px width and 60% opacity
- **Styling**: Subtle but visible, overlays on map without obscuring other features

## Data Structure

Each event now includes:
```typescript
interface CelestialEvent {
  id: string;
  name: string;
  categoryId: string;
  start: string; // ISO date
  end: string;
  description: string;
  isUpcoming: boolean;
  visibilityRegion: 'global' | 'northern' | 'southern' | 'europe' | 'asia' | 'africa' | 'americas' | 'arctic' | 'antarctic';
  magnitude?: number;
  duration?: string;
  tags?: string[];
}
```

## Testing Checklist

- [ ] Click event card → visibility polygon appears on map
- [ ] Polygon matches expected region (e.g., northern hemisphere for meteor showers)
- [ ] Click same event again → polygon disappears
- [ ] Switch between events → previous polygon removed, new one added
- [ ] Toggle theme (light/dark) → visibility layer persists correctly
- [ ] Test all 9 visibility regions are properly displayed

## Phase 2 Opportunities (Future)

- Add event title tooltip when hovering visibility zone
- Show multiple events' visibility zones simultaneously
- Allow filtering map view by event visibility
- Add interactive region selection
- Animate polygon appearance/disappearance
- Add event details panel with countdown timer
- Show event path/trajectory when applicable (e.g., eclipse path)

## Technical Notes

- Uses MapLibre GL's GeoJSON source and layer system
- Layer order: background → visibility-fill → visibility-border → markers
- Proper handling of map style changes (doesn't lose visibility layer)
- Cleanup: Removes source and layers when event deselected
- Type-safe: Uses TypeScript for event types and coordinates
