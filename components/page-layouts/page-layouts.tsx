"use client"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "./components/app-sidebar";
import React from "react";

export default function PageLayout({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted/50">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          <div className="bg-background grid min-h-screen flex-1 place-items-center rounded-xl md:min-h-min">
            {children ?? <span className="text-muted-foreground text-sm">Content goes here</span>}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
