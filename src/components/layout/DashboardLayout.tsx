import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  userLevel?: number;
  selectedEventId?: string | 'all';
  onEventChange?: (eventId: string | 'all') => void;
}

export function DashboardLayout({ 
  children, 
  title, 
  subtitle,
  userLevel = 1,
  selectedEventId = 'all',
  onEventChange
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userLevel={userLevel} />
      <div className="ml-[260px] transition-all duration-300">
        <Header 
          title={title} 
          subtitle={subtitle} 
          selectedEventId={selectedEventId}
          onEventChange={onEventChange}
        />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
