import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NewEventNotificationBanner } from "@/components/admin/NewEventNotificationBanner";
import { ExtendedKPICards } from "@/components/admin/ExtendedKPICards";
import { ActiveEventsOverview } from "@/components/admin/ActiveEventsOverview";
import { AdminSalesChart } from "@/components/admin/AdminSalesChart";
import { TopSellersRanking } from "@/components/admin/TopSellersRanking";
import { TeamDistributionChart } from "@/components/admin/TeamDistributionChart";
import { EnhancedAlertsPanel } from "@/components/admin/EnhancedAlertsPanel";
import { ClosureManagementPanel } from "@/components/admin/ClosureManagementPanel";
import { OrganizationalTree } from "@/components/admin/OrganizationalTree";
import { TicketIcon, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import { events } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const [selectedEventId, setSelectedEventId] = useState<string | 'all'>('all');
  
  const selectedEvent = selectedEventId === 'all' ? null : events.find(e => e.id === selectedEventId);

  // Calculate real-time stats
  const activeEvents = events.filter(e => e.status === 'active');
  const totalTicketsSold = events.reduce((sum, e) => sum + e.soldTickets, 0);
  const totalRevenue = events.reduce((sum, e) => sum + (e.soldTickets * e.ticketPrice), 0);

  return (
    <DashboardLayout 
      title="Panel de Administración" 
      subtitle="NeonEvents - Control Total"
      userLevel={4}
      selectedEventId={selectedEventId}
      onEventChange={setSelectedEventId}
    >
      <div className="space-y-6">
        {/* New Event Notification from Ticketing Platform */}
        <NewEventNotificationBanner />

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
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{selectedEvent.soldTickets.toLocaleString()} tickets vendidos</span>
              <span>|</span>
              <span>Capacidad: {selectedEvent.totalCapacity.toLocaleString()}</span>
              <span>|</span>
              <span className="text-success font-medium">
                ${((selectedEvent.soldTickets * selectedEvent.ticketPrice) / 1000000).toFixed(1)}M recaudado
              </span>
            </div>
          </motion.div>
        )}

        {/* Quick Stats Row - Only when viewing all events */}
        {selectedEventId === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{events.length}</p>
                  <p className="text-sm text-muted-foreground">Eventos Totales</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/30">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/20">
                  <TicketIcon className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalTicketsSold.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Tickets Vendidos</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-warning/20 to-warning/5 border-warning/30">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/20">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeEvents.length}</p>
                  <p className="text-sm text-muted-foreground">Eventos Activos</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-neon-pink/20 to-neon-pink/5 border-neon-pink/30">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-neon-pink/20">
                  <BarChart3 className="w-6 h-6 text-neon-pink" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${(totalRevenue / 1000000000).toFixed(2)}B</p>
                  <p className="text-sm text-muted-foreground">Recaudo Total</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Extended KPI Cards - 8 cards with detailed modals */}
        <ExtendedKPICards selectedEventId={selectedEventId} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Events Overview */}
            <ActiveEventsOverview />
            
            {/* Sales Chart */}
            <AdminSalesChart />
            
            {/* Closure Management */}
            <ClosureManagementPanel selectedEventId={selectedEventId} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Alerts Panel */}
            <EnhancedAlertsPanel />
            
            {/* Top Sellers Ranking */}
            <TopSellersRanking />
          </div>
        </div>

        {/* Team Distribution */}
        <TeamDistributionChart />

        {/* Organizational Tree */}
        <OrganizationalTree selectedEventId={selectedEventId} />
      </div>
    </DashboardLayout>
  );
}
