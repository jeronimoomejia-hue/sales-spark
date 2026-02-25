import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Percent, DollarSign, MessageSquare, Megaphone, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Event } from "@/data/mockData";

interface EmptySeatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  onActivate: (eventId: string, discountPercent: number, bonusCommission: number, message: string) => void;
}

export function EmptySeatsModal({ open, onOpenChange, event, onActivate }: EmptySeatsModalProps) {
  const [discountPercent, setDiscountPercent] = useState(20);
  const [bonusCommission, setBonusCommission] = useState(3000);
  const [message, setMessage] = useState(`🚨 ¡Últimas boletas para ${event.name}! Aprovecha el descuento especial y gana comisión extra por cada venta.`);

  const remainingTickets = event.totalCapacity - event.soldTickets;

  const handleActivate = () => {
    onActivate(event.id, discountPercent, bonusCommission, message);
    toast.success("🚨 Alerta de Sillas Vacías activada", {
      description: `Se notificará a todos los vendedores del evento. Descuento: ${discountPercent}% • Bonus: +$${bonusCommission.toLocaleString()}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-destructive/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-destructive">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            Sillas Vacías — {event.name}
          </DialogTitle>
          <DialogDescription>
            Activa una oferta de emergencia para llenar las {remainingTickets.toLocaleString()} sillas restantes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Remaining tickets info */}
          <Card variant="glass" className="p-4 border-destructive/20 bg-destructive/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-destructive" />
                <span className="font-medium">Sillas sin vender</span>
              </div>
              <span className="text-2xl font-bold text-destructive">{remainingTickets.toLocaleString()}</span>
            </div>
          </Card>

          {/* Discount Slider */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Percent className="w-4 h-4 text-warning" />
              Descuento en boleta
            </label>
            <div className="flex items-center gap-4">
              <Slider
                value={[discountPercent]}
                onValueChange={(v) => setDiscountPercent(v[0])}
                min={5}
                max={50}
                step={5}
                className="flex-1"
              />
              <Badge variant="secondary" className="text-lg font-bold min-w-[60px] justify-center">
                {discountPercent}%
              </Badge>
            </div>
            {/* Price preview */}
            <div className="space-y-1.5 mt-2">
              {event.ticketTypes.map((t) => {
                const discounted = Math.round(t.price * (1 - discountPercent / 100));
                return (
                  <div key={t.id} className="flex items-center justify-between text-sm px-3 py-1.5 rounded-lg bg-card-elevated">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                      <span>{t.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="line-through text-muted-foreground text-xs">${t.price.toLocaleString()}</span>
                      <span className="font-bold text-success">${discounted.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Bonus Commission */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-success" />
              Comisión bonus extra por ticket (COP)
            </label>
            <Input
              type="number"
              value={bonusCommission}
              onChange={(e) => setBonusCommission(Number(e.target.value))}
              className="text-lg font-bold"
            />
            <p className="text-xs text-muted-foreground">
              Ejemplo: Un vendedor Nv.1 ganará ${((event.commissionsByLevel[1] || 0) + bonusCommission).toLocaleString()} por ticket (${(event.commissionsByLevel[1] || 0).toLocaleString()} base + ${bonusCommission.toLocaleString()} bonus)
            </p>
          </div>

          <Separator />

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Mensaje para vendedores
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Escribe el mensaje que recibirán los vendedores..."
            />
          </div>

          {/* Activate Button */}
          <Button
            onClick={handleActivate}
            variant="destructive"
            className="w-full gap-2 h-12 text-base animate-pulse"
          >
            <Megaphone className="w-5 h-5" />
            🚨 Activar Sillas Vacías y Notificar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
