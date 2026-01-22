'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Event } from '@/types/event';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  isLiked: boolean;
  onLikeToggle: (eventId: number) => void;
  likesCount: number;
}

const eventTypeColors: Record<string, string> = {
  meteor_shower: 'bg-yellow-100 text-yellow-800',
  planetary_alignment: 'bg-purple-100 text-purple-800',
  iss_pass: 'bg-blue-100 text-blue-800',
  aurora: 'bg-green-100 text-green-800',
  lunar_eclipse: 'bg-orange-100 text-orange-800',
  solar_eclipse: 'bg-red-100 text-red-800',
  comet: 'bg-indigo-100 text-indigo-800',
  conjunction: 'bg-pink-100 text-pink-800',
  transit: 'bg-teal-100 text-teal-800',
  other: 'bg-gray-100 text-gray-800',
};

export function EventCard({
  event,
  isLiked,
  onLikeToggle,
  likesCount,
}: EventCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const eventDate = new Date(event.start_time);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeToggle(event.id);
  };

  const handleViewDetails = () => {
    router.push(`/events/${event.id}`);
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-lg',
        isHovered && 'shadow-lg scale-105'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">
              {event.title}
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              {formattedDate} at {formattedTime}
            </CardDescription>
          </div>
          <Badge
            className={cn('whitespace-nowrap', eventTypeColors[event.event_type] || eventTypeColors.other)}
          >
            {(event.event_type || 'other').replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {event.image && (
          <div className="w-full h-40 rounded-md overflow-hidden bg-gray-200">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p className="text-sm text-gray-600 line-clamp-2">
          {event.description}
        </p>

        {event.magnitude && (
          <div className="text-sm">
            <span className="font-semibold">Magnitude:</span> {event.magnitude}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLikeClick}
            className="gap-2"
          >
            <Heart
              size={18}
              className={cn(
                'transition-colors',
                isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
              )}
            />
            <span className="text-sm">{likesCount}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
