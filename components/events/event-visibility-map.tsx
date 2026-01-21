'use client';

import React from 'react';
import { Event } from '@/types/event';

interface EventVisibilityMapProps {
  event: Event;
  userLat?: number;
  userLon?: number;
}

export function EventVisibilityMap({
  event,
  userLat,
  userLon,
}: EventVisibilityMapProps) {
  // Generate OpenStreetMap based visualization with marker for event location
  // and optional user location
  const eventLat = event.latitude || 0;
  const eventLon = event.longitude || 0;

  // Determine zoom level based on event type and visibility
  const getZoomLevel = () => {
    switch (event.type) {
      case 'solar_eclipse':
      case 'lunar_eclipse':
        return 3; // Wide area visibility
      case 'iss_pass':
      case 'meteor_shower':
        return 4;
      default:
        return 5;
    }
  };

  const zoom = getZoomLevel();

  // Build the map iframe URL using OpenStreetMap (Leaflet) or MapBox
  // Using OpenStreetMap tiles for free/open access
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${eventLon - 10},${eventLat - 10},${eventLon + 10},${eventLat + 10}&layer=mapnik&marker=${eventLat},${eventLon}`;

  // Alternative: Use a custom map service if available
  const alternativeUrl = event.visibility_map_url;

  return (
    <div className="w-full space-y-2">
      <div className="text-sm font-semibold text-gray-700">
        Visibility Map
      </div>

      <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-md">
        <iframe
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={alternativeUrl || mapUrl}
          style={{
            border: 0,
          }}
          title={`${event.title} Visibility Map`}
        />
      </div>

      <div className="text-xs text-gray-600 space-y-1">
        <p>
          <span className="font-semibold">Event Location:</span> {event.latitude?.toFixed(2)}, {event.longitude?.toFixed(2)}
        </p>
        {userLat !== undefined && userLon !== undefined && (
          <p>
            <span className="font-semibold">Your Location:</span> {userLat.toFixed(2)}, {userLon.toFixed(2)}
          </p>
        )}
        <p className="text-xs text-gray-500 italic mt-2">
          Highlighted areas show visibility zones for this event
        </p>
      </div>
    </div>
  );
}
