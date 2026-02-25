import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Percent, DollarSign, MessageSquare, Megaphone, Ticket, ArrowRight } from "lucide-react";
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
      description: `Se notificará a todos los vendedores. Descuento: ${discountPercent}% • Bonus: +$${bonusCommission.toLocaleString()}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            Sillas Vacías — {event.name}
          </DialogTitle>
          <DialogDescription>
            Activa una oferta de emergencia para llenar las {remainingTickets.toLocaleString()} sillas restantes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Remaining tickets */}
          <Card variant="glass" className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sillas sin vender</span>
              </div>
              <span className="text-2xl font-bold text-destructive">{remainingTickets.toLocaleString()}</span>
            </div>
          </Card>

          {/* Discount Slider */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              Descuento en boleta: <span className="text-primary font-bold">{discountPercent}%</span>
            </label>
            <Slider
              value={[discountPercent]}
              onValueChange={(v) => setDiscountPercent(v[0])}
              min={5}
              max={50}
              step={5}
            />
          </div>

          {/* Ticket price breakdown */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Precio con descuento</p>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border bg-muted/30">
                <span>Tipo</span>
                <span className="text-right">Original</span>
                <span></span>
                <span className="text-right">Con Descuento</span>
              </div>
              {event.ticketTypes.map((t) => {
                const discounted = Math.round(t.price * (1 - discountPercent / 100));
                const savings = t.price - discounted;
                return (
                  <div key={t.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 px-4 py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                      <span className="text-sm font-medium">{t.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground line-through">${t.price.toLocaleString()}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-bold text-success">${discounted.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Bonus Commission */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Comisión bonus extra por ticket (COP)
            </label>
            <Input
              type="number"
              value={bonusCommission}
              onChange={(e) => setBonusCommission(Number(e.target.value))}
            />
          </div>

          {/* Commission breakdown */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border bg-muted/30">
              <span>Nivel</span>
              <span className="text-right">Base</span>
              <span className="text-right">Bonus</span>
              <span className="text-right">Total</span>
            </div>
            {[
              { level: 1, name: "Común" },
              { level: 2, name: "Cabeza" },
              { level: 3, name: "Sub Socio" },
              { level: 4, name: "Socio" },
            ].map(({ level, name }) => {
              const base = event.commissionsByLevel[level] || 0;
              return (
                <div key={level} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 px-4 py-3 border-b border-border last:border-0">
                  <span className="text-sm">
                    <span className="text-muted-foreground">Nv.{level}</span> {name}
                  </span>
                  <span className="text-sm text-muted-foreground">${base.toLocaleString()}</span>
                  <span className="text-sm text-success">+${bonusCommission.toLocaleString()}</span>
                  <span className="text-sm font-bold">${(base + bonusCommission).toLocaleString()}</span>
                </div>
              );
            })}
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
            />
          </div>

          {/* Activate Button — consistent style, no color change */}
          <Button
            onClick={handleActivate}
            variant="party"
            className="w-full gap-2 h-12 text-base"
          >
            <Megaphone className="w-5 h-5" />
            Activar Sillas Vacías y Notificar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
