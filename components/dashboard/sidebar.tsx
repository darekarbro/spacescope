// @ts-nocheck
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  Heart,
  Clock,
  Settings,
  ChevronsUpDown,
  LogOut,
  Utensils,
  Coffee,
  Wine,
  Trees,
  Landmark,
  ShoppingBag,
  Bed,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useMapsStore } from "@/stores/maps-store";
// import { categories } from "@/mock/locations";


const eventNavItems = [
  { id: "recents", title: "Upcoming Events", icon: Clock, href: "/events/upcoming" },
  { id: "favorites", title: "My Events", icon: Heart, href: "/events/my" },
  { id: "all", title: "All Events", icon: MapPin, href: "/events/all" },
];

const eventCategories = [
  { id: "meteor", name: "Meteor Showers", icon: Trees, color: "#4f8cff" },
  { id: "eclipse", name: "Eclipses", icon: Landmark, color: "#ffb347" },
  { id: "conjunction", name: "Conjunctions", icon: Wine, color: "#e75480" },
  // Add more as needed
];

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string; style?: any } & any>
> = {
  utensils: Utensils,
  coffee: Coffee,
  wine: Wine,
  trees: Trees,
  landmark: Landmark,
  "shopping-bag": ShoppingBag,
  bed: Bed,
  dumbbell: Dumbbell,
};

export function EventsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMode = searchParams.get("mode") || "all";

  const handleModeChange = (mode: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", mode);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Placeholder event data (replace with real event store/API)
  const events = [
    {
      id: "perseid",
      name: "Perseid Meteor Shower",
      type: "meteor",
      date: "Aug 12, 10pm–4am",
      visibility: "Best Here",
      isSaved: true,
      isUpcoming: true,
      icon: Trees,
    },
    {
      id: "lunar-eclipse",
      name: "Total Lunar Eclipse",
      type: "eclipse",
      date: "Sep 7, 2am–5am",
      visibility: "Partial",
      isSaved: false,
      isUpcoming: true,
      icon: Landmark,
    },
    // ...more events
  ];
  const selectedCategory = "all"; // Placeholder, add state if needed
  const setSelectedCategory = () => {};

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-2.5 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 w-full hover:bg-sidebar-accent rounded-md p-1 -m-1 transition-colors shrink-0">
              <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background shrink-0">
                <Clock className="size-4" />
              </div>
              <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">SpaceScope Events</span>
                <ChevronsUpDown className="size-3 text-muted-foreground" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem>
              <Settings className="size-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent className="px-2.5">
        {/* Navigation Modes */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {eventNavItems.map((item) => {
                const isActive = currentMode === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => handleModeChange(item.id)}
                      className="h-8"
                    >
                      <item.icon className="size-4" />
                      <span className="text-sm">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Event Categories */}
        <SidebarGroup className="p-0 mt-4">
          <SidebarGroupLabel className="px-0 h-6">
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Event Categories
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentMode === "all" && !searchParams?.get("category")}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete("category");
                    params.set("mode", "all");
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  className="h-7"
                >
                  <Clock className="size-3.5" />
                  <span className="text-sm">All</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {eventCategories.map((category) => {
                const Icon = category.icon;
                const selectedCategory = searchParams?.get("category");
                const isActive = selectedCategory === category.id;
                return (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set("category", category.id);
                        params.set("mode", "all");
                        router.push(`${pathname}?${params.toString()}`);
                      }}
                      className="h-7"
                    >
                      <Icon className="size-3.5" style={{ color: category.color }} />
                      <span className="text-sm">{category.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Featured Events */}
        <SidebarGroup className="p-0 mt-4">
          <SidebarGroupLabel className="px-0 h-6">
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Featured Events
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {events.filter(e => e.isSaved).slice(0, 2).map((event) => {
                const Icon = event.icon;
                return (
                  <SidebarMenuItem key={event.id}>
                    <SidebarMenuButton className="h-10 flex items-center gap-2">
                      <Icon className="size-4" style={{ color: "#f59e0b" }} />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{event.name}</span>
                        <span className="text-xs text-muted-foreground">{event.date}</span>
                      </div>
                      <SidebarMenuBadge className="ml-auto bg-amber-500/20 text-amber-600 text-xs">★</SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2.5 pb-3">
        <div className="group-data-[collapsible=icon]:hidden space-y-3">
          <div className="group/sidebar relative flex flex-col gap-2 rounded-lg border p-4 text-sm w-full bg-background">
            <div className="text-balance text-lg font-semibold leading-tight">
              About SpaceScope
            </div>
            <div className="text-muted-foreground text-xs">
              SpaceScope is your portal to real-time celestial events, cosmic weather, satellite missions, and the impact of space technology on Earth. Explore, learn, and stay connected with the universe—all in one place.
            </div>
            <Button size="sm" className="w-full" asChild>
              <Link href="/" rel="noopener noreferrer">
                Learn more
              </Link>
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}