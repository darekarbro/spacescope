// @ts-nocheck
"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  MapPin,
  Heart,
  Clock,
  Search,
  X,
  Sparkles,
  Flame,
  Zap,
  Trees,
  Landmark,
  Rocket,
  Eye,
  Calendar,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  eventCategories,
  mockEvents,
  type CelestialEvent,
} from "@/mock/events";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import { useEventSelection } from "@/stores/event-selection-store";

type PanelMode = "all" | "favorites" | "recents";

interface MapsPanelProps {
  mode?: PanelMode;
}

const panelConfig = {
  all: {
    title: "All Events",
    emptyIcon: MapPin,
    emptyTitle: "No events found",
    emptyDescription: null,
    getSubtitle: (count: number) => `${count} event${count !== 1 ? "s" : ""}`,
  },
  favorites: {
    title: "Saved Events",
    emptyIcon: Heart,
    emptyTitle: "No saved events yet",
    emptyDescription: "Click the save icon on an event to add it to your list",
    getSubtitle: (count: number) => `${count} saved event${count !== 1 ? "s" : ""}`,
  },
  recents: {
    title: "Upcoming Events",
    emptyIcon: Clock,
    emptyTitle: "No upcoming events",
    emptyDescription: null,
    getSubtitle: (count: number) => `Next ${count} events`,
  },
};

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Map event category IDs to Lucide icons
function getCategoryIcon(categoryId: string) {
  const iconMap: Record<string, React.ReactNode> = {
    meteor: <Trees className="size-5" />,
    eclipse: <Flame className="size-5" />,
    conjunction: <Zap className="size-5" />,
    comet: <Sparkles className="size-5" />,
    aurora: <Sparkles className="size-5" />,
    iss: <Rocket className="size-5" />,
  };
  return iconMap[categoryId] || <MapPin className="size-5" />;
}

function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
}

export function MapsPanel({ mode = "all" }: MapsPanelProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMounted, setIsMounted] = React.useState(false);
  const [isPanelVisible, setPanelVisible] = React.useState(true);
  const [displayMode, setDisplayMode] = React.useState<"all" | "favorites" | "recents">(mode);
  
  // Read mode from URL search params, fallback to prop
  const searchParams = useSearchParams();
  const { savedEventIds, toggleSaved, isSaved, isMounted: savedEventsReady } = useSavedEvents();
  const { selectEvent } = useEventSelection();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update displayMode when URL search params change
  React.useEffect(() => {
    if (!isMounted) return;
    
    const urlMode = searchParams?.get("mode");
    if (urlMode === "favorites" || urlMode === "recents") {
      setDisplayMode(urlMode);
    } else if (urlMode === "all") {
      setDisplayMode("all");
    } else if (mode === "favorites" || mode === "recents") {
      setDisplayMode(mode);
    } else {
      setDisplayMode("all");
    }
  }, [searchParams, isMounted, mode]);

  // Get category filter from search params
  const selectedCategory = searchParams?.get("category");

  // Filter and sort events
  let events = mockEvents;
  
  // Filter by category if selected
  if (selectedCategory) {
    events = events.filter((e) => e.categoryId === selectedCategory);
  }
  
  if (displayMode === "favorites") {
    events = events.filter((e) => isSaved(e.id));
  } else if (displayMode === "recents") {
    events = events.filter((e) => e.isUpcoming);
  }
  if (searchQuery) {
    events = events.filter((e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  // Sort by start date
  events = events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const config = panelConfig[displayMode];
  const EmptyIcon = config.emptyIcon;

  if (!isMounted) {
    return null;
  }

  if (!isPanelVisible) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-4 z-20 sm:hidden size-10 bg-background! shadow-xl"
        onClick={() => setPanelVisible(true)}
      >
        <MapPin className="size-5" />
      </Button>
    );
  }

  return (
    <div className="absolute left-4 top-4 bottom-4 z-20 flex flex-col bg-background rounded-xl shadow-xl border overflow-hidden w-80 sm:w-100">
      <div className="p-4 border-b bg-linear-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5">
        <div className="">
          <h2 className="font-bold text-lg flex items-center gap-2">
            {displayMode === "recents" && <Clock className="size-5" />}
            {config.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {config.getSubtitle(events.length)}
          </p>
        </div>
        <div className="flex items-center gap-1 absolute top-4 right-4">
          <SidebarTrigger className="size-7" />
          <Button
            variant="ghost"
            size="icon"
            className="size-7 sm:hidden"
            onClick={() => setPanelVisible(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div className="p-3 border-b bg-secondary/30">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className={cn("pl-9 h-9 text-sm border-0 bg-background/60 focus-visible:bg-background", searchQuery && "pr-8")}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 size-6"
                onClick={() => setSearchQuery("")}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-2.5">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <EmptyIcon className="size-12 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-semibold">{config.emptyTitle}</p>
              {config.emptyDescription && (
                <p className="text-xs text-muted-foreground mt-2">
                  {config.emptyDescription}
                </p>
              )}
            </div>
          ) : (
            events.map((event) => {
              const category = eventCategories.find((c) => c.id === event.categoryId);
              const isSelected = selectedEventId === event.id;
              const startDate = new Date(event.start);
              const formattedDate = startDate.toLocaleDateString("en-US", { 
                month: "short", 
                day: "numeric", 
                year: "2-digit" 
              });
              const formattedTime = startDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={event.id}
                  className={cn(
                    "group relative flex flex-col gap-2.5 rounded-lg border p-3.5 cursor-pointer transition-all duration-200",
                    "hover:shadow-md hover:border-primary/40",
                    isSelected 
                      ? "border-primary/60 bg-linear-to-br from-primary/8 via-primary/4 to-transparent shadow-sm"
                      : "border-secondary/60 bg-linear-to-br from-secondary/20 via-background to-background hover:from-secondary/30"
                  )}
                  onClick={() => {
                    const newSelected = isSelected ? null : event.id;
                    setSelectedEventId(newSelected);
                    if (newSelected) {
                      selectEvent(event);
                    } else {
                      selectEvent(null);
                    }
                  }}
                >
                  {/* Header with icon and title */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-lg shadow-sm"
                      style={{ 
                        backgroundColor: `${category?.color}20`,
                        borderLeft: `3px solid ${category?.color}`
                      }}
                    >
                      <div style={{ color: category?.color }}>
                        {getCategoryIcon(event.categoryId)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight truncate">
                        {event.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {category?.name}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3.5 right-3.5 size-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>

                  {/* Date and visibility info */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-0.5">
                    <Calendar className="size-3.5 shrink-0" />
                    <span className="truncate">{formattedDate} • {formattedTime}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-0.5">
                    <Globe className="size-3.5 shrink-0" />
                    <span className="truncate">{event.visibility}</span>
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {event.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] h-5 px-2 font-medium bg-secondary/60 text-secondary-foreground/80"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 2 && (
                        <Badge variant="outline" className="text-[10px] h-5 px-2 font-medium">
                          +{event.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Expanded details on selection */}
                  {isSelected && (
                    <div className="mt-2 pt-3 border-t border-primary/20 animate-in fade-in">
                      <p className="text-xs leading-relaxed text-muted-foreground mb-3">
                        {event.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className={cn(
                            "flex-1 h-7 text-xs transition-all font-medium",
                            isSaved(event.id)
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "border border-red-200 bg-red-50 hover:bg-red-100 text-red-700"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaved(event.id);
                          }}
                        >
                          <Heart className={cn("size-3.5 mr-1", isSaved(event.id) && "fill-current")} />
                          {isSaved(event.id) ? "Saved" : "Save"}
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Learn more functionality
                          }}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}