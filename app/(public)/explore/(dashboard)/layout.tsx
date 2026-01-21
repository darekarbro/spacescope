"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { EventsSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <EventsSidebar />
      <SidebarInset className="overflow-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
