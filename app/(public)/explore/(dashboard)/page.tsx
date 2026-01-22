"use client";

import React, { useState, useEffect } from 'react';
import { EventCard } from '@/components/events/event-card';
import { eventService, EventWithLikes } from '@/lib/services/eventService';
import { Loader } from '@/components/ui/Loader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, FilterX, Sparkles } from 'lucide-react';

export default function ExplorePage() {
  const [events, setEvents] = useState<EventWithLikes[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithLikes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [selectedType, setSelectedType] = useState<string>('all');
  const [userId] = useState('user123');
  const [error, setError] = useState<string | null>(null);

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'solar_eclipse', label: 'Solar Eclipse' },
    { value: 'lunar_eclipse', label: 'Lunar Eclipse' },
    { value: 'meteor_shower', label: 'Meteor Shower' },
    { value: 'aurora', label: 'Aurora' },
    { value: 'iss_pass', label: 'ISS Pass' },
    { value: 'comet', label: 'Comet' },
  ];

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await eventService.getAll(100, 0, {
          status: 'approved',
          sort_by: 'start_time',
        });
        const data = response.results || [];
        setEvents(data);
        setFilteredEvents(data);

        // Fetch like statuses
        const likeStatuses: Record<string, boolean> = {};
        await Promise.all(
          data.map(async (event) => {
            try {
              const status = await eventService.getLikeStatus(event.id, userId);
              likeStatuses[event.id] = status.has_liked;
            } catch (err) {
              likeStatuses[event.id] = false;
            }
          })
        );
        setUserLikes(likeStatuses);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [userId]);

  // Filter events
  useEffect(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((event) => event.type === selectedType);
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedType, events]);

  const handleLikeToggle = async (eventId: string) => {
    try {
      const result = await eventService.toggleLike(eventId, userId);
      setUserLikes((prev) => ({ ...prev, [eventId]: result.has_liked }));
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, likes_count: result.likes_count } : event
        )
      );
    } catch (error) {
      // Toggle locally for demo on error
      setUserLikes((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
    }
  };

  const isEventLiked = (eventId: string) => userLikes[eventId] || false;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="text-yellow-400" size={28} />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Explore Cosmic Events</h1>
                <p className="text-sm text-gray-400">Discover astronomical wonders happening around the world</p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {eventTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                  className={
                    selectedType === type.value
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'border-slate-600 text-gray-300 hover:bg-slate-700'
                  }
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="text-center py-8 mb-8 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No events found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4 border-slate-600 text-gray-300"
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
              }}
            >
              <FilterX size={18} className="mr-2" />
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-6">{filteredEvents.length} event(s) found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isLiked={isEventLiked(event.id)}
                  onLikeToggle={handleLikeToggle}
                  likesCount={event.likes_count}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
