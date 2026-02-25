import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  MapPin, 
  TicketIcon, 
  Users,
  Plus,
  Settings,
  Eye,
  BarChart3,
  UserPlus,
  Copy,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { events as initialEvents, Event, TicketType } from "@/data/mockData";
import { eventAssignments, getEventAssignment } from "@/data/eventTemplates";
import { EventPricingModal } from "@/components/admin/EventPricingModal";

export default function AdminEvents() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'upcoming' | 'closed'>('all');
  const [events, setEvents] = useState(initialEvents);
  const [pricingEvent, setPricingEvent] = useState<Event | null>(null);

  const handleSavePricing = useCallback((eventId: string, ticketTypes: TicketType[], commissions: Record<number, number>) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, ticketTypes, commissionsByLevel: commissions } : e));
  }, []);

  const filteredEvents = events.filter(e => 
    selectedFilter === 'all' || e.status === selectedFilter
  );

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'upcoming': return 'bg-warning';
      case 'closed': return 'bg-muted';
    }
  };

  const getStatusLabel = (status: Event['status']) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'upcoming': return 'Próximo';
      case 'closed': return 'Cerrado';
    }
  };

  const handleManageRoster = (eventId: string) => {
    navigate(`/admin/events/${eventId}/roster`);
  };

  return (
    <DashboardLayout
      title="Gestión de Eventos"
      subtitle="Administra tus eventos y equipos de vendedores"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Eventos</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold">{events.filter(e => e.status === 'active').length}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <TicketIcon className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tickets Vendidos</p>
                <p className="text-2xl font-bold">
                  {events.reduce((sum, e) => sum + e.soldTickets, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendedores Activos</p>
                <p className="text-2xl font-bold">
                  {eventAssignments.reduce((sum, a) => sum + a.roster.length, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'active', 'upcoming', 'closed'] as const).map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
              >
                {filter === 'all' ? 'Todos' : getStatusLabel(filter as Event['status'])}
              </Button>
            ))}
          </div>
          <Button variant="party">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Evento
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => {
            const assignment = getEventAssignment(event.id);
            const rosterCount = assignment?.roster.length || 0;
            const progress = (event.soldTickets / event.totalCapacity) * 100;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card variant="neon" className="overflow-hidden hover:border-primary/40 transition-all group">
                  {/* Event Header with gradient */}
                  <div className="h-24 bg-gradient-party relative">
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-white truncate">{event.name}</h3>
                        <Badge className={`${getStatusColor(event.status)} text-white`}>
                          {getStatusLabel(event.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Event Info */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    {/* Ticket Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tickets vendidos</span>
                        <span className="font-semibold">
                          {event.soldTickets.toLocaleString()} / {event.totalCapacity.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={progress} 
                        indicatorColor={progress >= 80 ? "success" : progress >= 50 ? "party" : "default"}
                      />
                    </div>

                    {/* Team Info */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-card-elevated">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                          {rosterCount} vendedores
                        </span>
                      </div>
                      <Badge variant={assignment?.status === 'active' ? 'default' : 'outline'}>
                        {assignment?.status === 'active' ? 'Activo' : assignment?.status === 'draft' ? 'Borrador' : 'Sin asignar'}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleManageRoster(event.id)}
                      >
                        <UserPlus className="w-4 h-4" />
                        Alineación
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => navigate(`/admin/events/${event.id}/stats`)}
                      >
                        <BarChart3 className="w-4 h-4" />
                        Estadísticas
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 text-success border-success/30 hover:bg-success/10"
                        onClick={() => setPricingEvent(event)}
                      >
                        <DollarSign className="w-4 h-4" />
                        Precios
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <EventPricingModal
        open={!!pricingEvent}
        onOpenChange={(open) => !open && setPricingEvent(null)}
        event={pricingEvent}
        onSave={handleSavePricing}
      />
    </DashboardLayout>
  );
}
