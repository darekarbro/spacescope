"use client";

import { Suspense } from "react";
import { MapView } from "@/components/dashboard/map-view";
import { MapsPanel } from "@/components/dashboard/maps-panel";
import { MapControls } from "@/components/dashboard/map-controls";

export default function RecentsPage() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapView />
      <Suspense fallback={<div>Loading...</div>}>
        <MapsPanel mode="recents" />
      </Suspense>
      <MapControls />
    </div>
  );
}
