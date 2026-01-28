import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Calendar, 
  MapPin, 
  TicketIcon, 
  X, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { events } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export function NewEventNotificationBanner() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // Simular notificación de nuevo evento desde la tiquetera
  const newEventFromTicketing = events.find(e => e.status === 'upcoming');

  if (dismissed || !newEventFromTicketing) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative p-4 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-neon-pink/20 border border-primary/40"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 rounded-xl bg-primary/20 animate-pulse">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">1</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">Nuevo evento disponible desde la tiquetera</h3>
                  <Badge className="bg-primary/20 text-primary border-0">Quentro</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{newEventFromTicketing.name}</span> ha sido sincronizado. 
                  Configura tu alineación para comenzar a vender.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowEventModal(true)}
              >
                Ver Detalles
              </Button>
              <Button 
                variant="party" 
                size="sm"
                onClick={() => navigate(`/admin/events/${newEventFromTicketing.id}/roster`)}
              >
                Configurar Alineación
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setDismissed(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Event Details Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TicketIcon className="w-5 h-5 text-primary" />
              Nuevo Evento Sincronizado
            </DialogTitle>
            <DialogDescription>
              Este evento ha sido importado automáticamente desde tu tiquetera
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="p-4 rounded-lg bg-card-elevated border border-border">
              <h3 className="font-semibold text-lg mb-3">{newEventFromTicketing.name}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{newEventFromTicketing.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{newEventFromTicketing.venue}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {newEventFromTicketing.totalCapacity.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Capacidad Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">
                    ${(newEventFromTicketing.ticketPrice / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-muted-foreground">Precio Ticket</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">
                    {newEventFromTicketing.soldTickets}
                  </p>
                  <p className="text-xs text-muted-foreground">Pre-vendidos</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
              <p className="text-sm text-warning">
                ⚠️ Debes configurar una alineación de vendedores antes de que puedan comenzar a vender.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowEventModal(false)}
              >
                Cerrar
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Ver en Tiquetera
              </Button>
              <Button 
                variant="party" 
                className="flex-1"
                onClick={() => {
                  setShowEventModal(false);
                  navigate(`/admin/events/${newEventFromTicketing.id}/roster`);
                }}
              >
                Configurar Alineación
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
