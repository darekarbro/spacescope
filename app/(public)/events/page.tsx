'use client';

import React, { useState, useEffect } from 'react';
import { EventCard } from '@/components/events/event-card';
import { eventService } from '@/lib/services/eventService';
import type { Event } from '@/types/event';
import { Loader } from '@/components/ui/Loader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, FilterX } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLikes, setUserLikes] = useState<Record<number, boolean>>({});
  const [userId] = useState('user123'); // TODO: Get from auth context
  const [error, setError] = useState<string | null>(null);

  // Fetch upcoming events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await eventService.getAll(50, 0, {
          status: 'approved',
          sort_by: 'start_time',
        });
        setEvents(response.results);
        setFilteredEvents(response.results);

        // Fetch like statuses for all events
        const likeStatuses: Record<number, boolean> = {};
        await Promise.all(
          response.results.map(async (event) => {
            try {
              const status = await eventService.getLikeStatus(event.id, userId);
              likeStatuses[event.id] = status.has_liked;
            } catch (err) {
              // Ignore individual like status errors
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

  // Search and filter
  useEffect(() => {
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.event_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const handleLikeToggle = async (eventId: number) => {
    try {
      const result = await eventService.toggleLike(eventId, userId);
      
      // Update likes state
      setUserLikes((prev) => ({
        ...prev,
        [eventId]: result.has_liked,
      }));

      // Update events list with new likes count
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, likes_count: result.likes_count }
            : event
        )
      );
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Toggle locally for demo on error
      setUserLikes((prev) => ({
        ...prev,
        [eventId]: !prev[eventId],
      }));
    }
  };

  const isEventLiked = (eventId: number) => userLikes[eventId] || false;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Cosmic Events
            </h1>
            <p className="text-lg text-gray-300">
              Explore upcoming astronomical events visible from your location
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search events by title, description, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
              />
            </div>
            {searchTerm && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSearchTerm('')}
                className="border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                <FilterX size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="text-center py-8 mb-8 bg-red-900/20 border border-red-700 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                {searchTerm
                  ? 'No events found matching your search.'
                  : 'No upcoming events at the moment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isLiked={isEventLiked(event.id)}
                  onLikeToggle={handleLikeToggle}
                  likesCount={event.likes_count || 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
