'use client';

import React, { useState } from 'react';
import { Event } from '@/types/event';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { X, Heart, Send } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { EventVisibilityMap } from './event-visibility-map';
import { cn } from '@/lib/utils';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  isLiked: boolean;
  onLikeToggle: (eventId: string) => void;
  likesCount: number;
  userLat?: number;
  userLon?: number;
}

const eventTypeColors: Record<string, string> = {
  meteor_shower: 'bg-yellow-100 text-yellow-800',
  planetary_alignment: 'bg-purple-100 text-purple-800',
  iss_pass: 'bg-blue-100 text-blue-800',
  aurora: 'bg-green-100 text-green-800',
  lunar_eclipse: 'bg-orange-100 text-orange-800',
  solar_eclipse: 'bg-red-100 text-red-800',
  comet: 'bg-indigo-100 text-indigo-800',
  other: 'bg-gray-100 text-gray-800',
};

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  isLiked,
  onLikeToggle,
  likesCount,
  userLat,
  userLon,
}: EventDetailModalProps) {
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

  if (!event) return null;

  const eventDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
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

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsLoadingChat(true);

    // Simulate bot response - replace with actual API call if available
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: `Great question about ${event.title}! I'm analyzing the event details for you. This is a ${event.type.replace('_', ' ')} event happening on ${formattedDate}.`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botMessage]);
      setIsLoadingChat(false);
    }, 500);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-6xl p-0 overflow-hidden flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SheetTitle className="text-2xl">{event.title}</SheetTitle>
              <SheetDescription className="text-base mt-2">
                {formattedDate} • {formattedStartTime} - {formattedEndTime}
              </SheetDescription>
            </div>
            <Badge className={cn('whitespace-nowrap', eventTypeColors[event.type] || eventTypeColors.other)}>
              {event.type.replace('_', ' ')}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex gap-6 p-6">
          {/* Left side - Event details and map */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {event.image_url && (
              <div className="w-full h-60 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Event Information */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {event.magnitude && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Magnitude:</span> {event.magnitude}
                  </p>
                </div>
              )}

              {event.tags && event.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-4">Event Location & Visibility</h3>
                <EventVisibilityMap
                  event={event}
                  userLat={userLat}
                  userLon={userLon}
                />
              </div>

              {/* Reaction */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLikeToggle(event.id)}
                  className="gap-2"
                >
                  <Heart
                    size={18}
                    className={cn(
                      'transition-colors',
                      isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    )}
                  />
                  <span>{isLiked ? 'Liked' : 'Like'} ({likesCount})</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Chatbot */}
          <div className="w-80 flex flex-col border-l">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                      'max-w-xs rounded-lg px-4 py-2 text-sm',
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    )}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isLoadingChat && (
                <div className="flex gap-3">
                  <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-2 text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about this event..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoadingChat}
                  className="text-sm"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isLoadingChat}
                  className="h-10 w-10"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
