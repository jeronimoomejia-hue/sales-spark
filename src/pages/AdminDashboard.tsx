import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminKPICards } from "@/components/admin/AdminKPICards";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { AdminSalesChart } from "@/components/admin/AdminSalesChart";
import { TopSellersRanking } from "@/components/admin/TopSellersRanking";
import { TeamDistributionChart } from "@/components/admin/TeamDistributionChart";
import { AlertsPanel } from "@/components/admin/AlertsPanel";
import { OrganizationalTree } from "@/components/admin/OrganizationalTree";
import { EventManagementPanel } from "@/components/admin/EventManagementPanel";
import { TicketIcon } from "lucide-react";
import { events } from "@/data/mockData";

export default function AdminDashboard() {
  const [selectedEventId, setSelectedEventId] = useState<string | 'all'>('all');
  
  const selectedEvent = selectedEventId === 'all' ? null : events.find(e => e.id === selectedEventId);

  return (
    <DashboardLayout 
      title="Panel de Administración" 
      subtitle="NeonEvents - Control Total"
      userLevel={4}
      selectedEventId={selectedEventId}
      onEventChange={setSelectedEventId}
    >
      <div className="space-y-6">
        {/* Event Filter Banner */}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <TicketIcon className="w-5 h-5 text-primary" />
              <span className="font-medium">Filtrando por: <span className="text-primary">{selectedEvent.name}</span></span>
            </div>
            <span className="text-sm text-muted-foreground">
              {selectedEvent.soldTickets.toLocaleString()} tickets vendidos | Capacidad: {selectedEvent.totalCapacity.toLocaleString()}
            </span>
          </motion.div>
        )}

        {/* EVENT MANAGEMENT - Most Prominent Section */}
        <EventManagementPanel />

        {/* KPI Cards - 4 columnas */}
        <AdminKPICards selectedEventId={selectedEventId} />

        {/* Quick Actions */}
        <AdminQuickActions />

        {/* Charts Row - 2/3 and 1/3 split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdminSalesChart />
          </div>
          <div>
            <AlertsPanel />
          </div>
        </div>

        {/* Second Row - Top Sellers and Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopSellersRanking />
          <TeamDistributionChart />
        </div>

        {/* Organizational Tree */}
        <OrganizationalTree selectedEventId={selectedEventId} />
      </div>
    </DashboardLayout>
  );
}
