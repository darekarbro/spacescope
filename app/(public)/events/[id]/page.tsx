'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { ArrowLeft, Heart, Send, MapPin, Calendar, Clock } from 'lucide-react';
import { eventService } from '@/lib/services/eventService';
import type { Event } from '@/types/event';
import { cn } from '@/lib/utils';

const eventTypeColors: Record<string, string> = {
  meteor_shower: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  planetary_alignment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  iss_pass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  aurora: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  lunar_eclipse: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  solar_eclipse: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  comet: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  conjunction: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  transit: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [userLocation, setUserLocation] = useState<{ lat?: number; lon?: number }>({});
  const [userId] = useState('user123'); // TODO: Get from auth context

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hello! I\'m your cosmic event assistant. Ask me anything about this event!',
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, []);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const eventData = await eventService.getById(eventId);
        setEvent(eventData);
        setLikesCount(eventData.likes_count || 0);

        // Fetch like status
        const likeStatus = await eventService.getLikeStatus(eventId, userId);
        setIsLiked(likeStatus.has_liked);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, userId]);

  const handleLikeToggle = async () => {
    try {
      const result = await eventService.toggleLike(eventId, userId);
      setIsLiked(result.has_liked);
      setLikesCount(result.likes_count);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Toggle locally on error
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsLoadingChat(true);

    // Simulate bot response - replace with actual API call
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        'visibility': `This event will be visible from coordinates ${event?.latitude?.toFixed(2)}, ${event?.longitude?.toFixed(2)}. Check the map below to see if you're in the visibility zone!`,
        'time': `The event starts at ${event?.start_time ? new Date(event.start_time).toLocaleString() : 'N/A'} and ends at ${event?.end_time ? new Date(event.end_time).toLocaleString() : 'N/A'}.`,
        'what': `${event?.title} is a ${event?.event_type.replace('_', ' ')} event. ${event?.description?.substring(0, 150)}...`,
        'default': `Great question about ${event?.title}! This is a ${event?.event_type.replace('_', ' ')} event. Is there anything specific you'd like to know about visibility, timing, or how to best observe it?`,
      };

      const lowerInput = userMessage.text.toLowerCase();
      let response = botResponses.default;
      if (lowerInput.includes('visible') || lowerInput.includes('see') || lowerInput.includes('where')) {
        response = botResponses.visibility;
      } else if (lowerInput.includes('time') || lowerInput.includes('when') || lowerInput.includes('start')) {
        response = botResponses.time;
      } else if (lowerInput.includes('what') || lowerInput.includes('about')) {
        response = botResponses.what;
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: response,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botMessage]);
      setIsLoadingChat(false);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const eventDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : eventDate;
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedStartTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const formattedEndTime = endDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Generate map URL
  const mapUrl = event.visibility_map_url || 
    `https://www.openstreetmap.org/export/embed.html?bbox=${(event.longitude || 0) - 15},${(event.latitude || 0) - 15},${(event.longitude || 0) + 15},${(event.latitude || 0) + 15}&layer=mapnik&marker=${event.latitude},${event.longitude}`;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-white hover:bg-slate-700"
            >
              <ArrowLeft size={24} />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{event.title}</h1>
              <p className="text-sm text-gray-400">{formattedDate}</p>
            </div>
            <Badge className={cn('hidden sm:flex', eventTypeColors[event.event_type] || eventTypeColors.other)}>
              {(event.event_type || 'other').replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left - Event Details & Map */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Event Image */}
            {event.image && (
              <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Event Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800 rounded-lg p-4 flex items-center gap-3">
                <Calendar className="text-blue-400" size={24} />
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-white font-medium">{eventDate.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 flex items-center gap-3">
                <Clock className="text-green-400" size={24} />
                <div>
                  <p className="text-xs text-gray-400">Time</p>
                  <p className="text-white font-medium">{formattedStartTime} - {formattedEndTime}</p>
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 flex items-center gap-3">
                <MapPin className="text-red-400" size={24} />
                <div>
                  <p className="text-xs text-gray-400">Coordinates</p>
                  <p className="text-white font-medium">{event.latitude?.toFixed(2)}, {event.longitude?.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">About This Event</h2>
              <p className="text-gray-300 leading-relaxed">{event.description}</p>

              {event.magnitude && (
                <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                  <span className="text-gray-400">Magnitude: </span>
                  <span className="text-white font-semibold">{event.magnitude}</span>
                </div>
              )}

              {event.tags && event.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-700 text-gray-300">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Like Button */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleLikeToggle}
                className={cn(
                  'gap-2 border-slate-600',
                  isLiked ? 'bg-red-500/10 border-red-500 text-red-400' : 'text-gray-300'
                )}
              >
                <Heart
                  size={20}
                  className={cn(isLiked && 'fill-red-500 text-red-500')}
                />
                {isLiked ? 'Liked' : 'Like'} ({likesCount})
              </Button>
            </div>

            {/* Visibility Map */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Visibility Map</h2>
              <p className="text-sm text-gray-400 mb-4">
                The highlighted area shows where this event will be visible. Check if your location falls within the visibility zone.
              </p>
              <div className="w-full h-96 rounded-lg overflow-hidden border border-slate-700">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={mapUrl}
                  title={`${event.title} Visibility Map`}
                  className="bg-slate-700"
                />
              </div>
              {userLocation.lat && userLocation.lon && (
                <p className="text-sm text-gray-400 mt-3">
                  📍 Your location: {userLocation.lat.toFixed(2)}, {userLocation.lon.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right - Chatbot */}
        <div className="w-80 lg:w-96 border-l border-slate-700 flex-col bg-slate-800 hidden md:flex">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">Event Assistant</h3>
            <p className="text-xs text-gray-400">Ask questions about this event</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.type === 'user' && 'justify-end'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-lg px-4 py-3 text-sm',
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-gray-200'
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoadingChat && (
              <div className="flex gap-3">
                <div className="bg-slate-700 text-gray-200 rounded-lg px-4 py-3 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about this event..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoadingChat}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isLoadingChat}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
