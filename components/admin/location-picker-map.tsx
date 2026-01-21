'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LocationPickerMapProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

export function LocationPickerMap({
  latitude,
  longitude,
  onLocationSelect,
}: LocationPickerMapProps) {
  const [mapLat, setMapLat] = useState(latitude || 20);
  const [mapLng, setMapLng] = useState(longitude || 0);
  const [zoom, setZoom] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLat, setSelectedLat] = useState<number | undefined>(latitude);
  const [selectedLng, setSelectedLng] = useState<number | undefined>(longitude);

  // Update when props change
  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      setSelectedLat(latitude);
      setSelectedLng(longitude);
      setMapLat(latitude);
      setMapLng(longitude);
      setZoom(8);
    }
  }, [latitude, longitude]);

  // Generate map iframe URL
  const getMapUrl = useCallback(() => {
    const bbox = `${mapLng - 180/Math.pow(2, zoom)},${mapLat - 90/Math.pow(2, zoom)},${mapLng + 180/Math.pow(2, zoom)},${mapLat + 90/Math.pow(2, zoom)}`;
    
    if (selectedLat !== undefined && selectedLng !== undefined) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${selectedLng - 5},${selectedLat - 5},${selectedLng + 5},${selectedLat + 5}&layer=mapnik&marker=${selectedLat},${selectedLng}`;
    }
    
    return `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 30},${mapLat - 30},${mapLng + 30},${mapLat + 30}&layer=mapnik`;
  }, [mapLat, mapLng, zoom, selectedLat, selectedLng]);

  // Search for location using Nominatim (OpenStreetMap)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        
        setSelectedLat(newLat);
        setSelectedLng(newLng);
        setMapLat(newLat);
        setMapLng(newLng);
        setZoom(8);
        onLocationSelect(newLat, newLng);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle manual coordinate input
  const handleManualCoordinates = () => {
    if (selectedLat !== undefined && selectedLng !== undefined) {
      onLocationSelect(selectedLat, selectedLng);
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedLat(undefined);
    setSelectedLng(undefined);
    onLocationSelect(0, 0);
  };

  // Quick location presets
  const presetLocations = [
    { name: 'North America', lat: 40, lng: -100 },
    { name: 'Europe', lat: 50, lng: 10 },
    { name: 'Asia', lat: 35, lng: 105 },
    { name: 'South America', lat: -15, lng: -60 },
    { name: 'Africa', lat: 0, lng: 20 },
    { name: 'Australia', lat: -25, lng: 135 },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search for a location (city, country, etc.)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          variant="outline"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Quick Location Presets */}
      <div className="flex flex-wrap gap-2">
        {presetLocations.map((loc) => (
          <button
            key={loc.name}
            type="button"
            onClick={() => {
              setSelectedLat(loc.lat);
              setSelectedLng(loc.lng);
              setMapLat(loc.lat);
              setMapLng(loc.lng);
              setZoom(4);
              onLocationSelect(loc.lat, loc.lng);
            }}
            className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative w-full h-80 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src={getMapUrl()}
          title="Location Picker Map"
          className="bg-slate-100 dark:bg-slate-800"
        />
        
        {/* Overlay instruction */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs p-2 rounded">
          <MapPin size={14} className="inline mr-1" />
          Search for a location or enter coordinates manually below
        </div>
      </div>

      {/* Manual Coordinate Input */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Latitude</label>
          <Input
            type="number"
            step="0.000001"
            min="-90"
            max="90"
            value={selectedLat ?? ''}
            onChange={(e) => {
              const val = e.target.value ? parseFloat(e.target.value) : undefined;
              setSelectedLat(val);
              if (val !== undefined && selectedLng !== undefined) {
                onLocationSelect(val, selectedLng);
              }
            }}
            placeholder="e.g., 40.7128"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Longitude</label>
          <Input
            type="number"
            step="0.000001"
            min="-180"
            max="180"
            value={selectedLng ?? ''}
            onChange={(e) => {
              const val = e.target.value ? parseFloat(e.target.value) : undefined;
              setSelectedLng(val);
              if (selectedLat !== undefined && val !== undefined) {
                onLocationSelect(selectedLat, val);
              }
            }}
            placeholder="e.g., -74.0060"
          />
        </div>
      </div>

      {/* Selected Location Display */}
      {selectedLat !== undefined && selectedLng !== undefined && (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="text-green-600" size={18} />
            <span className="text-sm">
              Selected: <strong>{selectedLat.toFixed(4)}, {selectedLng.toFixed(4)}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearSelection}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
