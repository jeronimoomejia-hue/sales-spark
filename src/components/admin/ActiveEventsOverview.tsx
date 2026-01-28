import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  MapPin, 
  TicketIcon, 
  Users, 
  Clock,
  ChevronRight,
  TrendingUp,
  Eye,
  Settings2,
  BarChart3
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { events } from "@/data/mockData";
import { getEventAssignment } from "@/data/eventTemplates";
import { cn } from "@/lib/utils";

export function ActiveEventsOverview() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);

  const activeAndUpcoming = events.filter(e => e.status !== 'closed');

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card variant="neon">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Eventos Activos
            </CardTitle>
            <Badge variant="secondary">{activeAndUpcoming.length} eventos</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAndUpcoming.map((event, index) => {
                const assignment = getEventAssignment(event.id);
                const progress = (event.soldTickets / event.totalCapacity) * 100;
                const rosterCount = assignment?.roster.length || 0;
                const daysLeft = Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-card-elevated border border-border hover:border-primary/40 transition-all cursor-pointer group"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-3 rounded-lg",
                          event.status === 'active' 
                            ? "bg-success/10 text-success" 
                            : "bg-warning/10 text-warning"
                        )}>
                          <TicketIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{event.name}</h3>
                            <Badge 
                              variant={event.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {event.status === 'active' ? 'En Venta' : 'Próximo'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.venue}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          {daysLeft} días
                        </Badge>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div className="text-center p-2 rounded bg-card">
                        <p className="text-lg font-bold text-primary">{event.soldTickets.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Vendidos</p>
                      </div>
                      <div className="text-center p-2 rounded bg-card">
                        <p className="text-lg font-bold">{event.totalCapacity.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Capacidad</p>
                      </div>
                      <div className="text-center p-2 rounded bg-card">
                        <p className="text-lg font-bold text-success">${(event.soldTickets * event.ticketPrice / 1000000).toFixed(0)}M</p>
                        <p className="text-xs text-muted-foreground">Recaudo</p>
                      </div>
                      <div className="text-center p-2 rounded bg-card">
                        <p className="text-lg font-bold text-neon-blue">{rosterCount}</p>
                        <p className="text-xs text-muted-foreground">Vendedores</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progreso de ventas</span>
                        <span className="font-medium">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress 
                        value={progress} 
                        size="sm"
                        indicatorColor={progress >= 80 ? "success" : progress >= 50 ? "party" : "default"}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Event Quick Actions Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TicketIcon className="w-5 h-5 text-primary" />
              {selectedEvent?.name}
            </DialogTitle>
            <DialogDescription>
              Acciones rápidas para este evento
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4 mt-4">
              {/* Event Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-card-elevated">
                  <p className="text-2xl font-bold text-primary">
                    {selectedEvent.soldTickets.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Tickets Vendidos</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-card-elevated">
                  <p className="text-2xl font-bold text-success">
                    ${(selectedEvent.soldTickets * selectedEvent.ticketPrice / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-muted-foreground">Recaudo</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-card-elevated">
                  <p className="text-2xl font-bold">
                    {((selectedEvent.soldTickets / selectedEvent.totalCapacity) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Completado</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => {
                    setSelectedEvent(null);
                    navigate(`/admin/events/${selectedEvent.id}/roster`);
                  }}
                >
                  <Users className="w-5 h-5 text-primary" />
                  <span>Ver Alineación</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => {
                    setSelectedEvent(null);
                    navigate(`/admin/events/${selectedEvent.id}/sales`);
                  }}
                >
                  <BarChart3 className="w-5 h-5 text-success" />
                  <span>Ver Ventas</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => {
                    setSelectedEvent(null);
                    navigate(`/admin/events/${selectedEvent.id}/milestones`);
                  }}
                >
                  <TrendingUp className="w-5 h-5 text-warning" />
                  <span>Ver Hitos</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => {
                    setSelectedEvent(null);
                    navigate(`/admin/events/${selectedEvent.id}/closures`);
                  }}
                >
                  <Settings2 className="w-5 h-5 text-neon-pink" />
                  <span>Ver Cierres</span>
                </Button>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedEvent(null)}>
                  Cerrar
                </Button>
                <Button 
                  variant="party" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedEvent(null);
                    navigate(`/admin/events/${selectedEvent.id}/reports`);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Reporte Completo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
