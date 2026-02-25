import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  TicketIcon, 
  Users, 
  DollarSign, 
  BarChart3, 
  UserPlus, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  Eye,
  Flame,
  Target,
  Wallet
} from "lucide-react";
import { events as initialEvents, Event, TicketType } from "@/data/mockData";
import { getEventAssignment } from "@/data/eventTemplates";
import { EventPricingModal } from "@/components/admin/EventPricingModal";

export default function AdminEventPanel() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [events, setEvents] = useState(initialEvents);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const event = events.find(e => e.id === eventId);
  const assignment = eventId ? getEventAssignment(eventId) : null;
  const rosterCount = assignment?.roster.length || 0;

  const handleSavePricing = useCallback((id: string, ticketTypes: TicketType[], commissions: Record<number, number>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ticketTypes, commissionsByLevel: commissions } : e));
  }, []);

  const handleDeactivateEmptySeats = useCallback(() => {
    if (!eventId) return;
    setEvents(prev => prev.map(e => e.id === eventId ? {
      ...e,
      emptySeatsAlert: { isActive: false, discountPercent: 0, bonusCommission: 0, message: '' }
    } : e));
  }, [eventId]);

  if (!event) {
    return (
      <DashboardLayout title="Evento no encontrado" subtitle="" userLevel={4}>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">Este evento no existe.</p>
          <Button onClick={() => navigate('/admin/events')}>Volver a Eventos</Button>
        </div>
      </DashboardLayout>
    );
  }

  const progress = (event.soldTickets / event.totalCapacity) * 100;
  const remainingTickets = event.totalCapacity - event.soldTickets;
  const totalRevenue = event.soldTickets * event.ticketPrice;

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

  return (
    <DashboardLayout
      title={event.name}
      subtitle="Panel de Control del Evento"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Empty Seats Alert Banner */}
        {event.emptySeatsAlert?.isActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-destructive/10 border-2 border-destructive/40 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <div>
                  <p className="font-bold text-destructive">🚨 SILLAS VACÍAS ACTIVO</p>
                  <p className="text-sm text-muted-foreground">
                    {event.emptySeatsAlert.discountPercent}% descuento • +${event.emptySeatsAlert.bonusCommission.toLocaleString()} comisión bonus
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-destructive/30 text-destructive" onClick={handleDeactivateEmptySeats}>
                Desactivar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Event Header Card */}
        <Card variant="neon" className="overflow-hidden">
          <div className="h-28 bg-gradient-party relative">
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">{event.name}</h2>
                  <div className="flex items-center gap-4 text-white/80 text-sm mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{event.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.venue}</span>
                  </div>
                </div>
                <Badge className={`${getStatusColor(event.status)} text-white text-sm px-3 py-1`}>
                  {getStatusLabel(event.status)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{event.soldTickets.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Tickets Vendidos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{remainingTickets.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Disponibles</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{rosterCount}</p>
              <p className="text-xs text-muted-foreground">Vendedores</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">${(totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground">Recaudo</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{progress.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Capacidad</p>
            </div>
          </div>
          <div className="px-6 pb-4">
            <Progress 
              value={progress} 
              indicatorColor={progress >= 80 ? "success" : progress >= 50 ? "party" : "default"}
            />
          </div>
        </Card>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Button 
            variant="outline" 
            className="gap-2 h-14 flex-col"
            onClick={() => navigate(`/admin/events/${eventId}/roster`)}
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-xs">Alineación</span>
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 h-14 flex-col text-success border-success/30 hover:bg-success/10"
            onClick={() => setShowPricingModal(true)}
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-xs">Precios y Comisiones</span>
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 h-14 flex-col"
            onClick={() => navigate(`/admin/events/${eventId}/sales`)}
          >
            <TicketIcon className="w-5 h-5" />
            <span className="text-xs">Ventas</span>
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 h-14 flex-col"
            onClick={() => navigate(`/admin/events/${eventId}/reports`)}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Reportes</span>
          </Button>
          <Button 
            variant={event.emptySeatsAlert?.isActive ? "destructive" : "outline"}
            className={`gap-2 h-14 flex-col ${!event.emptySeatsAlert?.isActive ? 'text-destructive border-destructive/30 hover:bg-destructive/10' : ''}`}
            onClick={handleDeactivateEmptySeats}
          >
            <AlertTriangle className={`w-5 h-5 ${event.emptySeatsAlert?.isActive ? 'animate-pulse' : ''}`} />
            <span className="text-xs">{event.emptySeatsAlert?.isActive ? 'Desactivar Alerta' : 'Sillas Vacías'}</span>
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview" className="gap-2">
              <Eye className="w-4 h-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Precios
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="w-4 h-4" />
              Equipo
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ticket Types Summary */}
              <Card variant="glass" className="p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TicketIcon className="w-4 h-4 text-primary" />
                  Tipos de Boleta
                </h3>
                <div className="space-y-3">
                  {event.ticketTypes.map((ticket) => {
                    const hasDiscount = event.emptySeatsAlert?.isActive;
                    const finalPrice = hasDiscount 
                      ? Math.round(ticket.price * (1 - (event.emptySeatsAlert!.discountPercent / 100)))
                      : ticket.price;
                    return (
                      <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-card-elevated">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ticket.color }} />
                          <div>
                            <p className="font-medium text-sm">{ticket.name}</p>
                            <p className="text-xs text-muted-foreground">{ticket.available.toLocaleString()} disponibles</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {hasDiscount && (
                            <p className="text-xs text-muted-foreground line-through">${ticket.price.toLocaleString()}</p>
                          )}
                          <p className="font-bold">${finalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Commissions by Level */}
              <Card variant="glass" className="p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  Comisiones por Nivel
                </h3>
                <div className="space-y-3">
                  {[
                    { level: 1, name: "Común" },
                    { level: 2, name: "Cabeza" },
                    { level: 3, name: "Sub Socio" },
                    { level: 4, name: "Socio" },
                  ].map(({ level, name }) => {
                    const base = event.commissionsByLevel[level] || 0;
                    const bonus = event.emptySeatsAlert?.isActive ? event.emptySeatsAlert.bonusCommission : 0;
                    return (
                      <div key={level} className="flex items-center justify-between p-3 rounded-lg bg-card-elevated">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-16 justify-center text-xs">Nv. {level}</Badge>
                          <span className="text-sm">{name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${(base + bonus).toLocaleString()}</p>
                          {bonus > 0 && (
                            <p className="text-xs text-success">+${bonus.toLocaleString()} bonus</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="mt-6 space-y-6">
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Configuración de Precios y Comisiones
                </h3>
                <Button variant="party" size="sm" className="gap-2" onClick={() => setShowPricingModal(true)}>
                  <Settings className="w-4 h-4" />
                  Editar Precios
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Prices */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Precios Actuales</h4>
                  {event.ticketTypes.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="text-sm">{t.name}</span>
                      </div>
                      <span className="font-semibold">${t.price.toLocaleString()} COP</span>
                    </div>
                  ))}
                </div>

                {/* Current Commissions */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Comisiones por Ticket</h4>
                  {[
                    { level: 1, name: "Común" },
                    { level: 2, name: "Cabeza" },
                    { level: 3, name: "Sub Socio" },
                    { level: 4, name: "Socio" },
                  ].map(({ level, name }) => (
                    <div key={level} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm">Nv. {level} — {name}</span>
                      <span className="font-semibold">${(event.commissionsByLevel[level] || 0).toLocaleString()} COP</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="mt-6 space-y-4">
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Equipo del Evento
                </h3>
                <Button variant="party" size="sm" className="gap-2" onClick={() => navigate(`/admin/events/${eventId}/roster`)}>
                  <UserPlus className="w-4 h-4" />
                  Gestionar Alineación
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card variant="glass" className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{rosterCount}</p>
                  <p className="text-sm text-muted-foreground">Vendedores Asignados</p>
                </Card>
                <Card variant="glass" className="p-4 text-center">
                  <p className="text-3xl font-bold text-success">{assignment?.roster.filter(r => r.status === 'active').length || 0}</p>
                  <p className="text-sm text-muted-foreground">Activos</p>
                </Card>
                <Card variant="glass" className="p-4 text-center">
                  <p className="text-3xl font-bold text-warning">{assignment?.roster.filter(r => r.status === 'pending').length || 0}</p>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <EventPricingModal
        open={showPricingModal}
        onOpenChange={setShowPricingModal}
        event={event}
        onSave={handleSavePricing}
      />

    </DashboardLayout>
  );
}
