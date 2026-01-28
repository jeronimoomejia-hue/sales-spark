import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Plus, 
  LayoutGrid, 
  Users, 
  ChevronRight,
  TicketIcon,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { events } from "@/data/mockData";
import { eventAssignments, getEventAssignment } from "@/data/eventTemplates";

export function EventManagementPanel() {
  const navigate = useNavigate();

  // Get events that need lineups
  const eventsNeedingLineup = events.filter(e => {
    const assignment = getEventAssignment(e.id);
    return e.status !== 'closed' && (!assignment || assignment.status === 'draft');
  });

  const activeEvents = events.filter(e => e.status === 'active');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card variant="neon" className="p-6 border-2 border-primary/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-party">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Gestión de Eventos</h2>
              <p className="text-sm text-muted-foreground">
                Configura alineaciones para tus eventos
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/templates")}>
              <LayoutGrid className="w-4 h-4 mr-2" />
              Plantillas
            </Button>
            <Button variant="party" onClick={() => navigate("/admin/events")}>
              <Plus className="w-4 h-4 mr-2" />
              Ver Todos los Eventos
            </Button>
          </div>
        </div>

        {/* Alert for events needing lineups */}
        {eventsNeedingLineup.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/30"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-warning" />
              <div className="flex-1">
                <p className="font-medium text-warning">
                  {eventsNeedingLineup.length} evento(s) necesitan alineación
                </p>
                <p className="text-sm text-muted-foreground">
                  Configura el equipo de vendedores antes del evento
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-warning text-warning hover:bg-warning/10"
                onClick={() => navigate(`/admin/events/${eventsNeedingLineup[0].id}/roster`)}
              >
                Configurar Ahora
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quick Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.filter(e => e.status !== 'closed').slice(0, 3).map((event, index) => {
            const assignment = getEventAssignment(event.id);
            const rosterCount = assignment?.roster.length || 0;
            const progress = (event.soldTickets / event.totalCapacity) * 100;
            const hasActiveRoster = assignment?.status === 'active';

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  variant="glass" 
                  className="p-4 hover:border-primary/40 transition-all cursor-pointer group"
                  onClick={() => navigate(`/admin/events/${event.id}/roster`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{event.name}</h3>
                        <Badge 
                          variant={event.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {event.status === 'active' ? 'Activo' : 'Próximo'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.date}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  {/* Ticket Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Tickets</span>
                      <span className="font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={progress} 
                      size="sm" 
                      indicatorColor={progress >= 80 ? "success" : "party"} 
                    />
                  </div>

                  {/* Roster Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{rosterCount} vendedores</span>
                    </div>
                    {hasActiveRoster ? (
                      <Badge className="bg-success/20 text-success gap-1 text-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Alineación Lista
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-warning gap-1 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        Pendiente
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {/* Add Event Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              variant="glass" 
              className="p-4 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px] group"
              onClick={() => navigate("/admin/events")}
            >
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-3">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <p className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Ver Más Eventos
              </p>
              <p className="text-xs text-muted-foreground">
                {events.length} eventos totales
              </p>
            </Card>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
