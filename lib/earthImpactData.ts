export type EarthImpact = {
  id: string;
  title: string;
  emoji: string;
  summary: string;
  problem: string;
  problem_highlights?: string[];
  what_is_tracked?: string[];
  disasters_covered?: string[];
  monitors?: string[];
  satellite_used: string[];
  how_it_helps?: string[];
  why_it_matters?: string;
  result: string[];
  result_note?: string;
  image_before: {
    src: string;
    alt: string;
    label: string;
  };
  image_after: {
    src: string;
    alt: string;
    label: string;
  };
  extras?: Array<{
    src: string;
    alt: string;
    label: string;
  }>;
};

// Mock data – storytelling focused, not tied to live sensors.
export const earthImpacts: EarthImpact[] = [
  {
    id: 'agriculture',
    title: 'Agriculture',
    emoji: '🌾',
    summary: 'Monitoring crops & water using satellites',
    problem: 'Low crop yield due to poor monitoring',
    problem_highlights: ['Crop health', 'Water stress', 'Diseases early'],
    satellite_used: ['Landsat', 'Sentinel-2'],
    how_it_helps: [
      'NDVI-based crop health monitoring (conceptual)',
      'Detect dry zones',
      'Predict yield trends',
    ],
    result: ['Better yield', 'Less water waste'],
    image_before: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Global_Vegetation_map_-_GPN-2003-00029.jpg/1280px-Global_Vegetation_map_-_GPN-2003-00029.jpg?20090410001604',
      alt: 'Global vegetation map showing NDVI-style greens',
      label: 'Crop health (NDVI map)',
    },
    image_after: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Deforestation_in_Bolivia_ESA21810361.jpeg/1280px-Deforestation_in_Bolivia_ESA21810361.jpeg?20231214201417',
      alt: 'Deforestation impact highlight',
      label: 'Deforestation impact',
    },
    extras: [
      {
        src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
        alt: 'Healthy farmland rows',
        label: 'Healthy farmland perspective',
      },
    ],
  },
  {
    id: 'climate',
    title: 'Climate',
    emoji: '🌡️',
    summary: 'Visualizing temperature & CO₂ trends',
    problem: 'Climate change is difficult to understand visually',
    what_is_tracked: ['Global temperature', 'CO₂ concentration', 'Ice melt'],
    satellite_used: ['MODIS', 'Sentinel-5P'],
    how_it_helps: ['Heatmaps reveal warming trends', 'CO₂ overlays guide policy discussions'],
    why_it_matters: 'Helps predict long-term climate change',
    result: ['Supports climate research & policy'],
    image_before: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Global_temperature_anomaly.jpg/1280px-Global_temperature_anomaly.jpg?20090526231452',
      alt: 'Global temperature anomaly heatmap',
      label: 'Temperature heatmap',
    },
    image_after: {
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
      alt: 'CO₂ concentration world map',
      label: 'CO₂ concentration map',
    },
  },
  {
    id: 'disaster',
    title: 'Disaster',
    emoji: '🚨',
    summary: 'Tracking storms, floods & quakes',
    problem: 'Natural disasters cause major human and economic loss',
    disasters_covered: ['Floods', 'Cyclones', 'Earthquakes'],
    satellite_used: ['Sentinel-1', 'GOES'],
    how_it_helps: ['Early storm detection', 'Flood extent monitoring', 'Surface change observation'],
    result: ['Faster evacuation', 'Better emergency response'],
    image_before: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Hurricane_Florence_Viewed_from_the_Space_Station.jpg/1280px-Hurricane_Florence_Viewed_from_the_Space_Station.jpg?20180912203232',
      alt: 'Hurricane view from space station',
      label: 'Storm tracking',
    },
    image_after: {
      src: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80',
      alt: 'Flood waters receded and recovery underway',
      label: 'Flood recovery',
    },
    extras: [
      {
        src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80',
        alt: 'Radar view of a cyclone swirling over an ocean',
        label: 'Cyclone tracking image',
      },
    ],
  },
  {
    id: 'pollution',
    title: 'Pollution',
    emoji: '🏭',
    summary: 'Making invisible pollution visible',
    problem: 'Pollution is invisible to the public',
    monitors: ['Air pollution', 'Water contamination', 'Industrial emissions'],
    satellite_used: ['Sentinel-5P'],
    how_it_helps: ['Air quality maps highlight hotspots', 'Water imagery makes pollution visible'],
    why_it_matters: 'Protects public health',
    result: ['Better pollution control decisions'],
    image_before: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Nitrogen_dioxide_over_the_Middle_East_measured_by_Sentinel-5A_ESA514891.jpg/1280px-Nitrogen_dioxide_over_the_Middle_East_measured_by_Sentinel-5A_ESA514891.jpg?20251126170055',
      alt: 'Nitrogen dioxide plume over urban areas',
      label: 'Air quality (NO₂)',
    },
    image_after: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/7/75/AralSea1989_2014.jpg',
      alt: 'Water comparison showing Aral Sea shrinkage',
      label: 'Water comparison before/after',
    },
  },
];