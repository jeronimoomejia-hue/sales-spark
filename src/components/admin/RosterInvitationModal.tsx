import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  CheckCircle2, 
  Clock, 
  Users, 
  Bell,
  Loader2
} from "lucide-react";
import { SellerRoster } from "@/data/eventTemplates";
import { Event } from "@/data/mockData";
import { toast } from "sonner";

interface RosterInvitationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  roster: SellerRoster[];
  onConfirmSend: () => void;
}

export function RosterInvitationModal({
  open,
  onOpenChange,
  event,
  roster,
  onConfirmSend
}: RosterInvitationModalProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  const cabezas = roster.filter(s => s.position === 'cabeza');
  const promotores = roster.filter(s => s.position === 'promotor');

  const handleSendInvitations = async () => {
    setSending(true);
    
    // Simulate sending notifications
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSending(false);
    setSent(true);
    
    toast.success(`Invitaciones enviadas a ${roster.length} vendedores`, {
      description: "Recibirán una notificación para aceptar o rechazar"
    });

    setTimeout(() => {
      onConfirmSend();
      onOpenChange(false);
      setSent(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Activar Alineación y Notificar
          </DialogTitle>
          <DialogDescription>
            Se enviará una invitación a todos los vendedores en la alineación
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Event Summary */}
          <Card variant="glass" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{event.name}</h3>
                <p className="text-sm text-muted-foreground">{event.date} • {event.venue}</p>
              </div>
              <Badge variant="secondary">{event.status === 'active' ? 'Activo' : 'Próximo'}</Badge>
            </div>
          </Card>

          {/* Roster Summary */}
          <div className="grid grid-cols-2 gap-4">
            <Card variant="glass" className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{cabezas.length}</div>
              <p className="text-sm text-muted-foreground">Cabezas de Equipo</p>
            </Card>
            <Card variant="glass" className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{promotores.length}</div>
              <p className="text-sm text-muted-foreground">Promotores</p>
            </Card>
          </div>

          {/* Sellers Preview */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Vendedores a Notificar ({roster.length})
            </h4>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 rounded-lg bg-card-elevated">
              {roster.map((seller) => (
                <Badge key={seller.sellerId} variant="outline" className="gap-1">
                  <span className="w-5 h-5 rounded-full bg-gradient-party flex items-center justify-center text-white text-[10px] font-bold">
                    {seller.avatar}
                  </span>
                  {seller.name}
                  {seller.position === 'cabeza' && (
                    <span className="text-warning">★</span>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <h4 className="text-sm font-medium mb-2">Mensaje personalizado (opcional)</h4>
            <Textarea
              placeholder="Añade un mensaje para los vendedores..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* What happens next */}
          <Card variant="glass" className="p-4">
            <h4 className="font-medium mb-3">¿Qué sucederá?</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Bell className="w-4 h-4 text-primary mt-0.5" />
                Cada vendedor recibirá una notificación de invitación
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                Pueden aceptar o rechazar vender para este evento
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-warning mt-0.5" />
                Tendrán 48 horas para responder antes de ser removidos
              </li>
            </ul>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
              Cancelar
            </Button>
            <Button 
              variant="party" 
              onClick={handleSendInvitations}
              disabled={sending || sent}
              className="min-w-[180px]"
            >
              <AnimatePresence mode="wait">
                {sending ? (
                  <motion.div
                    key="sending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </motion.div>
                ) : sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-success"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    ¡Enviado!
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Activar y Notificar
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
