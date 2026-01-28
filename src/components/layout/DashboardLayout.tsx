import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { AdminSidebar } from "./AdminSidebar";
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
  const isAdmin = userLevel === 4;
  
  return (
    <div className="min-h-screen bg-background">
      {isAdmin ? (
        <AdminSidebar userLevel={userLevel} />
      ) : (
        <Sidebar userLevel={userLevel} />
      )}
      <div className={`transition-all duration-300 ${isAdmin ? 'ml-[280px]' : 'ml-[260px]'}`}>
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
