// GeoJSON polygons for different visibility regions
export const visibilityPolygons: Record<string, GeoJSON.Feature<GeoJSON.Polygon>> = {
  global: {
    type: "Feature",
    properties: { region: "Global" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-180, -90],
        [180, -90],
        [180, 90],
        [-180, 90],
        [-180, -90]
      ]]
    }
  },
  northern: {
    type: "Feature",
    properties: { region: "Northern Hemisphere" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-180, 0],
        [180, 0],
        [180, 90],
        [-180, 90],
        [-180, 0]
      ]]
    }
  },
  southern: {
    type: "Feature",
    properties: { region: "Southern Hemisphere" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-180, -90],
        [180, -90],
        [180, 0],
        [-180, 0],
        [-180, -90]
      ]]
    }
  },
  europe: {
    type: "Feature",
    properties: { region: "Europe & Africa" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-15, 35],
        [40, 35],
        [40, 70],
        [-15, 70],
        [-15, 35]
      ]]
    }
  },
  asia: {
    type: "Feature",
    properties: { region: "Asia & Australia" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [40, -60],
        [180, -60],
        [180, 60],
        [40, 60],
        [40, -60]
      ]]
    }
  },
  africa: {
    type: "Feature",
    properties: { region: "Africa & South America" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-90, -60],
        [60, -60],
        [60, 40],
        [-90, 40],
        [-90, -60]
      ]]
    }
  },
  americas: {
    type: "Feature",
    properties: { region: "North & South America" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-170, -60],
        [-30, -60],
        [-30, 75],
        [-170, 75],
        [-170, -60]
      ]]
    }
  },
  arctic: {
    type: "Feature",
    properties: { region: "Arctic Regions" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-180, 60],
        [180, 60],
        [180, 90],
        [-180, 90],
        [-180, 60]
      ]]
    }
  },
  antarctic: {
    type: "Feature",
    properties: { region: "Antarctic Regions" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-180, -90],
        [180, -90],
        [180, -60],
        [-180, -60],
        [-180, -90]
      ]]
    }
  }
};

export function createVisibilityGeoJSON(visibilityRegion: string): GeoJSON.FeatureCollection {
  const polygon = visibilityPolygons[visibilityRegion] || visibilityPolygons.global;
  
  return {
    type: "FeatureCollection",
    features: [polygon]
  };
}

// Bounding boxes for each visibility region [minLng, minLat, maxLng, maxLat]
export const visibilityBounds: Record<string, [number, number, number, number]> = {
  global: [-180, -90, 180, 90],
  northern: [-180, 0, 180, 90],
  southern: [-180, -90, 180, 0],
  europe: [-15, 35, 40, 70],
  asia: [40, -60, 180, 60],
  africa: [-90, -60, 60, 40],
  americas: [-170, -60, -30, 75],
  arctic: [-180, 60, 180, 90],
  antarctic: [-180, -90, 180, -60],
};

export function getVisibilityBounds(visibilityRegion: string): [number, number, number, number] {
  return visibilityBounds[visibilityRegion] || visibilityBounds.global;
}
