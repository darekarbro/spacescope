// Recommended viewing locations for celestial events
// These are real or realistic dark sky sites and observatories

export interface ViewingLocation {
  id: string;
  name: string;
  type: 'observatory' | 'dark-sky-site' | 'mountain' | 'park' | 'desert';
  visibilityRegions: string[]; // Regions where this location is suitable
  coordinates: {
    lat: number;
    lng: number;
  };
  elevation: number; // meters above sea level
  description: string;
  conditions: string[]; // e.g., ['low-light-pollution', 'high-altitude', 'clear-skies']
}

export const viewingLocations: ViewingLocation[] = [
  // Northern Hemisphere
  {
    id: "mauna-kea",
    name: "Mauna Kea Observatory",
    type: "observatory",
    visibilityRegions: ["northern", "global", "americas"],
    coordinates: { lat: 19.8207, lng: -155.4676 },
    elevation: 4207,
    description: "World's highest astronomical observatory at 4,207m altitude on Hawaii's Mauna Kea volcano",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies", "professional-grade"],
  },
  {
    id: "atacama-desert",
    name: "Atacama Desert Observatory",
    type: "dark-sky-site",
    visibilityRegions: ["southern", "global", "americas"],
    coordinates: { lat: -23.6345, lng: -70.4069 },
    elevation: 2635,
    description: "Driest place on Earth with exceptional seeing conditions. Home to ALMA observatory",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies", "professional-grade"],
  },
  {
    id: "mt-hopkins",
    name: "Mount Hopkins Observatory",
    type: "observatory",
    visibilityRegions: ["northern", "americas"],
    coordinates: { lat: 31.6883, lng: -110.8847 },
    elevation: 2606,
    description: "Major research observatory in Arizona's Santa Rita Mountains",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies"],
  },
  {
    id: "gemini-north",
    name: "Gemini North Observatory",
    type: "observatory",
    visibilityRegions: ["northern", "americas"],
    coordinates: { lat: 19.8238, lng: -155.4722 },
    elevation: 4194,
    description: "One of the world's most advanced optical/infrared observatories on Mauna Kea",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies", "professional-grade"],
  },
  {
    id: "paranal",
    name: "Paranal Observatory",
    type: "observatory",
    visibilityRegions: ["southern", "americas"],
    coordinates: { lat: -24.6253, lng: -70.4044 },
    elevation: 2635,
    description: "Home to the Very Large Telescope in Chile's Atacama Desert",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies", "professional-grade"],
  },
  {
    id: "tenerife-teide",
    name: "Teide Observatory",
    type: "observatory",
    visibilityRegions: ["europe", "northern", "africa"],
    coordinates: { lat: 28.2696, lng: -16.5107 },
    elevation: 2390,
    description: "One of Europe's finest observatories on Canary Islands' Mount Teide",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies"],
  },
  {
    id: "la-silla",
    name: "La Silla Observatory",
    type: "observatory",
    visibilityRegions: ["southern", "americas"],
    coordinates: { lat: -29.2573, lng: -70.7345 },
    elevation: 2400,
    description: "ESO observatory in Chile's Andes Mountains with excellent dark skies",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies", "professional-grade"],
  },
  {
    id: "sutherland",
    name: "Sutherland Observatory",
    type: "observatory",
    visibilityRegions: ["africa", "southern"],
    coordinates: { lat: -32.3826, lng: 20.8106 },
    elevation: 1798,
    description: "South Africa's premier observatory with minimal light pollution",
    conditions: ["low-light-pollution", "clear-skies"],
  },
  {
    id: "subaru",
    name: "Subaru Observatory",
    type: "observatory",
    visibilityRegions: ["asia", "northern"],
    coordinates: { lat: 19.8256, lng: -155.4735 },
    elevation: 4163,
    description: "Japanese observatory on Mauna Kea with advanced adaptive optics",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies", "professional-grade"],
  },
  {
    id: "sutherland-north-dark-sky",
    name: "Northern Drakensberg Dark Sky Site",
    type: "dark-sky-site",
    visibilityRegions: ["africa", "southern"],
    coordinates: { lat: -28.5, lng: 24.5 },
    elevation: 1800,
    description: "Designated dark sky site in South African mountains",
    conditions: ["low-light-pollution", "pristine-skies"],
  },
  {
    id: "maui-haleakala",
    name: "Haleakalā Observatory",
    type: "observatory",
    visibilityRegions: ["northern", "global", "americas"],
    coordinates: { lat: 20.7069, lng: -156.2551 },
    elevation: 3055,
    description: "House of the Sun - Hawaii's second highest peak with research telescopes",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies"],
  },
  {
    id: "keck-telescope",
    name: "Keck Observatory",
    type: "observatory",
    visibilityRegions: ["northern", "americas"],
    coordinates: { lat: 19.8263, lng: -155.4730 },
    elevation: 4145,
    description: "Two of the world's largest optical telescopes on Mauna Kea",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies", "professional-grade"],
  },
  {
    id: "gran-telescopio",
    name: "Gran Telescopio Canarias",
    type: "observatory",
    visibilityRegions: ["europe", "africa"],
    coordinates: { lat: 28.2896, lng: -16.5215 },
    elevation: 2267,
    description: "World's largest single-mirror telescope in Canary Islands",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies", "professional-grade"],
  },
  {
    id: "karoo-dark-sky",
    name: "Karoo Dark Sky Reserve",
    type: "dark-sky-site",
    visibilityRegions: ["africa", "southern"],
    coordinates: { lat: -30.8, lng: 22.5 },
    elevation: 1400,
    description: "South Africa's vast dark sky reserve with pristine night skies",
    conditions: ["low-light-pollution", "pristine-skies", "large-area"],
  },
  {
    id: "noto-observatory",
    name: "Noto Observatory",
    type: "observatory",
    visibilityRegions: ["europe", "asia"],
    coordinates: { lat: 36.8769, lng: 15.1725 },
    elevation: 910,
    description: "Italy's major radio/optical observatory with excellent Mediterranean skies",
    conditions: ["low-light-pollution", "clear-skies"],
  },
  {
    id: "la-palma",
    name: "Roque de los Muchachos Observatory",
    type: "observatory",
    visibilityRegions: ["europe", "africa"],
    coordinates: { lat: 28.7591, lng: -17.8767 },
    elevation: 2396,
    description: "World's largest telescope collection on La Palma, Canary Islands",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies", "professional-grade"],
  },
  {
    id: "ngc-desert-dark-sky",
    name: "Natural Bridges Dark Sky Park",
    type: "dark-sky-site",
    visibilityRegions: ["northern", "americas"],
    coordinates: { lat: 37.6204, lng: -110.0064 },
    elevation: 1640,
    description: "UNESCO Dark Sky Park in Utah's desert with exceptional views",
    conditions: ["low-light-pollution", "pristine-skies", "accessible"],
  },
  {
    id: "pic-du-midi",
    name: "Pic du Midi Observatory",
    type: "observatory",
    visibilityRegions: ["europe"],
    coordinates: { lat: 43.0979, lng: 0.1427 },
    elevation: 2877,
    description: "High-altitude observatory in the Pyrenees with cable car access for tourists",
    conditions: ["high-altitude", "clear-skies"],
  },
  {
    id: "mount-graham",
    name: "Mount Graham Observatory",
    type: "observatory",
    visibilityRegions: ["northern", "americas"],
    coordinates: { lat: 32.7016, lng: -110.7888 },
    elevation: 3267,
    description: "Arizona's premier observing site with multiple research telescopes",
    conditions: ["low-light-pollution", "high-altitude", "clear-skies"],
  },
  {
    id: "svalbard-northern-lights",
    name: "Svalbard Global Observatory",
    type: "observatory",
    visibilityRegions: ["arctic", "northern"],
    coordinates: { lat: 78.2232, lng: 15.6267 },
    elevation: 474,
    description: "Perfect location for aurora viewing and polar observations in Arctic",
    conditions: ["pristine-skies", "aurora-location"],
  },
];

// Get viewing locations suitable for a visibility region
export function getRecommendedLocations(visibilityRegion: string): ViewingLocation[] {
  return viewingLocations.filter((loc) =>
    loc.visibilityRegions.includes(visibilityRegion)
  );
}
