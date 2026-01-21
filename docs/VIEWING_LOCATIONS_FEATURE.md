# Professional Viewing Locations Feature

## Overview
When users select a celestial event, the map now displays professional observatories and dark sky sites recommended for viewing that specific event within its visibility region. This replaces generic tourism location markers with astronomically relevant locations.

## Key Features

### 1. **Context-Aware Location Markers**
- When no event is selected: Generic tourism locations visible (original behavior)
- When event is selected: Tourism markers hidden, professional viewing sites displayed
- Viewing locations are filtered by the event's visibility region

### 2. **20 Professional Viewing Locations**
Includes world-renowned observatories and dark sky sites:

**Observatories:**
- Mauna Kea (Hawaii) - 4,207m, world's highest
- Atacama Desert (Chile) - 2,635m, driest location
- Paranal (Chile) - Very Large Telescope
- La Silla (Chile) - ESO observatory
- Teide (Spain) - Europe's finest
- Sutherland (South Africa) - Minimal light pollution
- Keck (Hawaii) - Two largest optical telescopes
- Gran Telescopio Canarias - World's largest single-mirror
- Mount Graham (Arizona) - Premium US location
- Noto (Italy) - Mediterranean observatory
- Roque de los Muchachos (Canary Islands) - Largest telescope collection
- Subaru (Hawaii) - Advanced adaptive optics
- Pic du Midi (France) - High-altitude Pyrenees
- Haleakalā (Hawaii) - House of the Sun
- Svalbard (Arctic) - Aurora observations

**Dark Sky Sites:**
- Northern Drakensberg (South Africa) - Designated dark sky site
- Karoo Dark Sky Reserve (South Africa) - Vast pristine skies
- Natural Bridges Dark Sky Park (Utah) - UNESCO certified

### 3. **Visual Design**
- **Marker Color**: Golden/amber gradient (#f59e0b to #d97706)
- **Icon Design**: Telescope/observatory symbol unique from location markers
- **Animation**: Pulse effect when selected, scale-up on hover
- **Popups**: Rich information cards with:
  - Observatory/site name
  - Type and elevation
  - Detailed description
  - Hover-triggered for non-intrusive display

## Data Structure

```typescript
interface ViewingLocation {
  id: string;
  name: string;
  type: 'observatory' | 'dark-sky-site' | 'mountain' | 'park' | 'desert';
  visibilityRegions: string[]; // [northern, southern, global, etc.]
  coordinates: { lat: number; lng: number };
  elevation: number; // meters above sea level
  description: string;
  conditions: string[]; // Features like 'low-light-pollution', 'high-altitude'
}
```

## Implementation Details

### Files Created/Modified

#### `mock/viewingLocations.ts` (NEW)
- `viewingLocations[]` - Array of 20+ professional locations
- `getRecommendedLocations(region)` - Filters locations by visibility region
- Each location mapped to 1-3 visibility regions for smart filtering

#### `components/dashboard/map-view.tsx` (MODIFIED)
- Added `viewingLocationMarkersRef` for managing observatory markers
- New effect to render/remove viewing locations based on `selectedEvent`
- Modified location markers effect to hide tourism markers when event selected
- Golden telescope markers with hover tooltips showing details
- Smooth transitions when switching between event selection modes

#### `mock/viewingLocations.ts` (NEW)
- Central repository for all professional viewing locations
- Type definitions for location data
- Helper function for region-based filtering

## User Workflow

1. **Initial State**: User sees map with tourism location markers
2. **Event Selection**: Click celestial event in sidebar
3. **Map Update**:
   - Tourism location markers disappear
   - Visibility polygon appears in blue
   - Professional viewing locations appear as golden markers
   - Observatory names visible on hover
   - Map auto-zooms to visibility region
4. **Hover Information**: User can hover over any marker to see:
   - Observatory/site name
   - Type and elevation
   - Brief description
5. **Deselection**: Click event again to return to normal map state

## Region Coverage

Each visibility region has carefully selected viewing locations:

| Region | Locations | Type |
|--------|-----------|------|
| **Americas** | Mauna Kea, Keck, Haleakalā, Mount Graham, Paranal, La Silla, Atacama | Professional & Dark Sky |
| **Europe** | Teide, La Palma, Pic du Midi, Noto | Professional observatories |
| **Africa** | Sutherland, Karoo Reserve, Northern Drakensberg | Observatories & Dark Sky |
| **Asia** | Subaru, Noto | Professional observatories |
| **Arctic** | Svalbard Observatory | Aurora-specialized |
| **Global** | All locations | Universal viewing |

## Benefits

### For Users
- **Credible Information**: Locations vetted for astronomical observation
- **Context Awareness**: Only relevant locations shown per event
- **Professional Grade**: Real observatories and recognized dark sky sites
- **Planning Tool**: Elevation, light pollution, and facility info helps decision-making

### For App
- **Educational**: Shows where professional science happens
- **Engagement**: Encourages exploring different events and locations
- **Accuracy**: Real-world locations vs. random markers
- **Branding**: Aligns with SpaceScope's professional astronomy focus

## Future Enhancements

### Phase 2 Ideas
- Add booking/contact links for accessible sites
- Show live weather conditions at each location
- Display recent observations from each observatory
- Add user reviews/photos from visiting astronomers
- Show telescope specifications and observation capabilities
- Integration with observing apps (e.g., SkySafari)

### Phase 3 Ideas
- Real-time observatory activity/observations
- Virtual observatory tours
- Community observation guides for each location
- Travel planning integration
- Accessibility information (parking, facilities, etc.)

## Technical Notes

- Markers use MapLibre GL's Marker system with custom SVG elements
- Popups trigger on hover (no click needed) for better UX
- Golden color (#f59e0b) contrasts well with all map styles
- Filtering is instant with O(n) complexity for smooth UX
- No additional API calls required (all data local)

## Color Consistency

- **Tourism Locations**: Original category colors
- **Professional Viewing Sites**: Consistent golden/amber (#f59e0b - #d97706)
- **Visibility Zones**: Blue (#3b82f6)
- **User Location**: Blue (#3b82f6)

This creates clear visual hierarchy: Blue for event/user context, Gold for observation opportunities.
