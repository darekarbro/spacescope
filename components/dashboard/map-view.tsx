"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { useMapsStore } from "@/stores/maps-store";
import { useEventSelection } from "@/stores/event-selection-store";
import { createVisibilityGeoJSON, getVisibilityBounds } from "@/lib/visibilityGeoJSON";
import { viewingLocations, getRecommendedLocations } from "@/mock/viewingLocations";
import { categories, tags as allTags } from "@/mock/locations";

const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  streets: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  outdoors: "https://tiles.stadiamaps.com/styles/outdoors.json",
  satellite: "https://tiles.stadiamaps.com/styles/alidade_satellite.json",
};

export function MapView() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const markersRef = React.useRef<Map<string, maplibregl.Marker>>(new Map());
  const viewingLocationMarkersRef = React.useRef<Map<string, maplibregl.Marker>>(new Map());
  const userMarkerRef = React.useRef<maplibregl.Marker | null>(null);
  const popupRef = React.useRef<maplibregl.Popup | null>(null);
  const isAnimatingRef = React.useRef(false);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isHoveringPopupRef = React.useRef(false);
  const { resolvedTheme } = useTheme();
  const { selectedEvent } = useEventSelection();

  const {
    mapCenter,
    mapZoom,
    mapStyle,
    setMapCenter,
    setMapZoom,
    selectLocation,
    selectedLocationId,
    userLocation,
    routeDestinationId,
    setUserLocation,
    getFilteredLocations,
    locations: allLocations,
  } = useMapsStore();

  const getMapStyleUrl = React.useCallback(() => {
    if (mapStyle === "default") {
      return resolvedTheme === "dark" ? MAP_STYLES.dark : MAP_STYLES.light;
    }
    return MAP_STYLES[mapStyle];
  }, [mapStyle, resolvedTheme]);

  const locations = getFilteredLocations();

  const getTagName = (tagId: string) => {
    return allTags.find((t: any) => t.id === tagId)?.name || tagId;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  React.useEffect(() => {
    const getLocationFromIP = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.latitude && data.longitude) {
          const location = { lat: data.latitude, lng: data.longitude };
          setUserLocation(location);
          setMapCenter(location);
        }
      } catch {
        console.log("IP geolocation failed");
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
        },
        () => {
          getLocationFromIP();
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
      );
    } else {
      getLocationFromIP();
    }
  }, [setUserLocation, setMapCenter]);

  const closePopup = React.useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringPopupRef.current && popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    }, 150);
  }, []);

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getMapStyleUrl(),
      center: [mapCenter.lng, mapCenter.lat],
      zoom: mapZoom,
      minZoom: 3,
      maxZoom: 18,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    map.on("moveend", () => {
      if (isAnimatingRef.current) {
        isAnimatingRef.current = false;
        return;
      }
      const center = map.getCenter();
      const zoom = map.getZoom();
      setMapCenter({ lat: center.lat, lng: center.lng });
      setMapZoom(zoom);
    });

    mapRef.current = map;

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(getMapStyleUrl());
  }, [mapStyle, resolvedTheme, getMapStyleUrl]);

  // Handle visibility layer for selected events
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedEvent) {
      // Remove visibility layer if no event is selected
      if (map && map.getLayer("visibility-fill")) {
        map.removeLayer("visibility-fill");
      }
      if (map && map.getLayer("visibility-border")) {
        map.removeLayer("visibility-border");
      }
      if (map && map.getSource("visibility-source")) {
        map.removeSource("visibility-source");
      }
      return;
    }

    // Wait for map to be ready
    const handleStyleLoad = () => {
      if (!map || !selectedEvent) return;

      const geoJSON = createVisibilityGeoJSON(selectedEvent.visibilityRegion);
      const bounds = getVisibilityBounds(selectedEvent.visibilityRegion);

      // Add or update source
      if (map.getSource("visibility-source")) {
        (map.getSource("visibility-source") as maplibregl.GeoJSONSource).setData(geoJSON);
      } else {
        map.addSource("visibility-source", {
          type: "geojson",
          data: geoJSON,
        });
      }

      // Add fill layer if it doesn't exist
      if (!map.getLayer("visibility-fill")) {
        map.addLayer({
          id: "visibility-fill",
          type: "fill",
          source: "visibility-source",
          paint: {
            "fill-color": "#3b82f6",
            "fill-opacity": 0.15,
          },
        });
      }

      // Add border layer if it doesn't exist
      if (!map.getLayer("visibility-border")) {
        map.addLayer({
          id: "visibility-border",
          type: "line",
          source: "visibility-source",
          paint: {
            "line-color": "#3b82f6",
            "line-width": 2,
            "line-opacity": 0.6,
          },
        });
      }

      // Zoom to fit the visibility region
      isAnimatingRef.current = true;
      map.fitBounds(
        [
          [bounds[0], bounds[1]], // southwest corner
          [bounds[2], bounds[3]], // northeast corner
        ],
        {
          padding: 40,
          duration: 1000,
          maxZoom: 14,
        }
      );
    };

    if (map.isStyleLoaded()) {
      handleStyleLoad();
    } else {
      map.once("style.load", handleStyleLoad);
    }
  }, [selectedEvent]);

  React.useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
      return;
    }

    const el = document.createElement("div");
    el.className = "user-marker";
    el.innerHTML = `
      <div class="relative">
        <div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
        <div class="absolute inset-0 w-4 h-4 rounded-full bg-blue-500/50 animate-ping"></div>
      </div>
    `;

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(mapRef.current);

    userMarkerRef.current = marker;
  }, [userLocation]);

  React.useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Tourism location markers are hidden - viewing locations are shown instead
  }, []);

  // Handle viewing location markers - always shown, filtered by selected event
  React.useEffect(() => {
    if (!mapRef.current) return;

    viewingLocationMarkersRef.current.forEach((marker) => marker.remove());
    viewingLocationMarkersRef.current.clear();

    // Get viewing locations - all if no event selected, filtered if event selected
    let locationsToShow = [];
    if (selectedEvent) {
      locationsToShow = getRecommendedLocations(selectedEvent.visibilityRegion);
    } else {
      // If no event selected, show all viewing locations
      locationsToShow = viewingLocations;
    }

    locationsToShow.forEach((location) => {
      const el = document.createElement("div");
      el.className = "observatory-marker";
      el.innerHTML = `
        <div class="relative cursor-pointer transition-transform hover:scale-125">
          <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Telescope/Observatory marker -->
            <defs>
              <linearGradient id="telescopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
              </linearGradient>
            </defs>
            <path d="M18 0C8.058 0 0 8.058 0 18C0 32 18 44 18 44C18 44 36 32 36 18C36 8.058 27.942 0 18 0Z" fill="url(#telescopeGrad)"/>
            <circle cx="18" cy="16" r="5" fill="white"/>
            <path d="M14 20L22 20L20 26L16 26Z" fill="white" opacity="0.8"/>
          </svg>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-400/60 animate-pulse"></div>
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
      });

      popup.setHTML(`
        <div style="padding: 8px; font-size: 12px; max-width: 200px;">
          <div style="font-weight: bold; color: #1f2937; margin-bottom: 4px;">${location.name}</div>
          <div style="color: #6b7280; font-size: 11px; margin-bottom: 4px;">
            <svg style="display: inline; width: 12px; height: 12px; margin-right: 2px;" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
            ${location.type.replace('-', ' ')} • ${location.elevation}m
          </div>
          <div style="color: #4b5563; font-size: 11px; line-height: 1.4;">${location.description}</div>
        </div>
      `);

      el.addEventListener("mouseenter", () => {
        popup.setLngLat([location.coordinates.lng, location.coordinates.lat]).addTo(mapRef.current!);
      });

      el.addEventListener("mouseleave", () => {
        popup.remove();
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([location.coordinates.lng, location.coordinates.lat])
        .addTo(mapRef.current);

      viewingLocationMarkersRef.current.set(location.id, marker);
    });
  }, [selectedEvent]);

  const routeDataRef = React.useRef<{
    coordinates: [number, number][];
    bounds: maplibregl.LngLatBounds;
  } | null>(null);

  React.useEffect(() => {
    if (!routeDestinationId || !userLocation) {
      routeDataRef.current = null;
      return;
    }

    const destination = allLocations.find((l: any) => l.id === routeDestinationId);
    if (!destination) {
      routeDataRef.current = null;
      return;
    }

    const fetchRoute = async () => {
      const start = `${userLocation.lng},${userLocation.lat}`;
      const end = `${destination.coordinates.lng},${destination.coordinates.lat}`;

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const coordinates = data.routes[0].geometry.coordinates as [number, number][];
          const bounds = new maplibregl.LngLatBounds();
          bounds.extend([userLocation.lng, userLocation.lat]);
          bounds.extend([destination.coordinates.lng, destination.coordinates.lat]);
          coordinates.forEach((coord) => bounds.extend(coord));

          routeDataRef.current = { coordinates, bounds };

          const map = mapRef.current;
          if (map) {
            drawRoute(map, coordinates);
            isAnimatingRef.current = true;
            map.fitBounds(bounds, { padding: 80 });
          }
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    };

    fetchRoute();
  }, [routeDestinationId, userLocation, allLocations]);

  const drawRoute = React.useCallback((map: maplibregl.Map, coordinates: [number, number][]) => {
    if (map.getLayer("route-line")) map.removeLayer("route-line");
    if (map.getLayer("route-line-outline")) map.removeLayer("route-line-outline");
    if (map.getSource("route")) map.removeSource("route");

    map.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates,
        },
      },
    });

    map.addLayer({
      id: "route-line-outline",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#1d4ed8",
        "line-width": 8,
        "line-opacity": 0.4,
      },
    });

    map.addLayer({
      id: "route-line",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3b82f6",
        "line-width": 4,
        "line-opacity": 1,
      },
    });
  }, []);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const clearRoute = () => {
      if (map.getLayer("route-line")) map.removeLayer("route-line");
      if (map.getLayer("route-line-outline")) map.removeLayer("route-line-outline");
      if (map.getSource("route")) map.removeSource("route");
    };

    if (!routeDestinationId) {
      clearRoute();
    }
  }, [routeDestinationId]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleStyleLoad = () => {
      if (routeDataRef.current && routeDestinationId) {
        drawRoute(map, routeDataRef.current.coordinates);
      }
    };

    map.on("style.load", handleStyleLoad);

    return () => {
      map.off("style.load", handleStyleLoad);
    };
  }, [drawRoute, routeDestinationId]);

  React.useEffect(() => {
    if (!mapRef.current || !selectedLocationId) return;
    if (routeDestinationId) return;

    const location = locations.find((l: any) => l.id === selectedLocationId);
    if (location) {
      isAnimatingRef.current = true;
      mapRef.current.flyTo({
        center: [location.coordinates.lng, location.coordinates.lat],
        zoom: Math.max(mapRef.current.getZoom(), 14),
        essential: true,
      });
    }
  }, [selectedLocationId, locations, routeDestinationId]);

  const lastCenterRef = React.useRef({
    lat: mapCenter.lat,
    lng: mapCenter.lng,
  });
  const lastZoomRef = React.useRef(mapZoom);

  React.useEffect(() => {
    if (!mapRef.current) return;

    const centerChanged =
      Math.abs(lastCenterRef.current.lat - mapCenter.lat) > 0.0001 ||
      Math.abs(lastCenterRef.current.lng - mapCenter.lng) > 0.0001;
    const zoomChanged = Math.abs(lastZoomRef.current - mapZoom) > 0.1;

    if (centerChanged || zoomChanged) {
      isAnimatingRef.current = true;
      mapRef.current.flyTo({
        center: [mapCenter.lng, mapCenter.lat],
        zoom: mapZoom,
        essential: true,
      });
      lastCenterRef.current = { lat: mapCenter.lat, lng: mapCenter.lng };
      lastZoomRef.current = mapZoom;
    }
  }, [mapCenter, mapZoom]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}